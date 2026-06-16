import uuid
from datetime import timedelta
from celery import shared_task
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth import get_user_model

from apps.legacy.models import DeathVerification, InheritanceRelease, InheritanceReleaseAsset, InheritanceDeliveryTracking
from apps.beneficiaries.models import Beneficiary
from apps.vault.models import VaultAsset
from apps.vault.encryption import decrypt_text
from apps.core.services.notification_orchestrator import (
    send_notification, send_beneficiary_notification, NotificationChannel
)

User = get_user_model()

@shared_task
def create_inheritance_releases(verification_id):
    """Create inheritance releases after death is verified"""
    try:
        verification = DeathVerification.objects.get(id=verification_id)
    except DeathVerification.DoesNotExist:
        return
    
    user = verification.user
    
    # Get active legacy plan
    plan = user.legacy_plans.filter(is_active=True).first()
    if not plan:
        return
    
    # For each assignment, create a release
    for assignment in plan.assignments.select_related('beneficiary', 'asset'):
        # Create or get release for beneficiary
        release, created = InheritanceRelease.objects.get_or_create(
            verification=verification,
            beneficiary=assignment.beneficiary,
            defaults={
                'access_token': uuid.uuid4().hex,
                'access_expires_at': timezone.now() + timedelta(days=365)
            }
        )
        
        # Decrypt asset data for release
        asset = assignment.asset
        InheritanceReleaseAsset.objects.get_or_create(
            release=release,
            asset=asset,
            defaults={
                'decrypted_username': decrypt_text(asset.username_encrypted),
                'decrypted_password': decrypt_text(asset.password_encrypted),
                'decrypted_notes': decrypt_text(asset.notes_encrypted),
            }
        )
        
        # Send multi-channel notification to beneficiary
        assets_list = [assignment.asset]
        channels = [NotificationChannel.EMAIL]
        if assignment.beneficiary.phone and user.sms_notifications_enabled:
            channels.append(NotificationChannel.SMS)
        
        notification_results = send_beneficiary_notification(
            beneficiary=assignment.beneficiary,
            user=user,
            assets=assets_list,
            message=f'Access your inheritance at: http://localhost:3000/claim?token={release.access_token}',
            channels=channels,
        )
        
        # Track delivery
        email_result = next((r for r in notification_results if r['channel'] == NotificationChannel.EMAIL), {})
        sms_result = next((r for r in notification_results if r['channel'] == NotificationChannel.SMS), {})
        
        InheritanceDeliveryTracking.objects.update_or_create(
            release=release,
            beneficiary=assignment.beneficiary,
            defaults={
                'email_status': 'sent' if email_result.get('success') else 'failed',
                'email_sent_at': timezone.now() if email_result.get('success') else None,
                'sms_status': 'sent' if sms_result.get('success') else None,
            }
        )

@shared_task
def check_inactivity():
    """Check for inactive users and send warnings"""
    from django.utils import timezone
    from datetime import timedelta
    
    users = User.objects.filter(
        is_deceased=False,
        inactivity_check_enabled=True
    )
    
    for user in users:
        days_inactive = (timezone.now() - user.last_activity).days
        
        if days_inactive >= user.inactivity_check_days:
            # Send final notification to beneficiaries via multi-channel
            beneficiaries = user.beneficiaries.all()
            for beneficiary in beneficiaries:
                send_beneficiary_notification(
                    beneficiary=beneficiary,
                    user=user,
                    assets=[],
                    message=f'Urgent: No activity detected for {days_inactive} days. If {user.email} has passed away, please initiate death verification at http://localhost:3000/verify-death',
                    channels=[NotificationChannel.EMAIL],
                )
        elif days_inactive >= (user.inactivity_check_days - 30):
            # Send warning to user
            if user.email_notifications_enabled:
                send_notification(
                    to=user.email,
                    channel=NotificationChannel.EMAIL,
                    subject='Inactivity Warning - Digital Legacy',
                    body=f'''Hello {user.get_full_name() or user.email},

We noticed you have not logged into your Digital Legacy account for {days_inactive} days.

If no activity is detected within the next 30 days, your designated beneficiaries will be notified to initiate the legacy transfer process.

To keep your account active, please log in at:
http://localhost:3000/login

Digital Legacy Team''',
                    metadata={'user_id': user.id, 'days_inactive': days_inactive}
                )
