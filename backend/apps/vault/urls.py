from django.urls import path
from .views import VaultAssetListCreateView, VaultAssetDetailView, AssetDocumentUploadView, AssetDocumentDeleteView

urlpatterns = [
    path('assets/', VaultAssetListCreateView.as_view(), name='asset-list-create'),
    path('assets/<int:pk>/', VaultAssetDetailView.as_view(), name='asset-detail'),
    path('assets/<int:asset_id>/documents/', AssetDocumentUploadView.as_view(), name='asset-document-upload'),
    path('documents/<int:pk>/', AssetDocumentDeleteView.as_view(), name='asset-document-delete'),
]
