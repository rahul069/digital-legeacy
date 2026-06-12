from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class LegacyPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='legacy_plans')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'legacy_plans'
    
    def __str__(self):
        return f"{self.name} - {self.user.email}"

class LegacyPlanAssignment(models.Model):
    plan = models.ForeignKey(LegacyPlan, on_delete=models.CASCADE, related_name='assignments')
    beneficiary = models.ForeignKey('beneficiaries.Beneficiary', on_delete=models.CASCADE)
    asset = models.ForeignKey('vault.VaultAsset', on_delete=models.CASCADE)
    message = models.TextField(blank=True)
    
    class Meta:
        db_table = 'legacy_plan_assignments'
        unique_together = ['plan', 'beneficiary', 'asset']

class DeathVerificationStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    VERIFIED = 'verified', 'Verified'
    REJECTED = 'rejected', 'Rejected'

class DeathVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='death_verifications')
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_verifications')
    status = models.CharField(max_length=20, choices=DeathVerificationStatus.choices, default=DeathVerificationStatus.PENDING)
    
    # Documents
    death_certificate = models.FileField(upload_to='death_certificates/%Y/%m/%d/')
    obituary_link = models.URLField(blank=True)
    additional_notes = models.TextField(blank=True)
    
    # Verification details
    verified_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_deaths')
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'death_verifications'
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"Death verification for {self.user.email} - {self.status}"

class InheritanceRelease(models.Model):
    verification = models.OneToOneField(DeathVerification, on_delete=models.CASCADE, related_name='release')
    beneficiary = models.ForeignKey('beneficiaries.Beneficiary', on_delete=models.CASCADE)
    
    # What was released
    assets = models.ManyToManyField('vault.VaultAsset', through='InheritanceReleaseAsset')
    
    # Access tracking
    access_token = models.CharField(max_length=255, unique=True)
    accessed_at = models.DateTimeField(null=True, blank=True)
    access_expires_at = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'inheritance_releases'

class InheritanceReleaseAsset(models.Model):
    release = models.ForeignKey(InheritanceRelease, on_delete=models.CASCADE)
    asset = models.ForeignKey('vault.VaultAsset', on_delete=models.CASCADE)
    decrypted_username = models.TextField(blank=True)
    decrypted_password = models.TextField(blank=True)
    decrypted_notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'inheritance_release_assets'

class InactivityCheckLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inactivity_checks')
    checked_at = models.DateTimeField(auto_now_add=True)
    days_inactive = models.PositiveIntegerField()
    warning_sent = models.BooleanField(default=False)
    escalation_sent = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'inactivity_check_logs'
        ordering = ['-checked_at']

class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_logs', null=True, blank=True)
    action = models.CharField(max_length=50)
    entity_type = models.CharField(max_length=50)
    entity_id = models.PositiveIntegerField()
    old_value = models.TextField(blank=True)
    new_value = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action} {self.entity_type} by {self.user.email if self.user else 'anonymous'}"

class DeliveryStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    SENT = 'sent', 'Sent'
    DELIVERED = 'delivered', 'Delivered'
    OPENED = 'opened', 'Opened'
    CLICKED = 'clicked', 'Clicked'
    BOUNCED = 'bounced', 'Bounced'
    FAILED = 'failed', 'Failed'

class InheritanceDeliveryTracking(models.Model):
    release = models.ForeignKey(InheritanceRelease, on_delete=models.CASCADE, related_name='delivery_tracking')
    beneficiary = models.ForeignKey('beneficiaries.Beneficiary', on_delete=models.CASCADE)
    
    # Email tracking
    email_status = models.CharField(max_length=20, choices=DeliveryStatus.choices, default=DeliveryStatus.PENDING)
    email_sent_at = models.DateTimeField(null=True, blank=True)
    email_delivered_at = models.DateTimeField(null=True, blank=True)
    email_opened_at = models.DateTimeField(null=True, blank=True)
    email_clicked_at = models.DateTimeField(null=True, blank=True)
    email_bounced_at = models.DateTimeField(null=True, blank=True)
    bounce_reason = models.TextField(blank=True)
    delivery_message_id = models.CharField(max_length=255, blank=True)
    
    # SMS tracking
    sms_status = models.CharField(max_length=20, choices=DeliveryStatus.choices, default=DeliveryStatus.PENDING)
    sms_sent_at = models.DateTimeField(null=True, blank=True)
    sms_delivered_at = models.DateTimeField(null=True, blank=True)
    
    # Reminder escalation
    reminder_level = models.IntegerField(default=0, help_text="Highest reminder level sent (0=none, 1=L1, 2=L2, 3=L3, 4=L4)")
    last_reminder_sent_at = models.DateTimeField(null=True, blank=True)
    next_reminder_scheduled_at = models.DateTimeField(null=True, blank=True)
    escalation_complete = models.BooleanField(default=False)
    
    # Claim tracking
    claimed_at = models.DateTimeField(null=True, blank=True)
    claim_ip = models.GenericIPAddressField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'inheritance_delivery_tracking'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Delivery tracking for {self.beneficiary.email} - {self.email_status}"
