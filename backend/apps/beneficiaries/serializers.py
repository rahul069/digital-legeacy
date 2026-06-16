from rest_framework import serializers
from .models import Beneficiary

class BeneficiarySerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Beneficiary
        fields = ['id', 'name', 'email', 'phone', 'relationship', 'address', 
                  'date_of_birth', 'photo', 'photo_url', 'is_primary', 
                  'can_access_before_death', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_photo_url(self, obj):
        if obj.photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

class BeneficiaryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = ['name', 'email', 'phone', 'relationship', 'address', 
                  'date_of_birth', 'photo', 'is_primary', 'can_access_before_death']
