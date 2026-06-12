"""Encrypted document storage backend.

Encrypts files before storage and decrypts on retrieval.
"""

import os
import io
from cryptography.fernet import Fernet
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile
from django.conf import settings
import hashlib
import base64


def get_fernet():
    """Create Fernet from encryption key."""
    key = settings.ENCRYPTION_KEY
    if len(key) < 32:
        key = key + 'A' * (32 - len(key))
    key_bytes = base64.urlsafe_b64encode(hashlib.sha256(key.encode()).digest())
    return Fernet(key_bytes)


class EncryptedStorage(FileSystemStorage):
    """Storage backend that encrypts files before saving."""
    
    def _save(self, name, content):
        f = get_fernet()
        # Read content
        if hasattr(content, 'read'):
            data = content.read()
        else:
            data = content
        
        # Encrypt
        encrypted = f.encrypt(data)
        
        # Save encrypted data as ContentFile (has chunks() method)
        encrypted_file = ContentFile(encrypted)
        return super()._save(name, encrypted_file)
    
    def _open(self, name, mode='rb'):
        f = get_fernet()
        file = super()._open(name, mode)
        data = file.read()
        
        # Decrypt
        decrypted = f.decrypt(data)
        
        return io.BytesIO(decrypted)


def encrypt_file_content(content_bytes):
    """Encrypt raw file bytes."""
    f = get_fernet()
    return f.encrypt(content_bytes)


def decrypt_file_content(encrypted_bytes):
    """Decrypt encrypted file bytes."""
    f = get_fernet()
    return f.decrypt(encrypted_bytes)
