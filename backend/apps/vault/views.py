from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404

from .models import VaultAsset, AssetDocument
from .serializers import VaultAssetSerializer, AssetDocumentSerializer
from apps.legacy.models import AuditLog


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

class VaultAssetListCreateView(generics.ListCreateAPIView):
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    serializer_class = VaultAssetSerializer
    
    def get_queryset(self):
        return VaultAsset.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        asset = serializer.save(user=self.request.user)
        log_audit(self.request, 'create', 'vault_asset', asset.id, 
                  new_value=asset.name, metadata={'asset_type': asset.asset_type})

class VaultAssetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VaultAssetSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    
    def get_queryset(self):
        return VaultAsset.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        old_name = self.get_object().name
        asset = serializer.save()
        log_audit(self.request, 'update', 'vault_asset', asset.id,
                  old_value=old_name, new_value=asset.name, metadata={'asset_type': asset.asset_type})
    
    def perform_destroy(self, instance):
        log_audit(self.request, 'delete', 'vault_asset', instance.id,
                  old_value=instance.name, metadata={'asset_type': instance.asset_type})
        instance.delete()

class AssetDocumentUploadView(generics.CreateAPIView):
    serializer_class = AssetDocumentSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def perform_create(self, serializer):
        asset = get_object_or_404(VaultAsset, id=self.kwargs['asset_id'], user=self.request.user)
        doc = serializer.save(asset=asset)
        log_audit(self.request, 'create', 'asset_document', doc.id,
                  new_value=doc.description or 'uploaded', metadata={'asset_id': asset.id})

class AssetDocumentDeleteView(generics.DestroyAPIView):
    serializer_class = AssetDocumentSerializer
    
    def get_queryset(self):
        return AssetDocument.objects.filter(asset__user=self.request.user)
    
    def perform_destroy(self, instance):
        log_audit(self.request, 'delete', 'asset_document', instance.id,
                  old_value=instance.description or 'document', metadata={'asset_id': instance.asset.id})
        instance.delete()
