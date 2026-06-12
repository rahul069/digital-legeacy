from django.contrib import admin
from .models import VaultAsset, AssetDocument, AssetAccessLog

@admin.register(VaultAsset)
class VaultAssetAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'asset_type', 'institution', 'created_at']
    list_filter = ['asset_type', 'created_at']
    search_fields = ['name', 'user__email', 'institution']

@admin.register(AssetDocument)
class AssetDocumentAdmin(admin.ModelAdmin):
    list_display = ['asset', 'description', 'uploaded_at']
    search_fields = ['asset__name', 'description']

@admin.register(AssetAccessLog)
class AssetAccessLogAdmin(admin.ModelAdmin):
    list_display = ['asset', 'accessed_by', 'action', 'accessed_at']
    list_filter = ['action', 'accessed_at']
