import React from 'react';

// Custom realistic asset type icons
export const AccountIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="32" height="24" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="24" r="3" fill="currentColor"/>
    <circle cx="30" cy="24" r="3" fill="currentColor"/>
    <path d="M12 16h24M12 32h24" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const CryptoIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="16" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 16v16M20 20h8M18 24h12M20 28h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

export const DocumentIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8h24l4 4v28H12V8z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 16h16M16 24h12M16 32h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M36 8v4h4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export const SubscriptionIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="16" width="32" height="20" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <rect x="16" y="12" width="16" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="26" r="4" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 36h24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"/>
  </svg>
);

export const InsuranceIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L6 14v12c0 12.6 7.7 24.3 18 28.7 10.3-4.4 18-16.1 18-28.7V14L24 4z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M18 24l4 4 8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const FinancialIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="36" height="28" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 18h24M12 24h18M12 30h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="36" cy="30" r="3" fill="currentColor"/>
  </svg>
);

export const DeviceIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="4" width="24" height="36" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <rect x="16" y="10" width="16" height="20" rx="1" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="24" cy="36" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

export const SocialIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="18" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="18" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="32" r="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 24v2M32 24v2M24 26v2" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
  </svg>
);

export const OtherIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="6" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="20" r="3" fill="currentColor"/>
    <circle cx="18" cy="30" r="2" fill="currentColor"/>
    <circle cx="30" cy="30" r="2" fill="currentColor"/>
    <path d="M24 23v4M18 28l3-2M30 28l-3-2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
