from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'phone', 
                  'date_of_birth', 'emergency_contact_name', 'emergency_contact_phone',
                  'is_deceased', 'last_activity', 'inactivity_check_enabled', 'inactivity_check_days',
                  'two_factor_enabled', 'login_alert_enabled', 'suspicious_activity_alert',
                  'email_notifications_enabled', 'sms_notifications_enabled', 'beneficiary_notification_enabled',
                  'inactivity_warning_enabled', 'death_verification_notification',
                  'data_export_enabled', 'auto_backup_enabled', 'allow_emergency_access',
                  'locale', 'timezone', 'theme_preference',
                  'account_deletion_requested', 'account_deletion_date',
                  'escalation_grace_period', 'escalation_l1_days', 'escalation_l2_days',
                  'escalation_l3_days', 'escalation_l4_days']
        read_only_fields = ['id', 'is_deceased', 'last_activity', 'account_deletion_date']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
