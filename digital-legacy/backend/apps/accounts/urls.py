from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView,
    PasswordChangeView, ExportDataView, DeleteAccountView,
    GenerateLegacyReportView, ScanDocumentView, AuditLogListView,
    DeliveryTrackingView, UpdateEscalationSettingsView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password-change/', PasswordChangeView.as_view(), name='password-change'),
    path('export-data/', ExportDataView.as_view(), name='export-data'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('legacy-report/', GenerateLegacyReportView.as_view(), name='legacy-report'),
    path('scan-document/', ScanDocumentView.as_view(), name='scan-document'),
    path('audit-logs/', AuditLogListView.as_view(), name='audit-logs'),
    path('delivery-tracking/', DeliveryTrackingView.as_view(), name='delivery-tracking'),
    path('escalation-settings/', UpdateEscalationSettingsView.as_view(), name='escalation-settings'),
]
