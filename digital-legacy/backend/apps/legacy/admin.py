from django.contrib import admin
from .models import (LegacyPlan, LegacyPlanAssignment, DeathVerification, InheritanceRelease,
                     InheritanceReleaseAsset, InactivityCheckLog, AuditLog, InheritanceDeliveryTracking)

@admin.register(LegacyPlan)
class LegacyPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'user__email']

@admin.register(LegacyPlanAssignment)
class LegacyPlanAssignmentAdmin(admin.ModelAdmin):
    list_display = ['plan', 'beneficiary', 'asset']
    search_fields = ['plan__name', 'beneficiary__name', 'asset__name']

@admin.register(DeathVerification)
class DeathVerificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'status', 'submitted_by', 'submitted_at', 'verified_at']
    list_filter = ['status', 'submitted_at']
    search_fields = ['user__email', 'submitted_by__email']
    actions = ['mark_verified']
    
    def mark_verified(self, request, queryset):
        from django.utils import timezone
        for verification in queryset:
            verification.status = 'verified'
            verification.verified_at = timezone.now()
            verification.verified_by = request.user
            verification.save()
            
            user = verification.user
            user.is_deceased = True
            user.save()
    mark_verified.short_description = "Mark selected as verified"

@admin.register(InheritanceRelease)
class InheritanceReleaseAdmin(admin.ModelAdmin):
    list_display = ['verification', 'beneficiary', 'accessed_at', 'access_expires_at']
    search_fields = ['verification__user__email', 'beneficiary__email']

@admin.register(InactivityCheckLog)
class InactivityCheckLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'days_inactive', 'checked_at', 'warning_sent']
    list_filter = ['warning_sent', 'checked_at']
    search_fields = ['user__email']

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'entity_type', 'entity_id', 'created_at']
    list_filter = ['action', 'entity_type', 'created_at']
    search_fields = ['user__email']
    readonly_fields = ['created_at']

@admin.register(InheritanceDeliveryTracking)
class InheritanceDeliveryTrackingAdmin(admin.ModelAdmin):
    list_display = ['beneficiary', 'email_status', 'sms_status', 'reminder_level', 'created_at']
    list_filter = ['email_status', 'sms_status', 'reminder_level', 'created_at']
    search_fields = ['beneficiary__email', 'release__verification__user__email']
