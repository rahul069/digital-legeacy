import React from 'react';

// 3D Realistic asset type icons with colors and gradients
export const AccountIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="accountGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="32" height="32" rx="8" fill="url(#accountGrad)" opacity="0.2"/>
    <rect x="8" y="8" width="32" height="32" rx="8" stroke="url(#accountGrad)" strokeWidth="2"/>
    <circle cx="24" cy="20" r="6" fill="url(#accountGrad)" opacity="0.8"/>
    <path d="M12 34c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="url(#accountGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
  </svg>
);

export const CryptoIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cryptoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="16" fill="url(#cryptoGrad)" opacity="0.2"/>
    <circle cx="24" cy="24" r="16" stroke="url(#cryptoGrad)" strokeWidth="2"/>
    <circle cx="24" cy="24" r="12" fill="url(#cryptoGrad)" opacity="0.4"/>
    <text x="24" y="28" textAnchor="middle" fill="url(#cryptoGrad)" fontSize="14" fontWeight="bold" fontFamily="Arial">₿</text>
  </svg>
);

export const DocumentIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    <path d="M12 6h20l8 8v28H12V6z" fill="url(#docGrad)" opacity="0.2"/>
    <path d="M12 6h20l8 8v28H12V6z" stroke="url(#docGrad)" strokeWidth="2"/>
    <path d="M32 6v8h8" stroke="url(#docGrad)" strokeWidth="2" fill="none"/>
    <path d="M16 20h16M16 26h12M16 32h8" stroke="url(#docGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="36" cy="36" r="3" fill="url(#docGrad)" opacity="0.6"/>
  </svg>
);

export const SubscriptionIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="subGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
    <rect x="6" y="12" width="36" height="24" rx="4" fill="url(#subGrad)" opacity="0.2"/>
    <rect x="6" y="12" width="36" height="24" rx="4" stroke="url(#subGrad)" strokeWidth="2"/>
    <rect x="10" y="16" width="8" height="5" rx="1" fill="url(#subGrad)" opacity="0.6"/>
    <circle cx="32" cy="24" r="5" fill="url(#subGrad)" opacity="0.3"/>
    <path d="M32 21v6M29 24h6" stroke="url(#subGrad)" strokeWidth="2" strokeLinecap="round"/>
    <rect x="10" y="28" width="28" height="2" rx="1" fill="url(#subGrad)" opacity="0.3"/>
  </svg>
);

export const InsuranceIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="insGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M24 4L8 12v10c0 9.9 6.8 19.2 16 22 9.2-2.8 16-12.1 16-22V12L24 4z" fill="url(#insGrad)" opacity="0.2"/>
    <path d="M24 4L8 12v10c0 9.9 6.8 19.2 16 22 9.2-2.8 16-12.1 16-22V12L24 4z" stroke="url(#insGrad)" strokeWidth="2"/>
    <path d="M18 22l4 4 8-8" stroke="url(#insGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="24" cy="24" r="12" stroke="url(#insGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" fill="none"/>
  </svg>
);

export const FinancialIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    </defs>
    <rect x="6" y="12" width="36" height="24" rx="4" fill="url(#finGrad)" opacity="0.2"/>
    <rect x="6" y="12" width="36" height="24" rx="4" stroke="url(#finGrad)" strokeWidth="2"/>
    <rect x="10" y="16" width="10" height="6" rx="2" fill="url(#finGrad)" opacity="0.5"/>
    <rect x="10" y="24" width="16" height="2" rx="1" fill="url(#finGrad)" opacity="0.3"/>
    <rect x="10" y="28" width="12" height="2" rx="1" fill="url(#finGrad)" opacity="0.3"/>
    <circle cx="36" cy="24" r="4" fill="url(#finGrad)" opacity="0.4"/>
    <path d="M36 21v6" stroke="url(#finGrad)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DeviceIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="devGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#DB2777" />
      </linearGradient>
    </defs>
    <rect x="14" y="4" width="20" height="36" rx="4" fill="url(#devGrad)" opacity="0.2"/>
    <rect x="14" y="4" width="20" height="36" rx="4" stroke="url(#devGrad)" strokeWidth="2"/>
    <rect x="16" y="8" width="16" height="24" rx="2" fill="url(#devGrad)" opacity="0.15"/>
    <circle cx="24" cy="36" r="3" fill="url(#devGrad)" opacity="0.5"/>
    <rect x="20" y="12" width="8" height="2" rx="1" fill="url(#devGrad)" opacity="0.4"/>
    <rect x="20" y="16" width="12" height="1" rx="0.5" fill="url(#devGrad)" opacity="0.3"/>
    <rect x="20" y="19" width="10" height="1" rx="0.5" fill="url(#devGrad)" opacity="0.3"/>
  </svg>
);

export const SocialIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="socGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <circle cx="24" cy="24" r="16" fill="url(#socGrad)" opacity="0.2"/>
    <circle cx="24" cy="24" r="16" stroke="url(#socGrad)" strokeWidth="2"/>
    <circle cx="24" cy="18" r="5" fill="url(#socGrad)" opacity="0.6"/>
    <circle cx="16" cy="30" r="4" fill="url(#socGrad)" opacity="0.4"/>
    <circle cx="32" cy="30" r="4" fill="url(#socGrad)" opacity="0.4"/>
    <path d="M24 23v3M16 26l3 1M32 26l-3 1" stroke="url(#socGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const OtherIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="othGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9CA3AF" />
        <stop offset="100%" stopColor="#6B7280" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="32" height="32" rx="6" fill="url(#othGrad)" opacity="0.2"/>
    <rect x="8" y="8" width="32" height="32" rx="6" stroke="url(#othGrad)" strokeWidth="2"/>
    <circle cx="24" cy="20" r="3" fill="url(#othGrad)" opacity="0.6"/>
    <circle cx="18" cy="30" r="2.5" fill="url(#othGrad)" opacity="0.4"/>
    <circle cx="30" cy="30" r="2.5" fill="url(#othGrad)" opacity="0.4"/>
    <path d="M24 23v3M18 27l3 1.5M30 27l-3 1.5" stroke="url(#othGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
  </svg>
);
