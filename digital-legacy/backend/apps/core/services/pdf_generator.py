import logging
from django.template.loader import render_to_string
from weasyprint import HTML
from django.core.files.base import ContentFile
from django.conf import settings
import os

logger = logging.getLogger(__name__)


def generate_legacy_report_pdf(user, assets, beneficiaries, plans):
    """Generate a beautiful PDF legacy report for a user."""
    
    html_string = render_to_string('core/legacy_report.html', {
        'user': user,
        'assets': assets,
        'beneficiaries': beneficiaries,
        'plans': plans,
        'generated_at': user.last_activity,
    })
    
    pdf_bytes = HTML(string=html_string).write_pdf()
    return pdf_bytes
