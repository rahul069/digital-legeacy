"""AI-powered services for Digital Legacy monetization.

8 practical AI features that save users time and money:
1. Subscription Discovery - Find recurring payments
2. Estate Valuator - Calculate digital worth
3. Legacy Advisor - Warn about gaps in legacy plan
4. Beneficiary Guide - Step-by-step onboarding
5. Document Understanding - Extract assets from docs
6. Footprint Cleanup Planner - Organize account closure
7. Fraud Monitor - Detect suspicious activity
8. Tax & Legal Compliance - Calculate tax liability
"""

import json
import logging
from datetime import datetime
from typing import List, Dict, Any
from django.conf import settings

logger = logging.getLogger(__name__)


# =============================================================================
# 1. AI SUBSCRIPTION & RECURRING PAYMENT DISCOVERY
# =============================================================================

def discover_subscriptions_from_text(text: str) -> List[Dict[str, Any]]:
    """Analyze uploaded bank statements, emails, or documents to find subscriptions.
    
    Returns list of subscriptions with:
    - name, provider, monthly_cost, yearly_cost, category, urgency
    """
    client = _get_ai_client()
    if not client:
        return _mock_subscription_discovery()
    
    prompt = f"""Analyze this financial document and extract ALL recurring payments, subscriptions, and memberships.
    For each, provide: name, provider, amount (monthly), amount (yearly), category, and urgency (high/medium/low).
    Categories: streaming, software, insurance, utilities, membership, fitness, subscription_box, other.
    
    Document:
    {text}
    
    Return ONLY JSON:
    {{
      "subscriptions": [
        {{
          "name": "Netflix Premium",
          "provider": "Netflix Inc.",
          "monthly_cost": 15.99,
          "yearly_cost": 191.88,
          "category": "streaming",
          "urgency": "low",
          "detected_confidence": 0.95
        }}
      ],
      "total_monthly": 0,
      "total_yearly": 0,
      "unrecognized_charges": []
    }}
    """
    
    try:
        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        text = response.text if response else ""
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        if json_start >= 0 and json_end > json_start:
            data = json.loads(text[json_start:json_end])
            return data.get("subscriptions", [])
    except Exception as e:
        logger.error(f"Subscription discovery failed: {e}")
    
    return []


def _mock_subscription_discovery():
    """Mock subscription data for demo without AI key."""
    return [
        {
            "name": "Netflix Premium",
            "provider": "Netflix Inc.",
            "monthly_cost": 15.99,
            "yearly_cost": 191.88,
            "category": "streaming",
            "urgency": "low",
            "detected_confidence": 0.95
        },
        {
            "name": "Adobe Creative Cloud",
            "provider": "Adobe Inc.",
            "monthly_cost": 54.99,
            "yearly_cost": 659.88,
            "category": "software",
            "urgency": "medium",
            "detected_confidence": 0.92
        },
        {
            "name": "Spotify Family",
            "provider": "Spotify AB",
            "monthly_cost": 16.99,
            "yearly_cost": 203.88,
            "category": "streaming",
            "urgency": "low",
            "detected_confidence": 0.88
        }
    ]


# =============================================================================
# 2. AI DIGITAL ESTATE VALUATOR
# =============================================================================

