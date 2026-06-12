from django.urls import path
from .views import (
    LegacyPlanListCreateView, LegacyPlanDetailView, AddAssignmentView, RemoveAssignmentView,
    DeathVerificationListView, SubmitDeathVerificationView, VerifyDeathView,
    InheritanceReleaseListView, ClaimInheritanceView, MyInheritanceView
)

urlpatterns = [
    path('plans/', LegacyPlanListCreateView.as_view(), name='legacy-plan-list'),
    path('plans/<int:pk>/', LegacyPlanDetailView.as_view(), name='legacy-plan-detail'),
    path('plans/<int:pk>/assign/', AddAssignmentView.as_view(), name='legacy-plan-assign'),
    path('plans/<int:pk>/assign/<int:assignment_id>/', RemoveAssignmentView.as_view(), name='legacy-plan-unassign'),
    
    path('verifications/', DeathVerificationListView.as_view(), name='death-verification-list'),
    path('verifications/submit/', SubmitDeathVerificationView.as_view(), name='submit-death-verification'),
    path('verifications/<int:pk>/verify/', VerifyDeathView.as_view(), name='verify-death'),
    
    path('releases/', InheritanceReleaseListView.as_view(), name='inheritance-release-list'),
    path('claim/', ClaimInheritanceView.as_view(), name='claim-inheritance'),
    path('my-inheritance/', MyInheritanceView.as_view(), name='my-inheritance'),
]
