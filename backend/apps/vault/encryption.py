from cryptography.fernet import Fernet
from django.conf import settings
import base64
import hashlib

def get_fernet():
    """Create a Fernet instance from the ENCRYPTION_KEY setting."""
    key = settings.ENCRYPTION_KEY
    # Ensure key is 32 bytes base64-encoded
    if len(key) < 32:
        key = key + 'A' * (32 - len(key))
    key_bytes = base64.urlsafe_b64encode(hashlib.sha256(key.encode()).digest())
    return Fernet(key_bytes)

def encrypt_text(plain_text: str) -> str:
    if not plain_text:
        return ''
    f = get_fernet()
    return f.encrypt(plain_text.encode()).decode()

def decrypt_text(encrypted_text: str) -> str:
    if not encrypted_text:
        return ''
    f = get_fernet()
    return f.decrypt(encrypted_text.encode()).decode()
