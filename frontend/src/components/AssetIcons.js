import React from 'react';

// 3D realistic asset icons - like actual 3D objects

export const AccountIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="cardBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B82F6"/>
        <stop offset="100%" stopColor="#1E40AF"/>
      </linearGradient>
      <linearGradient id="cardFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#60A5FA"/>
        <stop offset="100%" stopColor="#3B82F6"/>
      </linearGradient>
    </defs>
    {/* 3D card base */}
    <rect x="6" y="12" width="36" height="24" rx="4" fill="url(#cardBg)" filter="url(#shadow)"/>
    {/* 3D card front */}
    <rect x="6" y="8" width="36" height="24" rx="4" fill="url(#cardFront)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* 3D card top edge */}
    <rect x="6" y="8" width="36" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
    {/* Photo area */}
    <circle cx="16" cy="18" r="4" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    <path d="M12 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none"/>
    {/* Text lines */}
    <rect x="24" y="16" width="16" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
    <rect x="24" y="20" width="12" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
    <rect x="24" y="24" width="14" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
    {/* Chip */}
    <rect x="8" y="28" width="8" height="6" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
  </svg>
);

export const CryptoIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4"/>
      </filter>
      <linearGradient id="coinFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FCD34D"/>
        <stop offset="50%" stopColor="#F59E0B"/>
        <stop offset="100%" stopColor="#D97706"/>
      </linearGradient>
      <linearGradient id="coinBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D97706"/>
        <stop offset="100%" stopColor="#92400E"/>
      </linearGradient>
      <linearGradient id="coinInner" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A"/>
        <stop offset="100%" stopColor="#FCD34D"/>
      </linearGradient>
    </defs>
    {/* 3D coin base */}
    <circle cx="24" cy="26" r="16" fill="url(#coinBack)" filter="url(#coinShadow)"/>
    {/* 3D coin front */}
    <circle cx="24" cy="24" r="16" fill="url(#coinFront)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Inner circle */}
    <circle cx="24" cy="24" r="12" fill="url(#coinInner)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
    {/* Bitcoin symbol */}
    <text x="24" y="28" textAnchor="middle" fill="#B45309" fontSize="18" fontWeight="bold" fontFamily="serif">B</text>
    {/* 3D coin edge */}
    <circle cx="24" cy="24" r="16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="8 6"/>
    {/* Shine */}
    <path d="M12 12 Q 18 16 16 22" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
  </svg>
);

export const DocumentIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="docShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="paperBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FEF3C7"/>
        <stop offset="100%" stopColor="#FDE68A"/>
      </linearGradient>
      <linearGradient id="paperDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FDE68A"/>
        <stop offset="100%" stopColor="#FBBF24"/>
      </linearGradient>
    </defs>
    {/* 3D paper base */}
    <path d="M12 6 L32 6 L40 14 L40 40 L12 40 Z" fill="url(#paperDark)" filter="url(#docShadow)" rx="2"/>
    {/* 3D paper front */}
    <path d="M12 4 L32 4 L40 12 L40 38 L12 38 Z" fill="url(#paperBg)" stroke="rgba(180,140,60,0.3)" strokeWidth="1" rx="2"/>
    {/* Fold */}
    <path d="M32 4 L32 12 L40 12" fill="rgba(255,255,255,0.3)" stroke="rgba(180,140,60,0.4)" strokeWidth="1"/>
    <path d="M32 4 L40 12" stroke="rgba(180,140,60,0.4)" strokeWidth="1" strokeLinecap="round"/>
    {/* Text lines */}
    <rect x="16" y="16" width="20" height="2" rx="1" fill="#D97706" opacity="0.6"/>
    <rect x="16" y="21" width="16" height="2" rx="1" fill="#D97706" opacity="0.4"/>
    <rect x="16" y="26" width="18" height="2" rx="1" fill="#D97706" opacity="0.5"/>
    <rect x="16" y="31" width="14" height="2" rx="1" fill="#D97706" opacity="0.4"/>
    {/* Stamp/seal */}
    <circle cx="34" cy="32" r="5" fill="rgba(239,68,68,0.3)" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2"/>
    <text x="34" y="34" textAnchor="middle" fill="#EF4444" fontSize="6" fontWeight="bold">DOC</text>
  </svg>
);

