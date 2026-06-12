from rest_framework import serializers
from .models import VaultAsset, AssetDocument, AssetAccessLog
from .encryption import encrypt_text, decrypt_text

class AssetDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetDocument
        fields = ['id', 'file', 'description', 'uploaded_at']

import json

class VaultAssetSerializer(serializers.ModelSerializer):
    documents = AssetDocumentSerializer(many=True, read_only=True)
    username = serializers.SerializerMethodField()
    password = serializers.SerializerMethodField()
    notes = serializers.SerializerMethodField()
    metadata = serializers.SerializerMethodField()
    
    class Meta:
        model = VaultAsset
        fields = ['id', 'name', 'asset_type', 'description', 'url', 'account_number', 
                  'institution', 'username', 'password', 'notes', 'metadata', 'documents', 
                  'created_at', 'updated_at']
    
    def get_username(self, obj):
        return decrypt_text(obj.username_encrypted) if obj.username_encrypted else ''
    
    def get_password(self, obj):
        return decrypt_text(obj.password_encrypted) if obj.password_encrypted else ''
    
    def get_notes(self, obj):
        return decrypt_text(obj.notes_encrypted) if obj.notes_encrypted else ''
    
    def get_metadata(self, obj):
        if obj.metadata_encrypted:
            try:
                return json.loads(decrypt_text(obj.metadata_encrypted))
            except:
                return {}
        return {}
    
    def create(self, validated_data):
        request = self.context.get('request')
        data = request.data if request else {}
        
        metadata = {}
        for key in ['wallet_address', 'seed_phrase', 'iban', 'bic', 'policy_number', 
                    'device_serial', 'pin_code', 'phone_number', 'license_key']:
            if key in data:
                metadata[key] = data[key]
        
        asset = VaultAsset.objects.create(
            user=request.user,
            name=validated_data.get('name'),
            asset_type=validated_data.get('asset_type', 'account'),
            description=validated_data.get('description', ''),
            url=validated_data.get('url', ''),
            account_number=validated_data.get('account_number', ''),
            institution=validated_data.get('institution', ''),
            username_encrypted=encrypt_text(data.get('username', '')),
            password_encrypted=encrypt_text(data.get('password', '')),
            notes_encrypted=encrypt_text(data.get('notes', '')),
            metadata_encrypted=encrypt_text(json.dumps(metadata)) if metadata else '',
        )
        return asset
    
    def update(self, instance, validated_data):
        request = self.context.get('request')
        data = request.data if request else {}
        
        instance.name = validated_data.get('name', instance.name)
        instance.asset_type = validated_data.get('asset_type', instance.asset_type)
        instance.description = validated_data.get('description', instance.description)
        instance.url = validated_data.get('url', instance.url)
        instance.account_number = validated_data.get('account_number', instance.account_number)
        instance.institution = validated_data.get('institution', instance.institution)
        
        if 'username' in data:
            instance.username_encrypted = encrypt_text(data['username'])
        if 'password' in data:
            instance.password_encrypted = encrypt_text(data['password'])
        if 'notes' in data:
            instance.notes_encrypted = encrypt_text(data['notes'])
        
        metadata = {}
        for key in ['wallet_address', 'seed_phrase', 'iban', 'bic', 'policy_number', 
                    'device_serial', 'pin_code', 'phone_number', 'license_key']:
            if key in data:
                metadata[key] = data[key]
        if metadata:
            instance.metadata_encrypted = encrypt_text(json.dumps(metadata))
        
        instance.save()
        return instance

class VaultAssetListSerializer(serializers.ModelSerializer):
    """Serializer without decrypted fields for list views"""
    class Meta:
        model = VaultAsset
        fields = ['id', 'name', 'asset_type', 'description', 'url', 'institution', 'created_at', 'updated_at']
