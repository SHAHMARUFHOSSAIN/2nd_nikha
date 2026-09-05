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
    sm: { iconSize: 'w-10 h-10', text2nd: 'text-lg', textChance: 'text-lg', tagline: 'text-[9px]' },
    md: { iconSize: 'w-12 h-12', text2nd: 'text-2xl', textChance: 'text-2xl', tagline: 'text-[10px]' },
    lg: { iconSize: 'w-16 h-16', text2nd: 'text-3xl', textChance: 'text-3xl', tagline: 'text-xs' },
    hero: { iconSize: 'w-28 h-28', text2nd: 'text-5xl', textChance: 'text-5xl', tagline: 'text-base' },
  }[size];

  const textColor2nd = variant === 'dark' ? 'text-white' : 'text-stone-900';

  return (
    <div className="inline-flex items-center gap-2 select-none cursor-pointer group">
      <div className={`relative ${dimensions.iconSize} shrink-0`}>
        <img
          src={customLogoUrl}
          alt="2nd Nikah Matrimonial Logo"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline font-serif font-extrabold tracking-tight">
          <span className={textColor2nd}>2nd</span>
          <span className="text-pink-600 ml-1">Nikha</span>
        </div>

        {showTagline && (
          <span className="text-[10px] font-medium text-pink-700 font-sans tracking-wide">
            Matrimonial Sanctuary
          </span>
        )}
      </div>
    </div>
  );
}
