from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.core.services.encrypted_storage import EncryptedStorage

User = get_user_model()

class AssetType(models.TextChoices):
    ACCOUNT = 'account', 'Account / Login'
    CRYPTO = 'crypto', 'Cryptocurrency'
    DOCUMENT = 'document', 'Document'
    SUBSCRIPTION = 'subscription', 'Subscription'
    INSURANCE = 'insurance', 'Insurance'
    FINANCIAL = 'financial', 'Financial Account'
    DEVICE = 'device', 'Device / Hardware'
    SOCIAL = 'social', 'Social Media'
    OTHER = 'other', 'Other'

class VaultAsset(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vault_assets')
    name = models.CharField(max_length=255)
    asset_type = models.CharField(max_length=20, choices=AssetType.choices, default=AssetType.ACCOUNT)
    description = models.TextField(blank=True)
    
    # Encrypted fields
    username_encrypted = models.TextField(blank=True)
    password_encrypted = models.TextField(blank=True)
    notes_encrypted = models.TextField(blank=True)
    metadata_encrypted = models.TextField(blank=True)  # JSON for type-specific fields
    
    # Non-sensitive metadata
    url = models.URLField(blank=True)
    account_number = models.CharField(max_length=255, blank=True)
    institution = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'vault_assets'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.user.email})"

class AssetDocument(models.Model):
    asset = models.ForeignKey(VaultAsset, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='vault_documents/%Y/%m/%d/', storage=EncryptedStorage())
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'vault_documents'

class AssetAccessLog(models.Model):
    asset = models.ForeignKey(VaultAsset, on_delete=models.CASCADE, related_name='access_logs')
    accessed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    accessed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    action = models.CharField(max_length=50, default='view')
    
    class Meta:
        db_table = 'vault_access_logs'
