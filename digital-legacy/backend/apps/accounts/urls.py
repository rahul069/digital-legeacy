from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView,
    PasswordChangeView, ExportDataView, DeleteAccountView,
    GenerateLegacyReportView, ScanDocumentView, AuditLogListView,
    DeliveryTrackingView, UpdateEscalationSettingsView,
    AIAnalyzeSubscriptionsView, AIValuateEstateView, AIAnalyzeLegacyGapsView,
    AIGenerateBeneficiaryGuideView, AIExtractAssetsFromDocumentView,
    AIGenerateCleanupPlanView, AIAnalyzeFraudRiskView, AIGenerateTaxReportView
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
    # AI Legacy Services
    path('ai/subscriptions/', AIAnalyzeSubscriptionsView.as_view(), name='ai-subscriptions'),
    path('ai/valuate-estate/', AIValuateEstateView.as_view(), name='ai-valuate-estate'),
    path('ai/legacy-gaps/', AIAnalyzeLegacyGapsView.as_view(), name='ai-legacy-gaps'),
    path('ai/beneficiary-guide/', AIGenerateBeneficiaryGuideView.as_view(), name='ai-beneficiary-guide'),
    path('ai/extract-assets/', AIExtractAssetsFromDocumentView.as_view(), name='ai-extract-assets'),
    path('ai/cleanup-plan/', AIGenerateCleanupPlanView.as_view(), name='ai-cleanup-plan'),
    path('ai/fraud-risk/', AIAnalyzeFraudRiskView.as_view(), name='ai-fraud-risk'),
    path('ai/tax-report/', AIGenerateTaxReportView.as_view(), name='ai-tax-report'),
]
