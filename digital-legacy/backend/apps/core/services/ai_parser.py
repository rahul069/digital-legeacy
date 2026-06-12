"""AI document scanner with Pydantic schema validation.

Extracts structured data from uploaded documents (bank statements, 
insurance policies, crypto wallet screenshots) using Google Gemini.
"""

import functools
import json
import logging
import os

from pydantic import BaseModel, Field, field_validator
from pydantic import ValidationError as PydanticValidationError

logger = logging.getLogger(__name__)


class ExtractedAsset(BaseModel):
    name: str = Field(..., min_length=1)
    asset_type: str = Field(default="other")
    institution: str = Field(default="")
    account_number: str = Field(default="")
    url: str = Field(default="")
    username: str = Field(default="")
    notes: str = Field(default="")
    confidence: float = Field(default=0.5, ge=0, le=1)


class ParsedDocument(BaseModel):
    assets: list[ExtractedAsset] = Field(default_factory=list)
    raw_text: str = Field(default="")
    
    
@functools.lru_cache(maxsize=1)
def _get_client():
    try:
        import google.generativeai as genai
        key = os.environ.get("GEMINI_API_KEY")
        if not key:
            return None
        genai.configure(api_key=key)
        return genai
    except ImportError:
        return None


SYSTEM_PROMPT = """You are a document scanning assistant for a digital estate planning app.
Given an image or text of a document (bank statement, insurance policy, crypto wallet screenshot, etc.),
extract structured asset data. Return ONLY valid JSON:
{
  "assets": [
    {
      "name": "Asset name",
      "asset_type": "account|crypto|document|subscription|insurance|financial|device|social|other",
      "institution": "Bank or company name",
      "account_number": "Account or reference number",
      "url": "Website URL if visible",
      "username": "Username or email if visible",
      "notes": "Any additional visible info",
      "confidence": 0.85
    }
  ],
  "raw_text": "Any other text you can read"
}
Do not invent data. Only include what is clearly visible in the document.
Set confidence between 0 and 1 based on how clearly you can read the information.
"""


def parse_document(raw_text: str, document_type: str = "auto"):
    """Parse a document and extract structured asset data."""
    client = _get_client()
    if not client:
        logger.warning("GEMINI_API_KEY not configured, AI parsing unavailable")
        return None
    
    try:
        prompt = f"{SYSTEM_PROMPT}\n\nDocument type hint: {document_type}\n\nDocument content:\n{raw_text}"
        
        model = client.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        
        text = response.text if response else ""
        
        # Extract JSON from response
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        if json_start >= 0 and json_end > json_start:
            json_str = text[json_start:json_end]
            data = json.loads(json_str)
            parsed = ParsedDocument(**data)
            return parsed
        
        return None
    except Exception as e:
        logger.error(f"AI parsing failed: {e}")
        return None