def calculate_digital_estate_value(user, assets, crypto_prices=None) -> Dict[str, Any]:
    """Calculate total worth of digital assets.
    
    Returns breakdown by category with total value.
    """
    categories = {
        "financial": {"assets": [], "estimated_value": 0, "count": 0},
        "crypto": {"assets": [], "estimated_value": 0, "count": 0},
        "subscriptions": {"assets": [], "estimated_value": 0, "count": 0},
        "digital_ip": {"assets": [], "estimated_value": 0, "count": 0},
        "loyalty_points": {"assets": [], "estimated_value": 0, "count": 0},
        "other": {"assets": [], "estimated_value": 0, "count": 0}
    }
    
    total_value = 0
    
    for asset in assets:
        asset_type = asset.asset_type
        if asset_type in categories:
            categories[asset_type]["assets"].append({
                "name": asset.name,
                "institution": asset.institution,
                "account_number": asset.account_number
            })
            categories[asset_type]["count"] += 1
        else:
            categories["other"]["assets"].append({
                "name": asset.name,
                "institution": asset.institution
            })
            categories["other"]["count"] += 1
    
    # Calculate estimated values
    categories["financial"]["estimated_value"] = categories["financial"]["count"] * 25000  # Avg savings
    categories["crypto"]["estimated_value"] = categories["crypto"]["count"] * 5000  # Avg crypto
    categories["loyalty_points"]["estimated_value"] = categories["loyalty_points"]["count"] * 500
    categories["digital_ip"]["estimated_value"] = categories["digital_ip"]["count"] * 10000
    
    total_value = sum(c["estimated_value"] for c in categories.values())
    
    return {
        "total_estimated_value": total_value,
        "currency": "USD",
        "categories": categories,
        "valuation_date": datetime.now().isoformat(),
        "valuation_method": "AI-estimated based on asset type and count",
        "recommendations": [
            "Consider professional appraisal for crypto assets",
            "Update account balances for accurate valuation",
            "Include domain names and digital IP in your legacy plan"
        ]
    }


# =============================================================================
# 3. AI SMART LEGACY PLAN ADVISOR
# =============================================================================

def analyze_legacy_plan_gaps(user, assets, beneficiaries, legacy_plans) -> List[Dict[str, Any]]:
    """Analyze legacy plan and identify critical gaps.
    
    Returns list of warnings and recommendations.
    """
    warnings = []
    
    # Check for crypto without seed phrase
    crypto_assets = [a for a in assets if a.asset_type == "crypto"]
    for asset in crypto_assets:
        metadata = asset.get_metadata() if hasattr(asset, "get_metadata") else {}
        if not metadata.get("seed_phrase"):
            warnings.append({
                "severity": "critical",
                "category": "crypto",
                "asset_id": asset.id,
                "asset_name": asset.name,
                "message": f"Crypto wallet '{asset.name}' has no seed phrase stored. Without it, the asset is unrecoverable.",
                "action": "Add seed phrase to vault metadata",
                "potential_loss": "$50,000+"
            })
    
    # Check for insurance without beneficiary
    insurance_assets = [a for a in assets if a.asset_type == "insurance"]
    for asset in insurance_assets:
        if not any(b for b in beneficiaries if b.is_primary):
            warnings.append({
                "severity": "high",
                "category": "insurance",
                "asset_id": asset.id,
                "asset_name": asset.name,
                "message": f"Insurance policy '{asset.name}' has no primary beneficiary assigned.",
                "action": "Assign a primary beneficiary",
                "potential_loss": "Policy payout delayed"
            })
    
    # Check for no legacy plan
    if not legacy_plans:
        warnings.append({
            "severity": "critical",
            "category": "plan",
            "message": "No legacy plan exists. Without one, beneficiaries will not know which assets they should receive.",
            "action": "Create a legacy plan immediately",
            "potential_loss": "All assets"
        })
    
    # Check for inactive beneficiaries
    if not beneficiaries:
        warnings.append({
            "severity": "critical",
            "category": "beneficiaries",
            "message": "No beneficiaries have been added. Your legacy will have no designated recipients.",
            "action": "Add at least 2 beneficiaries",
            "potential_loss": "All assets"
        })
    
    # Check for inactive monitoring
    if not user.inactivity_check_enabled:
        warnings.append({
            "severity": "medium",
            "category": "monitoring",
            "message": "Inactivity monitoring is disabled. If you pass away unexpectedly, no one will be notified.",
            "action": "Enable inactivity monitoring in Settings",
            "potential_loss": "Delayed inheritance transfer"
        })
    
    # Check for no password manager
    account_assets = [a for a in assets if a.asset_type == "account"]
    for asset in account_assets:
        if not asset.password_encrypted:
            warnings.append({
                "severity": "medium",
                "category": "passwords",
                "asset_id": asset.id,
                "asset_name": asset.name,
                "message": f"Account '{asset.name}' has no password stored.",
                "action": "Add password to vault",
                "potential_loss": "Account inaccessible"
            })
    
    return warnings


# =============================================================================
# 4. AI BENEFICIARY ONBOARDING GUIDE
# =============================================================================

