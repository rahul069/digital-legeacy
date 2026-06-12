from rest_framework import generics
from .models import Beneficiary
from .serializers import BeneficiarySerializer, BeneficiaryCreateSerializer
from apps.legacy.models import AuditLog


def log_audit(request, action, entity_type, entity_id, old_value='', new_value='', metadata=None):
    AuditLog.objects.create(
        user=request.user,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        old_value=old_value,
        new_value=new_value,
        ip_address=request.META.get('REMOTE_ADDR'),
        user_agent=request.META.get('HTTP_USER_AGENT', '')[:200],
        metadata=metadata or {},
    )


class BeneficiaryListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BeneficiaryCreateSerializer
        return BeneficiarySerializer
    
    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        beneficiary = serializer.save(user=self.request.user)
        log_audit(self.request, 'create', 'beneficiary', beneficiary.id,
                  new_value=beneficiary.name, metadata={'email': beneficiary.email})

class BeneficiaryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BeneficiarySerializer
    
    def get_queryset(self):
        return Beneficiary.objects.filter(user=self.request.user)
    
    def perform_update(self, serializer):
        old_name = self.get_object().name
        beneficiary = serializer.save()
        log_audit(self.request, 'update', 'beneficiary', beneficiary.id,
                  old_value=old_name, new_value=beneficiary.name)
    
    def perform_destroy(self, instance):
        log_audit(self.request, 'delete', 'beneficiary', instance.id,
                  old_value=instance.name)
        instance.delete()
