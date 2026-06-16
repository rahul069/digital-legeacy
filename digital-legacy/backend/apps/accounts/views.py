from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, update_session_auth_hash
from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponse
from django.core.cache import cache
from django.utils import timezone
import json
import time

from .serializers import UserSerializer, UserRegistrationSerializer, LoginSerializer
from apps.legacy.models import AuditLog

User = get_user_model()


def log_audit(request, action, entity_type, entity_id, old_value='', new_value='', metadata=None):
    user = request.user if request.user.is_authenticated else None
    if user:
        AuditLog.objects.create(
            user=user,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            old_value=old_value,
            new_value=new_value,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:200],
            metadata=metadata or {},
        )


def log_security_event(request, action, description, metadata=None):
    """Log security events even for unauthenticated users."""
    AuditLog.objects.create(
        user=None,
        action=action,
        entity_type='security',
        entity_id=0,
        old_value='',
        new_value=description,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', '')[:200],
        metadata=metadata or {},
    )


def check_rate_limit(request, key_prefix, max_attempts=5, window_seconds=300):
    """Check if request IP is within rate limit."""
    ip = request.META.get('REMOTE_ADDR')
    cache_key = f'rate_limit:{key_prefix}:{ip}'
    attempts = cache.get(cache_key, 0)
    if attempts >= max_attempts:
        return False
    cache.set(cache_key, attempts + 1, window_seconds)
    return True

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        # Rate limiting
        if not check_rate_limit(request, 'register', max_attempts=3, window_seconds=600):
            log_security_event(request, 'rate_limit', 'Registration rate limit exceeded')
            return Response(
                {'error': 'Too many registration attempts. Please try again in 10 minutes.'}, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = Token.objects.get(user=user)
        log_security_event(request, 'register', f'New user registered: {user.email}',
                           metadata={'email': user.email})
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Rate limiting
        if not check_rate_limit(request, 'login', max_attempts=5, window_seconds=300):
            log_security_event(request, 'rate_limit', 'Login rate limit exceeded')
            return Response(
                {'error': 'Too many login attempts. Please try again in 5 minutes.'}, 
                status=status.HTTP_429_TOO_MANY_REQUESTS
            )
        
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = authenticate(
            username=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        if not user:
            log_security_event(request, 'failed_login', 
                f'Failed login for {serializer.validated_data["email"]}',
                metadata={'email': serializer.validated_data['email']})
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        token, created = Token.objects.get_or_create(user=user)
        AuditLog.objects.create(
            user=user,
            action='login',
            entity_type='user',
            entity_id=user.id,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT', '')[:200],
            metadata={'email': user.email},
        )
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key
        })

class LogoutView(APIView):
    def post(self, request):
        log_audit(request, 'logout', 'user', request.user.id, metadata={'email': request.user.email})
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):
        user = serializer.save()
        log_audit(self.request, 'update', 'user', user.id, new_value='profile updated')