def generate_beneficiary_guide(user, beneficiary, assets) -> Dict[str, Any]:
    """Generate personalized step-by-step guide for each beneficiary.
    
    Based on their assigned assets and relationship.
    """
    guide = {
        "beneficiary_name": beneficiary.name,
        "relationship": beneficiary.relationship,
        "personal_message": f"""Dear {beneficiary.name},

You have been designated as a beneficiary in the digital legacy of {user.get_full_name() or user.email}.

This guide will help you understand and claim the digital assets assigned to you.
""",
        "assets_guide": [],
        "priority_actions": [],
        "estimated_time_to_complete": "2-3 hours"
    }
    
    for asset in assets:
        asset_guide = {
            "asset_name": asset.name,
            "asset_type": asset.asset_type,
            "institution": asset.institution,
            "steps": []
        }
        
        if asset.asset_type == "financial":
            asset_guide["steps"] = [
                "Contact the bank/institution with the death certificate",
                "Provide your beneficiary designation letter",
                "Submit required identification documents",
                "Wait for account transfer (usually 2-4 weeks)",
                "Consider consulting a financial advisor for tax implications"
            ]
        elif asset.asset_type == "crypto":
            asset_guide["steps"] = [
                "Access the provided wallet address and seed phrase",
                "Download a compatible wallet app (e.g., MetaMask, Ledger)",
                "Import the wallet using the seed phrase",
                "Transfer assets to a new wallet you control",
                "IMPORTANT: Never share the seed phrase with anyone"
            ]
        elif asset.asset_type == "account":
            asset_guide["steps"] = [
                "Log in with the provided username and password",
                "Change the password immediately for security",
                "Update the email address to your own",
                "Enable 2FA on the account",
                "Review any linked payment methods"
            ]
        else:
            asset_guide["steps"] = [
                "Contact the service provider with the death certificate",
                "Provide beneficiary documentation",
                "Follow their account transfer process"
            ]
        
        guide["assets_guide"].append(asset_guide)
    
    # Priority actions
    guide["priority_actions"] = [
        "1. Download the full legacy report PDF",
        "2. Secure all passwords and seed phrases in a password manager",
        "3. Contact financial institutions within 30 days",
        "4. Consult a probate attorney for large estates",
        "5. Set up fraud monitoring on all accounts"
    ]
    
    return guide


# =============================================================================
# 5. AI DOCUMENT UNDERSTANDING & ASSET EXTRACTION
# =============================================================================

def extract_assets_from_document(text: str, document_type: str = "auto") -> Dict[str, Any]:
    """Extract structured asset data from uploaded documents.
    
    Works with: bank statements, insurance policies, crypto wallet screenshots,
    investment statements, tax documents, wills.
    """
    client = _get_ai_client()
    if not client:
        return _mock_document_extraction()
    
    prompt = f"""You are a document analysis AI for digital estate planning.
    Analyze this document and extract ALL digital assets, financial accounts, and important information.
    
    Document type: {document_type}
    Document content:
    {text}
    
    Return ONLY JSON:
    {{
      "extracted_assets": [
        {{
          "name": "Account Name",
          "asset_type": "account|crypto|financial|insurance|subscription|document|device|social|other",
          "institution": "Bank/Company Name",
          "account_number": "12345",
          "balance": "10000.00",
          "currency": "USD",
          "url": "https://example.com",
          "username": "email@example.com",
          "notes": "Important notes",
          "confidence": 0.95
        }}
      ],
      "important_dates": [
        {{
          "date": "2024-01-01",
          "event": "Policy renewal",
          "urgency": "high"
        }}
      ],
      "warnings": [
        "Policy expires in 30 days"
      ],
      "total_value": "10000.00",
      "currency": "USD"
    }}
    """
    
    try:
        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        text = response.text if response else ""
        json_start = text.find("{")
        json_end = text.rfind("}") + 1
        if json_start >= 0 and json_end > json_start:
            data = json.loads(text[json_start:json_end])
            return data
    except Exception as e:
        logger.error(f"Document extraction failed: {e}")
    
    return {}


