import uuid
from rest_framework import serializers
from .models import LegacyPlan, LegacyPlanAssignment, DeathVerification, InheritanceRelease, InheritanceReleaseAsset
from apps.vault.models import VaultAsset
from apps.beneficiaries.models import Beneficiary

class LegacyPlanAssignmentSerializer(serializers.ModelSerializer):
    beneficiary_name = serializers.CharField(source='beneficiary.name', read_only=True)
    beneficiary_email = serializers.CharField(source='beneficiary.email', read_only=True)
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_type = serializers.CharField(source='asset.asset_type', read_only=True)
    
    class Meta:
        model = LegacyPlanAssignment
        fields = ['id', 'beneficiary', 'beneficiary_name', 'beneficiary_email', 
                  'asset', 'asset_name', 'asset_type', 'message']

class LegacyPlanSerializer(serializers.ModelSerializer):
    assignments = LegacyPlanAssignmentSerializer(many=True, read_only=True)
    assignment_count = serializers.SerializerMethodField()
    
    class Meta:
        model = LegacyPlan
        fields = ['id', 'name', 'description', 'is_active', 'assignments', 
                  'assignment_count', 'created_at', 'updated_at']
    
    def get_assignment_count(self, obj):
        return obj.assignments.count()

class LegacyPlanCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegacyPlan
        fields = ['name', 'description', 'is_active']

class AddAssignmentSerializer(serializers.Serializer):
    beneficiary_id = serializers.IntegerField()
    asset_id = serializers.IntegerField()
    message = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        
        try:
            beneficiary = Beneficiary.objects.get(id=data['beneficiary_id'], user=user)
        except Beneficiary.DoesNotExist:
            raise serializers.ValidationError("Beneficiary not found.")
        
        try:
            asset = VaultAsset.objects.get(id=data['asset_id'], user=user)
        except VaultAsset.DoesNotExist:
            raise serializers.ValidationError("Asset not found.")
        
        return data

class DeathVerificationSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    submitted_by_name = serializers.CharField(source='submitted_by.get_full_name', read_only=True)
    
    class Meta:
        model = DeathVerification
        fields = ['id', 'user', 'user_email', 'submitted_by', 'submitted_by_name',
                  'status', 'death_certificate', 'obituary_link', 'additional_notes',
                  'verified_at', 'submitted_at']
        read_only_fields = ['id', 'submitted_by', 'verified_at', 'submitted_at', 'status']

class SubmitDeathVerificationSerializer(serializers.Serializer):
    user_email = serializers.EmailField()
    obituary_link = serializers.URLField(required=False, allow_blank=True)
    additional_notes = serializers.CharField(required=False, allow_blank=True)
    death_certificate = serializers.FileField()
    
    def validate_user_email(self, value):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            self.user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        return value

class InheritanceReleaseSerializer(serializers.ModelSerializer):
    beneficiary_name = serializers.CharField(source='beneficiary.name', read_only=True)
    verification_status = serializers.CharField(source='verification.status', read_only=True)
    user_email = serializers.CharField(source='verification.user.email', read_only=True)
    
    class Meta:
        model = InheritanceRelease
        fields = ['id', 'verification', 'user_email', 'beneficiary', 'beneficiary_name',
                  'access_token', 'accessed_at', 'access_expires_at', 'created_at']
        read_only_fields = ['id', 'access_token', 'created_at']

class ClaimInheritanceSerializer(serializers.Serializer):
    email = serializers.EmailField()
    access_token = serializers.CharField()
    
    def validate(self, data):
        try:
            release = InheritanceRelease.objects.get(
                beneficiary__email=data['email'],
                access_token=data['access_token']
            )
        except InheritanceRelease.DoesNotExist:
            raise serializers.ValidationError("Invalid access token or email.")
        
        if release.verification.status != 'verified':
            raise serializers.ValidationError("Inheritance has not been verified yet.")
        
        data['release'] = release
        return data

class ReleasedAssetSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField()
    notes = serializers.CharField()
    
    class Meta:
        model = VaultAsset
        fields = ['id', 'name', 'asset_type', 'description', 'url', 'institution', 
                  'account_number', 'username', 'password', 'notes']