export const SubscriptionIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="subShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="subFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A78BFA"/>
        <stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient>
      <linearGradient id="subBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7C3AED"/>
        <stop offset="100%" stopColor="#5B21B6"/>
      </linearGradient>
    </defs>
    {/* 3D card base */}
    <rect x="6" y="14" width="36" height="24" rx="5" fill="url(#subBack)" filter="url(#subShadow)"/>
    {/* 3D card front */}
    <rect x="6" y="12" width="36" height="24" rx="5" fill="url(#subFront)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Top stripe */}
    <rect x="6" y="12" width="36" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
    {/* Chip */}
    <rect x="10" y="22" width="8" height="6" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
    {/* Card number lines */}
    <rect x="22" y="22" width="16" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
    <rect x="22" y="26" width="12" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
    {/* Person icon */}
    <circle cx="38" cy="20" r="3" fill="rgba(255,255,255,0.4)"/>
    <path d="M34 30 Q 38 25 42 30" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const InsuranceIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="insShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="shieldFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34D399"/>
        <stop offset="50%" stopColor="#10B981"/>
        <stop offset="100%" stopColor="#059669"/>
      </linearGradient>
      <linearGradient id="shieldBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#059669"/>
        <stop offset="100%" stopColor="#047857"/>
      </linearGradient>
    </defs>
    {/* 3D shield base */}
    <path d="M24 6 L6 14 L8 26 C10 36 16 42 24 44 C32 42 38 36 40 26 L42 14 L24 6Z" fill="url(#shieldBack)" filter="url(#insShadow)"/>
    {/* 3D shield front */}
    <path d="M24 4 L6 12 L8 24 C10 34 16 40 24 42 C32 40 38 34 40 24 L42 12 L24 4Z" fill="url(#shieldFront)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Shield highlight */}
    <path d="M24 4 L24 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    {/* Checkmark */}
    <path d="M16 22 L21 28 L32 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Checkmark shadow */}
    <path d="M16 24 L21 30 L32 18" stroke="rgba(5,150,105,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const FinancialIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="finShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="finFront" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22D3EE"/>
        <stop offset="100%" stopColor="#06B6D4"/>
      </linearGradient>
      <linearGradient id="finBack" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#06B6D4"/>
        <stop offset="100%" stopColor="#0891B2"/>
      </linearGradient>
    </defs>
    {/* 3D card base */}
    <rect x="6" y="14" width="36" height="24" rx="4" fill="url(#finBack)" filter="url(#finShadow)"/>
    {/* 3D card front */}
    <rect x="6" y="12" width="36" height="24" rx="4" fill="url(#finFront)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Top highlight */}
    <rect x="6" y="12" width="36" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
    {/* Bank symbol */}
    <rect x="10" y="18" width="10" height="6" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
    <path d="M10 18 L15 14 L20 18" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
    {/* Card details */}
    <rect x="24" y="18" width="16" height="2" rx="1" fill="rgba(255,255,255,0.5)"/>
    <rect x="24" y="22" width="12" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
    <rect x="24" y="26" width="14" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
    {/* Dollar symbol */}
    <text x="36" y="31" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold">$</text>
  </svg>
);

export const DeviceIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="devShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="devBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F472B6"/>
        <stop offset="100%" stopColor="#DB2777"/>
      </linearGradient>
      <linearGradient id="devScreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBCFE8"/>
        <stop offset="100%" stopColor="#F9A8D4"/>
      </linearGradient>
    </defs>
    {/* 3D phone base */}
    <rect x="14" y="6" width="20" height="36" rx="4" fill="url(#devBody)" filter="url(#devShadow)"/>
    {/* 3D phone front */}
    <rect x="14" y="4" width="20" height="36" rx="4" fill="url(#devBody)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Screen */}
    <rect x="16" y="8" width="16" height="28" rx="2" fill="url(#devScreen)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Screen content */}
    <rect x="18" y="10" width="12" height="2" rx="1" fill="rgba(219,39,119,0.3)"/>
    <rect x="18" y="14" width="10" height="2" rx="1" fill="rgba(219,39,119,0.2)"/>
    <rect x="18" y="18" width="8" height="2" rx="1" fill="rgba(219,39,119,0.2)"/>
    {/* Home button */}
    <circle cx="24" cy="36" r="3" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
    {/* Top notch/camera */}
    <rect x="21" y="5" width="6" height="1.5" rx="0.75" fill="rgba(255,255,255,0.3)"/>
  </svg>
);

export const SocialIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="socShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="socGlobe" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#818CF8"/>
        <stop offset="100%" stopColor="#4F46E5"/>
      </linearGradient>
    </defs>
    {/* 3D globe base */}
    <circle cx="24" cy="26" r="14" fill="#312E81" filter="url(#socShadow)"/>
    {/* 3D globe front */}
    <circle cx="24" cy="24" r="14" fill="url(#socGlobe)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Globe lines */}
    <ellipse cx="24" cy="24" rx="14" ry="6" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <ellipse cx="24" cy="24" rx="6" ry="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <ellipse cx="24" cy="24" rx="10" ry="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    {/* People around */}
    <circle cx="10" cy="14" r="4" fill="#6366F1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    <circle cx="38" cy="14" r="4" fill="#6366F1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    <circle cx="24" cy="6" r="4" fill="#6366F1" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    {/* Connection lines */}
    <path d="M14 14 L20 10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M34 14 L28 10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M24 14 L24 10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const OtherIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="othShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
      </filter>
      <linearGradient id="othBox" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9CA3AF"/>
        <stop offset="100%" stopColor="#6B7280"/>
      </linearGradient>
      <linearGradient id="othLid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D1D5DB"/>
        <stop offset="100%" stopColor="#9CA3AF"/>
      </linearGradient>
    </defs>
    {/* 3D box base */}
    <rect x="8" y="18" width="32" height="24" rx="4" fill="url(#othBox)" filter="url(#othShadow)"/>
    {/* 3D box lid */}
    <rect x="8" y="16" width="32" height="18" rx="4" fill="url(#othLid)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* 3D box top */}
    <rect x="8" y="14" width="32" height="6" rx="2" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
    {/* Box content */}
    <circle cx="18" cy="24" r="3" fill="#6B7280" opacity="0.6"/>
    <circle cx="24" cy="26" r="3" fill="#6B7280" opacity="0.4"/>
    <circle cx="30" cy="24" r="3" fill="#6B7280" opacity="0.6"/>
    {/* Question mark */}
    <text x="24" y="34" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold">?</text>
  </svg>
);