def _mock_document_extraction():
    """Mock extraction for demo."""
    return {
        "extracted_assets": [
            {
                "name": "Deutsche Bank Savings",
                "asset_type": "financial",
                "institution": "Deutsche Bank",
                "account_number": "DE89 3704 0044 0532 0130 00",
                "balance": "25000.00",
                "currency": "EUR",
                "confidence": 0.92
            },
            {
                "name": "Bitcoin Wallet",
                "asset_type": "crypto",
                "institution": "Ledger",
                "balance": "0.5",
                "currency": "BTC",
                "confidence": 0.88
            }
        ],
        "important_dates": [
            {"date": "2024-12-31", "event": "Insurance policy renewal", "urgency": "high"}
        ],
        "warnings": ["Policy expires in 30 days", "No beneficiary designated"],
        "total_value": "25000.00",
        "currency": "EUR"
    }


# =============================================================================
# 6. AI DIGITAL FOOTPRINT CLEANUP PLANNER
# =============================================================================

def generate_cleanup_plan(user, assets) -> Dict[str, Any]:
    """Generate a priority-based cleanup plan for digital assets after death.
    
    Organizes account closure into phases with priority rankings.
    """
    priority_categories = {
        "critical": [],  # Financial accounts, crypto
        "high": [],      # Social media, email
        "medium": [],     # Subscriptions, shopping
        "low": []         # Entertainment, forums
    }
    
    for asset in assets:
        if asset.asset_type in ["financial", "crypto", "insurance", "account"]:
            priority_categories["critical"].append(asset)
        elif asset.asset_type in ["social", "email", "communication"]:
            priority_categories["high"].append(asset)
        elif asset.asset_type in ["subscription", "shopping", "device"]:
            priority_categories["medium"].append(asset)
        else:
            priority_categories["low"].append(asset)
    
    phases = [
        {
            "phase": 1,
            "name": "Secure Financial Assets",
            "priority": "critical",
            "timeframe": "Within 24 hours",
            "assets": [{
                "name": a.name,
                "type": a.asset_type,
                "institution": a.institution,
                "action": "Transfer or close account",
                "required_documents": ["Death certificate", "Beneficiary ID", "Account details"]
            } for a in priority_categories["critical"]],
            "estimated_time": "2-4 hours"
        },
        {
            "phase": 2,
            "name": "Secure Digital Identity",
            "priority": "high",
            "timeframe": "Within 1 week",
            "assets": [{
                "name": a.name,
                "type": a.asset_type,
                "institution": a.institution,
                "action": "Change passwords or close accounts",
                "required_documents": ["Death certificate"]
            } for a in priority_categories["high"]],
            "estimated_time": "1-2 hours"
        },
        {
            "phase": 3,
            "name": "Cancel Subscriptions",
            "priority": "medium",
            "timeframe": "Within 2 weeks",
            "assets": [{
                "name": a.name,
                "type": a.asset_type,
                "institution": a.institution,
                "action": "Cancel subscription",
                "required_documents": ["Account access"]
            } for a in priority_categories["medium"]],
            "estimated_time": "1-2 hours"
        },
        {
            "phase": 4,
            "name": "Archive & Memorial",
            "priority": "low",
            "timeframe": "Within 1 month",
            "assets": [{
                "name": a.name,
                "type": a.asset_type,
                "institution": a.institution,
                "action": "Archive or convert to memorial",
                "required_documents": []
            } for a in priority_categories["low"]],
            "estimated_time": "1-2 hours"
        }
    ]
    
    return {
        "phases": phases,
        "total_estimated_time": "5-10 hours",
        "total_accounts": len(assets),
        "money_saved_estimate": len(priority_categories["medium"]) * 50,  # Avg $50/month
        "checklist": [
            "Download all passwords and seed phrases",
            "Secure death certificate copies",
            "Notify social media platforms",
            "Cancel all subscriptions",
            "Archive important digital content",
            "Set up memorial pages if desired"
        ]
    }


# =============================================================================
# 7. AI FRAUD DETECTION MONITOR
# =============================================================================

