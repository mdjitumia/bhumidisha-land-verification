import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const BhumiDishaLogo: React.FC<LogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="BhumiDisha Logo"
    >
      {/* Outer Compass Points */}
      {/* Top North Point */}
      <polygon points="100,6 112,32 88,32" fill="#126B3A" />
      {/* Bottom South Point */}
      <polygon points="100,194 112,168 88,168" fill="#126B3A" />
      {/* Left West Point */}
      <polygon points="6,100 32,88 32,112" fill="#126B3A" />
      {/* Right East Point */}
      <polygon points="194,100 168,88 168,112" fill="#126B3A" />

      {/* Main Outer Compass Ring */}
      <circle cx="100" cy="100" r="76" stroke="#126B3A" strokeWidth="10" fill="#EBF7EF" />

      {/* Inner Mask for Landscape */}
      <g clipPath="url(#logoInnerClip)">
        {/* Rolling Hills (Lower Half) */}
        {/* Back Hill */}
        <path
          d="M20 150 Q100 100 180 140 L180 180 L20 180 Z"
          fill="#198754"
        />
        {/* Stylized Tree */}
        <circle cx="145" cy="118" r="14" fill="#126B3A" />
        <circle cx="136" cy="124" r="10" fill="#126B3A" />
        <circle cx="154" cy="124" r="10" fill="#126B3A" />
        <rect x="143" y="128" width="4" height="18" fill="#126B3A" rx="1" />

        {/* Foreground Hill */}
        <path
          d="M20 170 Q90 120 180 155 L180 180 L20 180 Z"
          fill="#126B3A"
        />

        {/* Contour Grid Arcs on Hills */}
        <path
          d="M40 168 Q100 126 160 150"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M60 175 Q110 138 150 160"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M75 145 Q85 165 95 180"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M125 140 Q120 160 115 180"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Compass Needle - pointing Northwest */}
        {/* Dark Green Needle Half */}
        <polygon
          points="100,100 52,138 140,54"
          fill="#126B3A"
        />
        {/* Light Green Needle Half */}
        <polygon
          points="100,100 140,54 130,104"
          fill="#28A745"
        />
        {/* Pivot Center Ring */}
        <circle cx="100" cy="100" r="12" fill="#EBF7EF" stroke="#126B3A" strokeWidth="4" />
        <circle cx="100" cy="100" r="5" fill="#126B3A" />
      </g>

      <defs>
        <clipPath id="logoInnerClip">
          <circle cx="100" cy="100" r="71" />
        </clipPath>
      </defs>
    </svg>
  );
};
