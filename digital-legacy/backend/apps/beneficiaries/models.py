from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Beneficiary(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='beneficiaries')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    relationship = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_primary = models.BooleanField(default=False)
    can_access_before_death = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'beneficiaries'
        ordering = ['-is_primary', 'name']
        verbose_name_plural = 'beneficiaries'
    
    def __str__(self):
        return f"{self.name} ({self.relationship}) - {self.user.email}"