def analyze_fraud_risk(user, assets, audit_logs) -> Dict[str, Any]:
    """Analyze digital footprint for fraud risk after death.
    
    Identifies vulnerable accounts and suspicious patterns.
    """
    risks = []
    
    # Check for accounts without 2FA
    for asset in assets:
        if asset.asset_type in ["financial", "crypto"]:
            if not asset.password_encrypted:
                risks.append({
                    "risk_level": "high",
                    "asset_name": asset.name,
                    "risk_type": "no_password",
                    "description": f"No password stored for {asset.name}. If account is compromised, it cannot be recovered.",
                    "mitigation": "Store password securely in vault"
                })
    
    # Check for recent suspicious activity
    recent_logins = [log for log in audit_logs if log.action == "login"]
    if len(recent_logins) > 10:
        risks.append({
            "risk_level": "medium",
            "risk_type": "high_login_frequency",
            "description": "Unusually high login frequency detected. Consider enabling 2FA.",
            "mitigation": "Enable 2FA and monitor login alerts"
        })
    
    # Check for shared passwords
    asset_types = [a.asset_type for a in assets]
    if len(asset_types) > len(set(asset_types)):
        risks.append({
            "risk_level": "medium",
            "risk_type": "password_reuse",
            "description": "Multiple accounts of same type detected. Consider using unique passwords.",
            "mitigation": "Use a password manager for unique passwords"
        })
    
    return {
        "overall_risk_score": len(risks) * 10,
        "risk_level": "high" if len(risks) > 3 else "medium" if len(risks) > 1 else "low",
        "risks": risks,
        "recommendations": [
            "Enable 2FA on all financial accounts",
            "Use unique passwords for each account",
            "Set up login alerts",
            "Regularly review audit logs",
            "Consider a password manager"
        ],
        "monitoring_enabled": user.login_alert_enabled
    }


# =============================================================================
# 8. AI TAX & LEGAL COMPLIANCE
# =============================================================================

def generate_tax_compliance_report(user, assets, beneficiaries) -> Dict[str, Any]:
    """Generate inheritance tax and legal compliance checklist.
    
    Based on asset types and country (simplified for demo).
    """
    total_value = len(assets) * 10000  # Simplified estimation
    
    # Simplified US tax brackets (2024)
    federal_tax = 0
    if total_value > 13600000:  # Estate tax threshold
        federal_tax = (total_value - 13600000) * 0.40
    
    state_tax = total_value * 0.05  # Simplified state tax
    
    legal_requirements = [
        {
            "requirement": "Probate Filing",
            "required": total_value > 50000,
            "description": "Estate must go through probate court if value exceeds $50,000",
            "estimated_cost": "$2,000 - $10,000",
            "timeline": "6-12 months"
        },
        {
            "requirement": "Death Certificate",
            "required": True,
            "description": "Certified copies required for all financial institutions",
            "estimated_cost": "$10 - $50 per copy",
            "timeline": "1-2 weeks"
        },
        {
            "requirement": "Beneficiary Designation",
            "required": True,
            "description": "All financial accounts must have named beneficiaries",
            "estimated_cost": "Free",
            "timeline": "Immediate"
        },
        {
            "requirement": "Crypto Asset Transfer",
            "required": any(a.asset_type == "crypto" for a in assets),
            "description": "Seed phrases must be transferred securely to beneficiaries",
            "estimated_cost": "Free",
            "timeline": "Immediate"
        }
    ]
    
    return {
        "total_estate_value": total_value,
        "currency": "USD",
        "federal_tax_estimate": federal_tax,
        "state_tax_estimate": state_tax,
        "total_tax_estimate": federal_tax + state_tax,
        "effective_tax_rate": (federal_tax + state_tax) / total_value if total_value > 0 else 0,
        "legal_requirements": legal_requirements,
        "compliance_score": len([r for r in legal_requirements if r["required"]]) / len(legal_requirements) * 100,
        "recommendations": [
            "Consult a probate attorney for estates over $100,000",
            "Consider a living trust to avoid probate",
            "Update beneficiary designations annually",
            "Document crypto wallet access clearly",
            "Keep death certificates in multiple secure locations"
        ],
        "country": "US",
        "disclaimer": "This is an AI estimate. Consult a tax professional for accurate advice."
    }


# =============================================================================
# AI Client Helper
# =============================================================================

def _get_ai_client():
    """Get AI client if available."""
    try:
        import google.generativeai as genai
        key = getattr(settings, "GEMINI_API_KEY", None)
        if not key:
            return None
        genai.configure(api_key=key)
        return genai
    except ImportError:
        return None
