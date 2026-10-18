import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * Module 1 Logo: জমি কেনার আগে যাচাই
 * Land parcel boundary map with protective verification shield & checkmark motif
 */
export const VerifierLogo: React.FC<IconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="জমি কেনার আগে যাচাই প্রতীক"
    >
      {/* Background Rounded Tile */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#EFF8F2" stroke="#D9E7DD" strokeWidth="2" />
      
      {/* Cadastral Parcel Grid Lines */}
      <path
        d="M14 20 L32 14 L50 20 L46 42 L32 50 L18 42 Z"
        fill="#FFFFFF"
        stroke="#126B3A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32 14 L32 50" stroke="#198754" strokeWidth="1.8" strokeDasharray="3 3" />
      <path d="M16 31 L48 31" stroke="#198754" strokeWidth="1.8" strokeDasharray="3 3" />

      {/* Central Shield with Verification Checkmark */}
      <path
        d="M32 23 C38 23 42 21 42 21 V33 C42 40 32 45 32 45 C32 45 22 40 22 33 V21 C22 21 26 23 32 23 Z"
        fill="#126B3A"
      />
      <path
        d="M27 32.5 L30.5 36 L37 28.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * Module 2 Logo: আমার ভূমি-ওয়ালেট
 * Digital land parcel document vault with secure lock & ledger layers
 */
export const WalletLogo: React.FC<IconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="আমার ভূমি-ওয়ালেট প্রতীক"
    >
      {/* Background Rounded Tile */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#EFF8F2" stroke="#D9E7DD" strokeWidth="2" />

      {/* Document Layers / Folder */}
      <path
        d="M14 22 C14 19.8 15.8 18 18 18 H27 L31 22 H46 C48.2 22 50 23.8 50 26 V44 C50 46.2 48.2 48 46 48 H18 C15.8 48 14 46.2 14 44 Z"
        fill="#126B3A"
      />
      {/* Front Wallet Flap / Deed Paper */}
      <rect x="18" y="26" width="28" height="18" rx="4" fill="#FFFFFF" stroke="#D9E7DD" strokeWidth="1.5" />
      <line x1="22" y1="31" x2="36" y2="31" stroke="#126B3A" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="36" x2="32" y2="36" stroke="#198754" strokeWidth="1.5" strokeLinecap="round" />

      {/* Subtle Circular Security Lock Badge */}
      <circle cx="42" cy="37" r="7" fill="#198754" stroke="#FFFFFF" strokeWidth="1.5" />
      <path
        d="M40 36 V34 C40 32.9 40.9 32 42 32 C43.1 32 44 32.9 44 34 V36"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect x="39" y="36" width="6" height="4" rx="1" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Module 3 Logo: ভূমিসাথী
 * Guided land assistance & trusted citizen knowledge consultation
 */
export const AssistantLogo: React.FC<IconProps> = ({ className = '', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="ভূমিসাথী প্রতীক"
    >
      {/* Background Rounded Tile */}
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#EFF8F2" stroke="#D9E7DD" strokeWidth="2" />

      {/* Main Friendly Speech Consultation Bubble */}
      <path
        d="M16 19 C16 16.8 17.8 15 20 15 H44 C46.2 15 48 16.8 48 19 V35 C48 37.2 46.2 39 44 39 H32 L22 47 V39 H20 C17.8 39 16 37.2 16 35 Z"
        fill="#126B3A"
      />

      {/* Inner Guidance Symbol: Open Book / Sprout */}
      <path
        d="M25 24 C28 23 32 24.5 32 27 V33 C32 31.5 28 30 25 31 Z"
        fill="#FFFFFF"
      />
      <path
        d="M39 24 C36 23 32 24.5 32 27 V33 C32 31.5 36 30 39 31 Z"
        fill="#EFF8F2"
      />

      {/* Small Consultation Accent Dots */}
      <circle cx="26" cy="20" r="1.5" fill="#A8E6CF" />
      <circle cx="38" cy="20" r="1.5" fill="#A8E6CF" />
    </svg>
  );
};
