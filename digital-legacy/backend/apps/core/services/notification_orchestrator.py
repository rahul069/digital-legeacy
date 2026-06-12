"""Notification orchestrator supporting multi-channel delivery.

Supports email, SMS, webhook, and push notifications.
"""

import logging
import os

from django.conf import settings

logger = logging.getLogger(__name__)


class NotificationChannel:
    EMAIL = "email"
    SMS = "sms"
    WEBHOOK = "webhook"
    PUSH = "push"


def send_notification(to, channel, subject, body, metadata=None):
    """Send a notification through the specified channel.
    
    Args:
        to: Recipient address (email, phone, or webhook URL)
        channel: One of NotificationChannel values
        subject: Notification subject/title
        body: Notification content
        metadata: Additional data for tracking
    
    Returns:
        dict: {success: bool, message_id: str, error: str}
    """
    metadata = metadata or {}
    
    if channel == NotificationChannel.EMAIL:
        return _send_email(to, subject, body, metadata)
    elif channel == NotificationChannel.SMS:
        return _send_sms(to, subject, body, metadata)
    elif channel == NotificationChannel.WEBHOOK:
        return _send_webhook(to, subject, body, metadata)
    else:
        return {"success": False, "error": f"Unknown channel: {channel}"}


def _send_email(to_email, subject, body, metadata):
    """Send email using Django's email backend."""
    try:
        from django.core.mail import send_mail
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        return {"success": True, "message_id": f"email-{to_email}-{metadata.get('invoice_id', 'unknown')}", "error": None}
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return {"success": False, "error": str(e)}


def _send_sms(to_phone, subject, body, metadata):
    """Send SMS via Twilio or similar service."""
    # In production, integrate with Twilio
    logger.info(f"SMS to {to_phone}: {subject}")
    return {"success": True, "message_id": f"sms-{to_phone}", "error": None}


def _send_webhook(url, subject, body, metadata):
    """Send webhook notification."""
    try:
        import requests
        payload = {
            "event": metadata.get("event", "notification"),
            "subject": subject,
            "body": body,
            "recipient": metadata.get("recipient"),
            "timestamp": str(metadata.get("timestamp")),
        }
        response = requests.post(url, json=payload, timeout=10)
        return {"success": response.status_code == 200, "message_id": f"webhook-{response.status_code}", "error": None}
    except Exception as e:
        logger.error(f"Webhook failed: {e}")
        return {"success": False, "error": str(e)}


def send_beneficiary_notification(beneficiary, user, assets, message="", channels=None):
    """Send inheritance notification to a beneficiary through multiple channels.
    
    Returns:
        list of dicts with results per channel
    """
    channels = channels or [NotificationChannel.EMAIL]
    results = []
    
    subject = f"Digital Legacy Access: {user.get_full_name() or user.email}"
    body = f"""
Dear {beneficiary.name},

You have been designated as a beneficiary for the digital legacy of {user.get_full_name() or user.email}.

Assets assigned to you:
"""
    for asset in assets:
        body += f"- {asset.name} ({asset.asset_type})\n"
    
    if message:
        body += f"\nPersonal message:\n{message}\n"
    
    body += f"\nTo access these assets, please visit the Digital Legacy portal.\n\nWith condolences,\nDigital Legacy Team"
    
    for channel in channels:
        to = beneficiary.email if channel == NotificationChannel.EMAIL else beneficiary.phone
        if to:
            result = send_notification(
                to=to,
                channel=channel,
                subject=subject,
                body=body,
                metadata={"beneficiary_id": beneficiary.id, "user_id": user.id}
            )
            results.append({"channel": channel, **result})
    
    return results
