from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_deceased', 'last_activity', 'date_joined']
    list_filter = ['is_deceased', 'is_staff', 'date_joined']
    search_fields = ['email', 'first_name', 'last_name']
    readonly_fields = ['last_activity', 'date_joined']
