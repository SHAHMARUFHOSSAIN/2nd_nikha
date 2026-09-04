'use client';

import React from 'react';

export interface Official3DLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export function Official3DLogo({ className = '', size = 'hero' }: Official3DLogoProps) {
  const dimensions = {
    sm: 'w-32 h-16',
    md: 'w-48 h-24',
    lg: 'w-64 h-32',
    hero: 'w-72 sm:w-96 lg:w-[440px] h-36 sm:h-48 lg:h-56',
  }[size];

  return (
    <div className={`relative ${dimensions} select-none filter drop-shadow-xl hover:scale-105 transition-transform cursor-pointer ${className}`}>
      <svg viewBox="0 0 500 320" className="w-full h-full">
        <defs>
          {/* Glossy Pink 3D Gradient */}
          <linearGradient id="pink3dGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff69b4" />
            <stop offset="25%" stopColor="#ff1493" />
            <stop offset="60%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#99004d" />
          </linearGradient>

          {/* Glossy Highlight Gradient */}
          <linearGradient id="whiteHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* 3D Metallic Silver Gradient */}
          <linearGradient id="silver3dGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e2e8f0" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Heart Inner Gradient */}
          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff5f8" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffe4e9" stopOpacity="0.9" />
          </radialGradient>

          {/* Drop Shadow Filter */}
          <filter id="shadow3d" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#831843" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer 3D Heart & Number 2 Combined Shape */}
        <g filter="url(#shadow3d)">
          {/* Inner Heart Background Fill */}
          <path
            d="M 250 80 C 210 20, 120 40, 130 130 C 140 200, 250 250, 250 250 C 250 250, 360 200, 370 130 C 380 40, 290 20, 250 80 Z"
            fill="url(#innerGlow)"
          />

          {/* Silhouettes of Groom & Bride inside Heart */}
          <g transform="translate(170, 75) scale(0.7)">
            {/* Groom Silhouette */}
            <path
              d="M 50 120 C 50 80, 80 60, 95 65 C 105 70, 110 85, 105 105 C 100 125, 80 145, 60 145 Z"
              fill="#be185d"
            />
            {/* Groom Head */}
            <path
              d="M 90 55 C 90 40, 110 35, 115 50 C 120 65, 105 75, 95 70 Z"
              fill="#be185d"
            />

            {/* Bride Silhouette */}
            <path
              d="M 170 120 C 170 80, 140 60, 125 65 C 115 70, 110 85, 115 105 C 120 125, 140 145, 160 145 Z"
              fill="#be185d"
            />
            {/* Bride Head & Hair Bun */}
            <path
              d="M 135 55 C 135 40, 115 35, 110 50 C 105 65, 120 75, 130 70 Z"
              fill="#be185d"
            />
            <circle cx="145" cy="55" r="8" fill="#be185d" />

            {/* Floating Love Heart */}
            <path
              d="M 115 25 C 110 15, 95 20, 105 32 L 115 42 L 125 32 C 135 20, 120 15, 115 25 Z"
              fill="#e11d48"
            />
          </g>

          {/* Large Glossy Pink 3D Number "2" Outer Loop */}
          <path
            d="M 210 65 C 150 20, 90 70, 130 130 C 170 190, 270 180, 310 210 C 330 225, 290 245, 180 235 C 140 230, 100 215, 90 200 C 80 185, 150 160, 230 125 C 290 100, 270 45, 210 65 Z"
            fill="url(#pink3dGrad)"
            stroke="#99004d"
            strokeWidth="3"
          />

          {/* Right Glossy Pink Heart Arm */}
          <path
            d="M 250 80 C 290 20, 420 50, 410 140 C 400 210, 250 250, 250 250 C 270 230, 370 180, 375 130 C 380 70, 290 50, 250 80 Z"
            fill="url(#pink3dGrad)"
            stroke="#99004d"
            strokeWidth="3"
          />

          {/* 3D Glossy White Curved Highlight Overlay */}
          <path
            d="M 205 70 C 155 30, 105 75, 138 125 C 170 175, 260 170, 300 200"
            fill="none"
            stroke="url(#whiteHighlight)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* 3D Typography: "2nd Chance" */}
        <g filter="url(#shadow3d)" transform="translate(0, 10)">
          {/* "2nd" Silver 3D Text */}
          <text
            x="70"
            y="290"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="54"
            fill="url(#silver3dGrad)"
            stroke="#334155"
            strokeWidth="2"
            letterSpacing="-2"
          >
            2nd
          </text>

          {/* "Chance" Hot Pink 3D Text */}
          <text
            x="190"
            y="290"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="58"
            fill="url(#pink3dGrad)"
            stroke="#831843"
            strokeWidth="3"
            letterSpacing="-1"
          >
            Chance
          </text>

          {/* Glossy White Highlights on "Chance" */}
          <text
            x="190"
            y="287"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="58"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.6"
            letterSpacing="-1"
          >
            Chance
          </text>
        </g>
      </svg>
    </div>
  );
}
