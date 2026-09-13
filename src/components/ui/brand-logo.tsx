'use client';

import React from 'react';
import Image from 'next/image';
import { useAdmin } from '@/lib/admin-context';
import { OFFICIAL_2ND_CHANCE_LOGO } from '@/lib/official-logo-data';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  variant?: 'dark' | 'light';
}

export function BrandLogo({ size = 'md', showTagline = false, variant = 'light' }: BrandLogoProps) {
  let customLogoUrl = OFFICIAL_2ND_CHANCE_LOGO;
  try {
    const admin = useAdmin();
    if (admin?.settings?.branding?.logoUrl) {
      customLogoUrl = admin.settings.branding.logoUrl;
    }
  } catch (e) {
    // Context fallback
  }

  const dimensions = {
    sm: { iconSize: 'w-10 h-10', num2: 'text-2xl sm:text-3xl', textNd: 'text-xs sm:text-sm', textNikah: 'text-xs sm:text-sm', tagline: 'text-[9px]' },
    md: { iconSize: 'w-12 h-12', num2: 'text-3xl sm:text-4xl', textNd: 'text-sm sm:text-base', textNikah: 'text-sm sm:text-base', tagline: 'text-[10px]' },
    lg: { iconSize: 'w-16 h-16', num2: 'text-4xl sm:text-5xl', textNd: 'text-lg sm:text-xl', textNikah: 'text-lg sm:text-xl', tagline: 'text-xs' },
    hero: { iconSize: 'w-28 h-28', num2: 'text-6xl sm:text-7xl', textNd: 'text-2xl sm:text-3xl', textNikah: 'text-2xl sm:text-3xl', tagline: 'text-base' },
  }[size];

  const textColor2nd = variant === 'dark' ? 'text-white' : 'text-stone-900';

  return (
    <div className="inline-flex items-center gap-2 select-none cursor-pointer group">
      <div className={`relative ${dimensions.iconSize} shrink-0`}>
        <img
          src={customLogoUrl}
          alt="2ndNikah Matrimonial Logo"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline font-serif tracking-tight">
          <span className={`${dimensions.num2} font-black text-pink-600 leading-none drop-shadow-xs transition-transform group-hover:scale-110 inline-block`}>2</span>
          <span className={`${textColor2nd} ${dimensions.textNd} font-black`}>nd</span>
          <span className={`text-pink-600 ml-0.5 ${dimensions.textNikah} font-black`}>Nikah</span>
        </div>

        {showTagline && (
          <span className="text-[10px] font-bold text-pink-700 font-sans tracking-wide mt-0.5">
            Matrimonial Sanctuary
          </span>
        )}
      </div>
    </div>
  );
}
