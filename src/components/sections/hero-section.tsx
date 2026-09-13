'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/lib/admin-context';
import { OFFICIAL_2ND_CHANCE_LOGO } from '@/lib/official-logo-data';
import { Users, Play, Sparkles, X, ArrowRight } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Read dynamic branding CMS from Admin Settings
  let heroImage = '';
  let heroTitle = 'Every heart deserves a second chance';
  let heroSubtitle = 'A trusted matrimonial sanctuary designed for divorced, widowed, single parents, and mature singles seeking a genuine, lifelong companion.';
  let brandLogoUrl = OFFICIAL_2ND_CHANCE_LOGO;

  try {
    const admin = useAdmin();
    if (admin?.settings?.branding?.heroImageUrl) heroImage = admin.settings.branding.heroImageUrl;
    if (admin?.settings?.branding?.heroTitle) {
      heroTitle = admin.settings.branding.heroTitle
        .replace(/second\s*nikha/gi, 'second chance')
        .replace(/second\s*nikah/gi, 'second chance')
        .replace(/2nd\s*nikha/gi, '2nd Chance')
        .replace(/2nd\s*nikah/gi, '2nd Chance');
    }
    if (admin?.settings?.branding?.heroSubtitle) heroSubtitle = admin.settings.branding.heroSubtitle;
    if (admin?.settings?.branding?.logoUrl) {
      brandLogoUrl = admin.settings.branding.logoUrl;
    }
  } catch (e) {}

  const renderHeroTitle = (title: string) => {
    let cleanTitle = title || 'Every heart deserves a second chance';
    cleanTitle = cleanTitle
      .replace(/second\s*nikha/gi, 'second chance')
      .replace(/second\s*nikah/gi, 'second chance')
      .replace(/2nd\s*nikha/gi, '2nd Chance')
      .replace(/2nd\s*nikah/gi, '2nd Chance');

    const match = cleanTitle.match(/(2nd|second)\s*(chance)/i);
    if (match && match.index !== undefined) {
      const idx = match.index;
      const matchedText = match[0];
      const before = cleanTitle.substring(0, idx);
      const after = cleanTitle.substring(idx + matchedText.length);
      const is2nd = matchedText.toLowerCase().startsWith('2');
      return (
        <>
          {before}
          {is2nd ? (
            <span className="inline-inline-flex items-baseline">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-pink-600 leading-none drop-shadow-xs">2</span>
              <span className="text-pink-600 font-extrabold">{matchedText.substring(1)}</span>
            </span>
          ) : (
            <span className="text-pink-600 font-extrabold">{matchedText}</span>
          )}
          {after}
        </>
      );
    }
    return cleanTitle;
  };

  const handleSelectGender = (gender: 'Female' | 'Male') => {
    setIsProfileModalOpen(false);
    router.push(`/search?seekingGender=${gender}`);
  };

  return (
    <div className="relative bg-gradient-to-b from-pink-100/90 via-rose-50/40 to-white pt-4 sm:pt-6 pb-12 sm:pb-20 overflow-hidden">
      {/* Subtle Background Accent Orbs */}
      <div className="absolute top-10 left-[5%] text-pink-300/30 text-3xl sm:text-5xl select-none pointer-events-none animate-float-gentle">
        ♥
      </div>
      <div className="absolute top-20 right-[8%] text-rose-300/30 text-2xl sm:text-4xl select-none pointer-events-none animate-float-gentle" style={{ animationDelay: '1.5s' }}>
        ♥
      </div>

      <Container size="xl" className="relative z-10 space-y-6 sm:space-y-10">
        <div className={`grid grid-cols-1 ${heroImage ? 'lg:grid-cols-12' : ''} gap-6 sm:gap-8 items-center`}>
          
          {/* Left Column: Brand Headline & Introduction */}
          <div className={`${heroImage ? 'lg:col-span-6 text-center lg:text-left' : 'max-w-3xl mx-auto text-center'} space-y-4`}>
            
            {/* Direct Dynamic Uploaded Hero 1st Image */}
            <div className={`flex justify-center ${heroImage ? 'lg:justify-start' : ''}`}>
              <div className="relative w-80 sm:w-[480px] lg:w-[560px] h-40 sm:h-60 lg:h-64 filter drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                <img
                  src={brandLogoUrl}
                  alt="Hero 1st Image"
                  className={`w-full h-full object-contain ${heroImage ? 'object-center lg:object-left' : 'object-center'}`}
                />
              </div>
            </div>

            {/* Top Category Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-pink-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span className="text-[10px] sm:text-xs font-bold text-pink-900">
                BD & Global Expat Matrimonial Sanctuary
              </span>
            </div>

            {/* Subheading Text */}
            <div className="space-y-1">
              <h2 className="font-serif font-bold text-base sm:text-xl text-stone-900 leading-snug">
                {renderHeroTitle(heroTitle)}
              </h2>
              <p className="font-serif font-medium text-xs sm:text-xs text-pink-700">
                Dignified, Verified & Respectful Remarriage Sanctuary
              </p>
            </div>

            <p className={`text-stone-600 text-xs sm:text-xs leading-relaxed max-w-md ${heroImage ? 'mx-auto lg:mx-0' : 'mx-auto'}`}>
              {heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-wrap items-center justify-center ${heroImage ? 'lg:justify-start' : ''} gap-3 pt-1`}>
              <Button
                variant="wine"
                size="md"
                onClick={() => setIsProfileModalOpen(true)}
                className="w-full sm:w-auto justify-center rounded-full px-6 shadow-md shadow-pink-900/20 text-xs font-bold hover:scale-105 transition-all"
                leftIcon={<Users className="w-4 h-4 text-white" />}
              >
                View All Profiles
              </Button>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto justify-center rounded-full px-5 border-2 border-pink-200 text-pink-800 hover:bg-pink-50 text-xs font-bold"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />}
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Dynamic Uploaded Hero 2nd Image (Clean Direct Image Style - Extra Large Display) */}
          {heroImage ? (
            <div className="lg:col-span-6 flex justify-center my-4 lg:my-0">
              <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[560px] h-[320px] sm:h-[460px] lg:h-[520px] filter drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                <img
                  src={heroImage}
                  alt="Hero 2nd Image"
                  className="w-full h-full object-contain object-center"
                />
              </div>
            </div>
          ) : null}

        </div>
      </Container>

      {/* Modal for View All Profiles - 2 Sections (Female & Male) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 relative space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-pink-100 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  <span>Select Profile Category</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  View All Verified Profiles
                </h3>
                <p className="text-xs text-stone-500">
                  Select whether you want to view Female Bride profiles or Male Groom profiles.
                </p>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2 Separate Section Cards: Female & Male */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Section 1: Female Bride Profiles */}
              <div
                onClick={() => handleSelectGender('Female')}
                className="p-5 rounded-2xl border-2 border-pink-200 bg-gradient-to-b from-pink-50/70 to-rose-50/30 hover:border-pink-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">
                    👰
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-pink-600 transition-colors">
                      Female Profiles (পাত্রী)
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                      Divorced, Widowed, Single Parents & Mature Female Candidates
                    </p>
                  </div>
                </div>

                <Button
                  variant="wine"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectGender('Female');
                  }}
                  className="w-full justify-center rounded-full text-xs font-bold shadow-md shadow-pink-900/10"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 text-white" />}
                >
                  View Female IDs
                </Button>
              </div>

              {/* Section 2: Male Groom Profiles */}
              <div
                onClick={() => handleSelectGender('Male')}
                className="p-5 rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50/70 to-indigo-50/30 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">
                    🤵
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-blue-600 transition-colors">
                      Male Profiles (পাত্র)
                    </h4>
                    <p className="text-[11px] text-stone-500 leading-relaxed mt-1">
                      Divorced, Widowed, Single Parents & Mature Male Candidates
                    </p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectGender('Male');
                  }}
                  className="w-full justify-center rounded-full text-xs font-bold shadow-md shadow-blue-900/10 bg-blue-600 hover:bg-blue-700 border-blue-600"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5 text-white" />}
                >
                  View Male IDs
                </Button>
              </div>

            </div>

            {/* Modal Footer Note */}
            <div className="pt-2 border-t border-stone-100 text-center">
              <p className="text-[11px] text-stone-400 font-medium">
                🔒 100% NID Verified & Dignified Remarriage Profiles
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
