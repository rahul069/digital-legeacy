from rest_framework import serializers
from .models import Beneficiary

class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = ['id', 'name', 'email', 'phone', 'relationship', 'address', 
                  'date_of_birth', 'is_primary', 'can_access_before_death', 'created_at']
        read_only_fields = ['id', 'created_at']

class BeneficiaryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = ['name', 'email', 'phone', 'relationship', 'address', 
                  'date_of_birth', 'is_primary', 'can_access_before_death']
