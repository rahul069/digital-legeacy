from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    emergency_contact_name = models.CharField(max_length=255, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    is_deceased = models.BooleanField(default=False)
    last_activity = models.DateTimeField(auto_now=True)
    inactivity_check_enabled = models.BooleanField(default=True)
    inactivity_check_days = models.PositiveIntegerField(default=90)
    
    # Security settings
    two_factor_enabled = models.BooleanField(default=False)
    login_alert_enabled = models.BooleanField(default=True)
    suspicious_activity_alert = models.BooleanField(default=True)
    
    # Notification preferences
    email_notifications_enabled = models.BooleanField(default=True)
    sms_notifications_enabled = models.BooleanField(default=False)
    beneficiary_notification_enabled = models.BooleanField(default=True)
    inactivity_warning_enabled = models.BooleanField(default=True)
    death_verification_notification = models.BooleanField(default=True)
    
    # Privacy & Data
    data_export_enabled = models.BooleanField(default=True)
    auto_backup_enabled = models.BooleanField(default=True)
    allow_emergency_access = models.BooleanField(default=False)
    
    # Preferences
    locale = models.CharField(max_length=10, default='en-US')
    timezone = models.CharField(max_length=50, default='UTC')
    theme_preference = models.CharField(max_length=20, default='dark')
    
    # Danger zone
    account_deletion_requested = models.BooleanField(default=False)
    account_deletion_date = models.DateTimeField(null=True, blank=True)
    
    # Escalation schedule (L1-L4) for inactivity monitoring
    escalation_grace_period = models.PositiveIntegerField(default=3, help_text="Days before first reminder")
    escalation_l1_days = models.PositiveIntegerField(default=7, help_text="Days after grace for L1")
    escalation_l2_days = models.PositiveIntegerField(default=14, help_text="Days after L1 for L2")
    escalation_l3_days = models.PositiveIntegerField(default=30, help_text="Days after L2 for L3")
    escalation_l4_days = models.PositiveIntegerField(default=60, help_text="Days after L3 for L4")
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'accounts_user'

    def __str__(self):
        return self.email
    
    def get_escalation_schedule(self):
        grace = self.escalation_grace_period
        return [
            {"level": "L1", "days_after_due": grace + self.escalation_l1_days},
            {"level": "L2", "days_after_due": grace + self.escalation_l1_days + self.escalation_l2_days},
            {"level": "L3", "days_after_due": grace + self.escalation_l1_days + self.escalation_l2_days + self.escalation_l3_days},
            {"level": "L4", "days_after_due": grace + self.escalation_l1_days + self.escalation_l2_days + self.escalation_l3_days + self.escalation_l4_days},
        ]
