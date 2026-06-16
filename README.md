# Digital Legacy

A secure, full-stack digital estate planning platform with AI-powered services. Built with Django REST API, React, PostgreSQL, Redis, and Docker.

## Features

### Core Features
- **Digital Vault** - Securely store and manage all your digital assets (accounts, crypto, documents, subscriptions, insurance, financial, devices, social, other)
- **Beneficiaries** - Manage inheritance recipients with photo uploads and contact details
- **Legacy Plans** - Create and manage digital legacy strategies with death verification
- **Audit Logging** - Complete activity tracking with IP tracking and timestamps
- **Delivery Tracking** - Track the status of inheritance delivery to beneficiaries

### AI Assistant (8 Monetizable Services)
- **Subscription Discovery** - Find recurring payments you forgot about
- **Estate Valuation** - Calculate total digital estate worth
- **Legacy Gap Analysis** - Identify missing pieces in your legacy plan
- **Beneficiary Guide** - Step-by-step onboarding for beneficiaries
- **Document Asset Extraction** - AI-powered extraction from documents
- **Digital Cleanup Planner** - Plan your digital footprint cleanup
- **Fraud Risk Analysis** - Detect potential fraud risks
- **Tax & Compliance Report** - Generate tax and legal compliance reports

### Security & Privacy
- **AES-256 Encryption** - All sensitive data encrypted at rest
- **Non-root Containers** - All Docker containers run as unprivileged user (uid 1000)
- **Rate Limiting** - Redis-backed rate limiting (5 login attempts/5min, 3 register/10min)
- **Security Headers** - HSTS, XSS, X-Frame protection enabled
- **Audit Trail** - Complete IP-tracked audit logging for all actions
- **Secrets Externalized** - All secrets in `.env` file (never in code)

### UI/UX
- **Dark & Light Theme** - Toggle between themes with localStorage persistence
- **Glassmorphic Design** - Modern glassmorphism with gradient borders
- **3D Realistic Icons** - Custom SVG icons with depth, shadows, and gradients for each asset type
- **Custom Dropdowns** - Beautiful searchable dropdowns replacing native selects
- **Animated Transitions** - Smooth slide-in animations throughout

## Tech Stack

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and rate limiting
- **Celery** - Background task processing
- **Fernet** - AES-128-CBC encryption via cryptography library
- **WeasyPrint** - PDF generation from HTML templates
- **Gemini API** - AI document scanning (optional)

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Infrastructure
- **Docker Compose** - Container orchestration
- **6 Services** - backend, frontend, postgres, redis, celery, celery-beat
- **Non-root** - All containers run as appuser (uid 1000)

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Clone & Run

```bash
# Clone the repository
git clone https://github.com/rahul069/digital-legeacy.git
cd digital-legeacy

# Start all services
docker compose up -d

# Create admin user (optional)
docker compose exec backend python manage.py createsuperuser

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api/
# Admin Panel: http://localhost:8080/admin/
```

### Default Credentials
- **Test User:** `test@example.com` / `testpass123`

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React development server |
| Backend API | 8080 | Django REST API |
| PostgreSQL | 5433 | Database |
| Redis | 6380 | Cache & rate limiting |
| Celery | - | Background task worker |
| Celery Beat | - | Scheduled task scheduler |

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `POST /api/auth/settings/` - Update user settings

### Vault
- `GET /api/vault/assets/` - List all assets
- `POST /api/vault/assets/` - Create asset
- `DELETE /api/vault/assets/{id}/` - Delete asset
- `POST /api/vault/assets/{id}/documents/` - Upload document
- `GET /api/vault/documents/` - List documents

### Beneficiaries
- `GET /api/beneficiaries/` - List beneficiaries
- `POST /api/beneficiaries/` - Create beneficiary
- `PUT /api/beneficiaries/{id}/` - Update beneficiary
- `DELETE /api/beneficiaries/{id}/` - Delete beneficiary

### Legacy Plans
- `GET /api/legacy/plans/` - List legacy plans
- `POST /api/legacy/plans/` - Create plan
- `PUT /api/legacy/plans/{id}/` - Update plan
- `DELETE /api/legacy/plans/{id}/` - Delete plan

### AI Services
- `POST /api/ai/subscriptions/` - Subscription discovery
- `POST /api/ai/valuate-estate/` - Estate valuation
- `POST /api/ai/legacy-gaps/` - Gap analysis
- `POST /api/ai/beneficiary-guide/` - Beneficiary guide
- `POST /api/ai/extract-assets/` - Asset extraction
- `POST /api/ai/cleanup-plan/` - Cleanup planner
- `POST /api/ai/fraud-risk/` - Fraud risk analysis
- `POST /api/ai/tax-report/` - Tax report

### Utility
- `POST /api/generate-legacy-report/` - Generate PDF report
- `POST /api/scan-document/` - AI document scanning
- `GET /api/audit-logs/` - Get audit logs
- `GET /api/delivery-tracking/` - Track deliveries
- `GET /api/escalation-settings/` - Get escalation settings
- `POST /api/escalation-settings/` - Update escalation settings

## Project Structure

```
digital-legeacy/
├── backend/
│   ├── digital_legacy/          # Django settings
│   ├── apps/
│   │   ├── accounts/            # User management & AI services
│   │   ├── vault/               # Asset storage & encryption
│   │   ├── beneficiaries/       # Beneficiary management
│   │   ├── legacy/              # Legacy plans & audit logs
│   │   └── core/                # Services (PDF, AI, notifications)
│   ├── templates/               # PDF generation templates
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── AssetIcons.js    # 3D realistic SVG icons
│   │   │   ├── CustomDropdown.js # Beautiful dropdown component
│   │   │   ├── AIAssistant.js   # AI dashboard
│   │   │   ├── Vault.js         # Digital vault
│   │   │   ├── Dashboard.js     # Dashboard
│   │   │   ├── Layout.js        # App layout with theme toggle
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── ThemeContext.js  # Dark/light theme context
│   │   ├── App.js
│   │   └── index.css            # Global styles & light theme
│   └── package.json
├── docker-compose.yml           # Docker orchestration
├── .env                         # Environment variables
├── .gitignore
└── README.md
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DB_NAME=digital_legacy
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=db
DB_PORT=5432

# Django
SECRET_KEY=your_django_secret_key_here
DEBUG=True

# Redis
REDIS_URL=redis://redis:6379/0

# Frontend
REACT_APP_API_URL=http://localhost:8080/api

# Encryption
ENCRYPTION_KEY=your_32_byte_fernet_key_here

# Gemini API (optional - for AI document scanning)
GEMINI_API_KEY=your_gemini_api_key

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_app_password

# Allowed hosts
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,backend
```

## Security Notes

- The `ENCRYPTION_KEY` in `.env` is used for development. For production, use AWS KMS or similar key management service.
- All containers run as non-root user (`appuser`, uid 1000).
- Rate limiting is enforced via Redis to prevent brute force attacks.
- Security headers (HSTS, XSS, X-Frame) are enabled in production.

## Development

### Backend
```bash
# Backend shell
docker compose exec backend bash

# Run migrations
docker compose exec backend python manage.py migrate

# Create superuser
docker compose exec backend python manage.py createsuperuser

# Run tests
docker compose exec backend python manage.py test
```

### Frontend
```bash
# Frontend shell
docker compose exec frontend sh

# Install new packages
docker compose exec frontend npm install <package>

# View logs
docker compose logs -f frontend
```

## License

MIT License - feel free to use this for personal or commercial projects.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with security and privacy in mind for your digital estate planning needs.
