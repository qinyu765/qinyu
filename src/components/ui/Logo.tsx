'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ size = 36 }) => (
  <Link href="/" aria-label="Home" className="block hover:opacity-80 transition-opacity">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      width={size}
      height={size}
    >
      <g transform="skewX(-12)" style={{ transformOrigin: '32px 32px' }}>
        <path d="M20 20 L28 20 L32 44 L26 44 Z" fill="#F0F0F0" />
        <path d="M44 20 L36 20 L34 36 L40 36 Z" fill="#1269CC" />
        <circle cx="32" cy="50" r="2.5" fill="#1269CC" />
        <line x1="26" y1="44" x2="32" y2="50" stroke="#1269CC" strokeWidth="1.5" />
        <line x1="34" y1="36" x2="32" y2="50" stroke="#1269CC" strokeWidth="1.5" />
      </g>
    </svg>
  </Link>
);
