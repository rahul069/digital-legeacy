from django.contrib import admin
from .models import Beneficiary

@admin.register(Beneficiary)
class BeneficiaryAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'email', 'relationship', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'relationship', 'created_at']
    search_fields = ['name', 'email', 'user__email']
