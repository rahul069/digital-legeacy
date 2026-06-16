import uuid
from datetime import timedelta
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.db import models
from .models import LegacyPlan, LegacyPlanAssignment, DeathVerification, InheritanceRelease, InheritanceReleaseAsset
from .serializers import (
    LegacyPlanSerializer, LegacyPlanCreateUpdateSerializer, AddAssignmentSerializer,
    DeathVerificationSerializer, SubmitDeathVerificationSerializer,
    InheritanceReleaseSerializer, ClaimInheritanceSerializer, ReleasedAssetSerializer
)
from apps.vault.models import VaultAsset
from apps.vault.encryption import decrypt_text
from .models import AuditLog

User = get_user_model()


def log_audit(request, action, entity_type, entity_id, old_value='', new_value='', metadata=None):
    AuditLog.objects.create(
        user=request.user,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        old_value=old_value,
        new_value=new_value,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', '')[:200],
        metadata=metadata or {},
    )

class LegacyPlanListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LegacyPlanCreateUpdateSerializer
        return LegacyPlanSerializer
    
    def get_queryset(self):
        return LegacyPlan.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        plan = serializer.save(user=self.request.user)
        log_audit(self.request, 'create', 'legacy_plan', plan.id,
                  new_value=plan.name)

class LegacyPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LegacyPlanSerializer
    
    def get_queryset(self):
        return LegacyPlan.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        old_name = self.get_object().name
        plan = serializer.save()
        log_audit(self.request, 'update', 'legacy_plan', plan.id,
                  old_value=old_name, new_value=plan.name)
    
    def perform_destroy(self, instance):
        log_audit(self.request, 'delete', 'legacy_plan', instance.id,
                  old_value=instance.name)
        instance.delete()

class AddAssignmentView(APIView):
    def post(self, request, pk):
        plan = get_object_or_404(LegacyPlan, id=pk, user=request.user)
        serializer = AddAssignmentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        assignment = LegacyPlanAssignment.objects.create(
            plan=plan,
            beneficiary_id=serializer.validated_data['beneficiary_id'],
            asset_id=serializer.validated_data['asset_id'],
            message=serializer.validated_data.get('message', '')
        )
        
        log_audit(request, 'create', 'plan_assignment', assignment.id,
                  new_value=f'Beneficiary {assignment.beneficiary_id} to Plan {plan.id}',
                  metadata={'plan_id': plan.id, 'beneficiary_id': assignment.beneficiary_id})
        
        return Response(
            {'id': assignment.id, 'message': 'Assignment added successfully.'},
            status=status.HTTP_201_CREATED
        )

class RemoveAssignmentView(APIView):
    def delete(self, request, pk, assignment_id):
        plan = get_object_or_404(LegacyPlan, id=pk, user=request.user)
        assignment = get_object_or_404(LegacyPlanAssignment, id=assignment_id, plan=plan)
        log_audit(request, 'delete', 'plan_assignment', assignment.id,
                  old_value=f'Beneficiary {assignment.beneficiary_id} from Plan {plan.id}')
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class DeathVerificationListView(generics.ListAPIView):
    serializer_class = DeathVerificationSerializer
    
    def get_queryset(self):
        # Show verifications submitted by user or for user
        user = self.request.user
        return DeathVerification.objects.filter(
            models.Q(user=user) | models.Q(submitted_by=user)
        )

class SubmitDeathVerificationView(APIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = SubmitDeathVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.user
        
        verification = DeathVerification.objects.create(
            user=user,
            submitted_by=request.user,
            death_certificate=request.FILES.get('death_certificate'),
            obituary_link=serializer.validated_data.get('obituary_link', ''),
            additional_notes=serializer.validated_data.get('additional_notes', '')
        )
        
        log_audit(request, 'create', 'death_verification', verification.id,
                  new_value=f'For user {user.email}', metadata={'submitted_for': user.id})
        
        return Response(
            DeathVerificationSerializer(verification).data,
            status=status.HTTP_201_CREATED
        )

class VerifyDeathView(APIView):
    """Admin/staff view to verify a death submission"""
    def post(self, request, pk):
        verification = get_object_or_404(DeathVerification, id=pk)
        
        # Simple check - in production, you'd have admin checks
        if not request.user.is_staff:
            return Response({'error': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        verification.status = DeathVerification.DeathVerificationStatus.VERIFIED
        verification.verified_at = timezone.now()
        verification.verified_by = request.user
        verification.save()
        
        # Mark user as deceased
        user = verification.user
        user.is_deceased = True
        user.save()
        
        log_audit(request, 'update', 'death_verification', verification.id,
                  old_value='pending', new_value='verified',
                  metadata={'deceased_user': user.email})
        
        # Trigger inheritance release creation
        from .tasks import create_inheritance_releases
        create_inheritance_releases.delay(verification.id)
        
        return Response(DeathVerificationSerializer(verification).data)

class InheritanceReleaseListView(generics.ListAPIView):
    serializer_class = InheritanceReleaseSerializer
    
    def get_queryset(self):
        return InheritanceRelease.objects.filter(
            beneficiary__email=self.request.user.email
        )

class ClaimInheritanceView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = ClaimInheritanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        release = serializer.validated_data['release']
        
        if release.accessed_at:
            return Response({'error': 'Inheritance already claimed.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if timezone.now() > release.access_expires_at:
            return Response({'error': 'Access token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
        
        release.accessed_at = timezone.now()
        release.save()
        
        log_audit(request, 'view', 'inheritance_release', release.id,
                  new_value='claimed', metadata={'beneficiary': release.beneficiary.email})
        
        # Get released assets with decrypted data
        release_assets = InheritanceReleaseAsset.objects.filter(release=release)
        
        assets = []
        for ra in release_assets:
            asset = ra.asset
            assets.append({
                'id': asset.id,
                'name': asset.name,
                'asset_type': asset.asset_type,
                'description': asset.description,
                'url': asset.url,
                'institution': asset.institution,
                'account_number': asset.account_number,
                'username': ra.decrypted_username,
                'password': ra.decrypted_password,
                'notes': ra.decrypted_notes,
            })
        
        return Response({
            'release': InheritanceReleaseSerializer(release).data,
            'assets': assets,
            'message': f"You are accessing the digital legacy of {release.verification.user.get_full_name() or release.verification.user.email}."
        })

class MyInheritanceView(APIView):
    """View for beneficiaries to see their pending inheritance"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Find releases for this user's email
        releases = InheritanceRelease.objects.filter(
            beneficiary__email=request.user.email,
            verification__status='verified'
        )
        
        return Response(InheritanceReleaseSerializer(releases, many=True).data)