class PasswordChangeView(APIView):
    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(new_password) < 8:
            return Response(
                {'error': 'Password must be at least 8 characters'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        log_audit(request, 'update', 'user', user.id, new_value='password changed')
        
        # Update token
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        
        return Response({
            'message': 'Password changed successfully',
            'token': token.key
        })

class ExportDataView(APIView):
    def get(self, request):
        user = request.user
        
        # Gather all user data
        data = {
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone': user.phone,
                'date_of_birth': str(user.date_of_birth) if user.date_of_birth else None,
            },
            'assets': [],
            'beneficiaries': [],
            'legacy_plans': [],
            'export_date': str(user.last_activity),
        }
        
        # Add assets (without decrypted credentials for security)
        for asset in user.vault_assets.all():
            data['assets'].append({
                'name': asset.name,
                'asset_type': asset.asset_type,
                'description': asset.description,
                'url': asset.url,
                'institution': asset.institution,
                'account_number': asset.account_number,
            })
        
        # Add beneficiaries
        for beneficiary in user.beneficiaries.all():
            data['beneficiaries'].append({
                'name': beneficiary.name,
                'email': beneficiary.email,
                'phone': beneficiary.phone,
                'relationship': beneficiary.relationship,
                'is_primary': beneficiary.is_primary,
            })
        
        # Add legacy plans
        for plan in user.legacy_plans.all():
            data['legacy_plans'].append({
                'name': plan.name,
                'description': plan.description,
                'is_active': plan.is_active,
            })
        
        response = JsonResponse(data, json_dumps_params={'indent': 2})
        response['Content-Disposition'] = 'attachment; filename="digital-legacy-export.json"'
        return response

class DeleteAccountView(APIView):
    def post(self, request):
        user = request.user
        
        # Delete all related data
        user.vault_assets.all().delete()
        user.beneficiaries.all().delete()
        user.legacy_plans.all().delete()
        user.death_verifications.all().delete()
        user.inheritance_releases.all().delete()
        
        # Delete user
        user.delete()
        
        return Response({'message': 'Account deleted successfully'})

class GenerateLegacyReportView(APIView):
    def get(self, request):
        user = request.user
        assets = user.vault_assets.all()
        beneficiaries = user.beneficiaries.all()
        plans = user.legacy_plans.all()
        
        from apps.core.services.pdf_generator import generate_legacy_report_pdf
        pdf_bytes = generate_legacy_report_pdf(user, assets, beneficiaries, plans)
        
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="legacy-report-{user.email}.pdf"'
        return response

class ScanDocumentView(APIView):
    def post(self, request):
        from apps.core.services.ai_parser import parse_document
        
        text = request.data.get('text', '')
        doc_type = request.data.get('document_type', 'auto')
        
        if not text:
            return Response({'error': 'No text provided'}, status=400)
        
        parsed = parse_document(text, doc_type)
        if parsed:
            return Response({
                'assets': [asset.dict() for asset in parsed.assets],
                'raw_text': parsed.raw_text,
            })
        
        return Response({'error': 'AI parsing unavailable or failed'}, status=503)

class AuditLogListView(APIView):
    def get(self, request):
        from apps.legacy.models import AuditLog
        
        logs = AuditLog.objects.filter(user=request.user).order_by('-created_at')
        data = [{
            'id': log.id,
            'action': log.action,
            'entity_type': log.entity_type,
            'entity_id': log.entity_id,
            'old_value': log.old_value,
            'new_value': log.new_value,
            'ip_address': log.ip_address,
            'metadata': log.metadata,
            'created_at': log.created_at,
        } for log in logs[:100]]
        
        return Response(data)

class DeliveryTrackingView(APIView):
    def get(self, request):
        from apps.legacy.models import InheritanceDeliveryTracking
        
        tracking = InheritanceDeliveryTracking.objects.filter(
            release__verification__user=request.user
        ).order_by('-created_at')
        
        data = [{
            'id': t.id,
            'beneficiary_name': t.beneficiary.name,
            'beneficiary_email': t.beneficiary.email,
            'email_status': t.email_status,
            'email_sent_at': t.email_sent_at,
            'email_opened_at': t.email_opened_at,
            'email_clicked_at': t.email_clicked_at,
            'sms_status': t.sms_status,
            'reminder_level': t.reminder_level,
            'escalation_complete': t.escalation_complete,
            'claimed_at': t.claimed_at,
        } for t in tracking]
        
        return Response(data)

class UpdateEscalationSettingsView(APIView):
    def post(self, request):
        user = request.user
        
        user.escalation_grace_period = request.data.get('escalation_grace_period', user.escalation_grace_period)
        user.escalation_l1_days = request.data.get('escalation_l1_days', user.escalation_l1_days)
        user.escalation_l2_days = request.data.get('escalation_l2_days', user.escalation_l2_days)
        user.escalation_l3_days = request.data.get('escalation_l3_days', user.escalation_l3_days)
        user.escalation_l4_days = request.data.get('escalation_l4_days', user.escalation_l4_days)
        user.save()
        
        return Response({
            'escalation_schedule': user.get_escalation_schedule()
        })


# =============================================================================
# AI LEGACY SERVICES API ENDPOINTS
# =============================================================================

class AIAnalyzeSubscriptionsView(APIView):
    """1. AI Subscription & Recurring Payment Discovery"""
    def post(self, request):
        from apps.core.services.ai_legacy_services import discover_subscriptions_from_text
        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'No text provided'}, status=400)
        
        subscriptions = discover_subscriptions_from_text(text)
        total_monthly = sum(s.get('monthly_cost', 0) for s in subscriptions)
        total_yearly = sum(s.get('yearly_cost', 0) for s in subscriptions)
        
        log_audit(request, 'ai_analysis', 'subscriptions', 0, 
                  new_value=f'{len(subscriptions)} subscriptions found, ${total_monthly:.2f}/month')
        
        return Response({
            'subscriptions': subscriptions,
            'total_monthly': total_monthly,
            'total_yearly': total_yearly,
            'money_saved_estimate': total_yearly,
            'analysis_date': str(timezone.now())
        })


class AIValuateEstateView(APIView):
    """2. AI Digital Estate Valuator"""
    def get(self, request):
        from apps.core.services.ai_legacy_services import calculate_digital_estate_value
        user = request.user
        assets = user.vault_assets.all()
        
        valuation = calculate_digital_estate_value(user, assets)
        
        log_audit(request, 'ai_analysis', 'estate_valuation', 0,
                  new_value=f"${valuation['total_estimated_value']:,.2f}")
        
        return Response(valuation)


class AIAnalyzeLegacyGapsView(APIView):
    """3. AI Smart Legacy Plan Advisor"""
    def get(self, request):
        from apps.core.services.ai_legacy_services import analyze_legacy_plan_gaps
        user = request.user
        assets = user.vault_assets.all()
        beneficiaries = user.beneficiaries.all()
        plans = user.legacy_plans.all()
        
        warnings = analyze_legacy_plan_gaps(user, assets, beneficiaries, plans)
        
        critical = len([w for w in warnings if w['severity'] == 'critical'])
        high = len([w for w in warnings if w['severity'] == 'high'])
        medium = len([w for w in warnings if w['severity'] == 'medium'])
        
        log_audit(request, 'ai_analysis', 'legacy_gaps', 0,
                  new_value=f'{len(warnings)} gaps found: {critical} critical, {high} high')
        
        return Response({
            'warnings': warnings,
            'summary': {
                'total': len(warnings),
                'critical': critical,
                'high': high,
                'medium': medium,
                'low': len(warnings) - critical - high - medium
            },
            'legacy_health_score': max(0, 100 - (critical * 20) - (high * 10) - (medium * 5)),
            'analysis_date': str(timezone.now())
        })


class AIGenerateBeneficiaryGuideView(APIView):
    """4. AI Beneficiary Onboarding Guide"""
    def get(self, request):
        from apps.core.services.ai_legacy_services import generate_beneficiary_guide
        from apps.beneficiaries.models import Beneficiary
        
        beneficiary_id = request.query_params.get('beneficiary_id')
        if not beneficiary_id:
            return Response({'error': 'beneficiary_id required'}, status=400)
        
        try:
            beneficiary = Beneficiary.objects.get(id=beneficiary_id, user=request.user)
        except Beneficiary.DoesNotExist:
            return Response({'error': 'Beneficiary not found'}, status=404)
        
        # Get assigned assets from legacy plans
        assigned_assets = []
        for plan in request.user.legacy_plans.filter(is_active=True):
            for assignment in plan.assignments.filter(beneficiary=beneficiary):
                assigned_assets.append(assignment.asset)
        
        guide = generate_beneficiary_guide(request.user, beneficiary, assigned_assets)
        
        log_audit(request, 'ai_generation', 'beneficiary_guide', beneficiary_id)
        
        return Response(guide)


class AIExtractAssetsFromDocumentView(APIView):
    """5. AI Document Understanding & Asset Extraction"""
    def post(self, request):
        from apps.core.services.ai_legacy_services import extract_assets_from_document
        text = request.data.get('text', '')
        document_type = request.data.get('document_type', 'auto')
        
        if not text:
            return Response({'error': 'No text provided'}, status=400)
        
        result = extract_assets_from_document(text, document_type)
        
        log_audit(request, 'ai_extraction', 'document', 0,
                  new_value=f"{len(result.get('extracted_assets', []))} assets extracted")
        
        return Response(result)


class AIGenerateCleanupPlanView(APIView):
    """6. AI Digital Footprint Cleanup Planner"""
    def get(self, request):
        from apps.core.services.ai_legacy_services import generate_cleanup_plan
        user = request.user
        assets = user.vault_assets.all()
        
        plan = generate_cleanup_plan(user, assets)
        
        log_audit(request, 'ai_generation', 'cleanup_plan', 0)
        
        return Response(plan)


class AIAnalyzeFraudRiskView(APIView):
    """7. AI Fraud Detection Monitor"""
    def get(self, request):
        from apps.core.services.ai_legacy_services import analyze_fraud_risk
        user = request.user
        assets = user.vault_assets.all()
        audit_logs = AuditLog.objects.filter(user=user).order_by('-created_at')[:100]
        
        risk_analysis = analyze_fraud_risk(user, assets, audit_logs)
        
        log_audit(request, 'ai_analysis', 'fraud_risk', 0,
                  new_value=f"Risk score: {risk_analysis['overall_risk_score']}")
        
        return Response(risk_analysis)


class AIGenerateTaxReportView(APIView):
    """8. AI Tax & Legal Compliance"""
    def get(self, request):
        from apps.core.services.ai_legacy_services import generate_tax_compliance_report
        user = request.user
        assets = user.vault_assets.all()
        beneficiaries = user.beneficiaries.all()
        
        report = generate_tax_compliance_report(user, assets, beneficiaries)
        
        log_audit(request, 'ai_generation', 'tax_report', 0)
        
        return Response(report)
