'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/lib/admin-context';
import { OFFICIAL_2ND_CHANCE_LOGO } from '@/lib/official-logo-data';
import { Heart, ShieldCheck, Users, Smile, UserPlus, Search, Play, MapPin, Sparkles, Globe } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [iam, setIam] = useState('Female');
  const [lookingFor, setLookingFor] = useState('Divorced / Widowed');
  const [location, setLocation] = useState('Dhaka, Bangladesh');

  // Read dynamic branding CMS from Admin Settings
  let heroImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
  let heroTitle = 'Every heart deserves a second Nikha';
  let heroSubtitle = 'A trusted matrimonial sanctuary designed for divorced, widowed, single parents, and mature singles seeking a genuine, lifelong companion.';
  let brandLogoUrl = OFFICIAL_2ND_CHANCE_LOGO;

  try {
    const admin = useAdmin();
    if (admin?.settings?.branding?.heroImageUrl) heroImage = admin.settings.branding.heroImageUrl;
    if (admin?.settings?.branding?.heroTitle) {
      heroTitle = admin.settings.branding.heroTitle;
    }
    if (admin?.settings?.branding?.heroSubtitle) heroSubtitle = admin.settings.branding.heroSubtitle;
    if (admin?.settings?.branding?.logoUrl) {
      brandLogoUrl = admin.settings.branding.logoUrl;
    }
  } catch (e) {}

  const renderHeroTitle = (title: string) => {
    if (!title) return 'Every heart deserves a second Nikha';
    const match = title.match(/(2nd\s*nikah|2nd\s*nikha|second\s*nikah|2nd\s*chance)/i);
    if (match && match.index !== undefined) {
      const idx = match.index;
      const matchedText = match[0];
      const before = title.substring(0, idx);
      const after = title.substring(idx + matchedText.length);
      return (
        <>
          {before}
          <span className="text-pink-600 font-extrabold">{matchedText}</span>
          {after}
        </>
      );
    }
    return title;
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?gender=${iam}&maritalStatus=${lookingFor}&location=${encodeURIComponent(location)}`);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Column: Brand Headline & Introduction */}
          <div className="lg:col-span-4 space-y-4 text-center lg:text-left">
            
            {/* Direct Dynamic Uploaded Hero 1st Image */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-80 sm:w-[480px] lg:w-[560px] h-40 sm:h-60 lg:h-64 filter drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                <img
                  src={brandLogoUrl}
                  alt="Hero 1st Image"
                  className="w-full h-full object-contain object-center lg:object-left"
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

            <p className="text-stone-600 text-xs sm:text-xs leading-relaxed max-w-md mx-auto lg:mx-0">
              {heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  variant="wine"
                  size="md"
                  className="w-full sm:w-auto justify-center rounded-full px-6 shadow-md shadow-pink-900/20 text-xs"
                  leftIcon={<UserPlus className="w-4 h-4 text-white" />}
                >
                  Register Free Profile
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto justify-center rounded-full px-5 border-2 border-pink-200 text-pink-800 hover:bg-pink-50 text-xs"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />}
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Center Column: Dynamic Uploaded Hero 2nd Image (Clean Direct Image Style - Extra Large Display) */}
          <div className="lg:col-span-4 flex justify-center my-4 lg:my-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[560px] h-[320px] sm:h-[460px] lg:h-[520px] filter drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer">
              <img
                src={heroImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'}
                alt="Hero 2nd Image"
                className="w-full h-full object-contain object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';
                }}
              />
            </div>
          </div>

          {/* Right Column: AI Match Quick Search Card */}
          <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl border-2 border-pink-200 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
            <div className="border-b border-pink-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
                  <span>Quick AI Match Search</span>
                </h3>
                <p className="text-[11px] text-stone-500">Find compatible singles by status & location</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold">
                100% Free
              </span>
            </div>

            <form onSubmit={handleQuickSearch} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">I am a:</label>
                <select
                  value={iam}
                  onChange={(e) => setIam(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs font-semibold text-stone-800 focus:outline-none focus:border-pink-500"
                >
                  <option value="Female">Bride (Female)</option>
                  <option value="Male">Groom (Male)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Looking For:</label>
                <select
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs font-semibold text-stone-800 focus:outline-none focus:border-pink-500"
                >
                  <option value="Divorced / Widowed">Divorced / Widowed / Single Parent</option>
                  <option value="Never Married">Never Married (Mature Singles)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Residency / Location:</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3 text-xs font-semibold text-stone-800 focus:outline-none focus:border-pink-500"
                >
                  <option value="Dhaka, Bangladesh">Dhaka, Bangladesh 🇧🇩</option>
                  <option value="Chittagong, Bangladesh">Chittagong, Bangladesh 🇧🇩</option>
                  <option value="India">India (Mumbai / Delhi / Kolkata) 🇮🇳</option>
                  <option value="Pakistan">Pakistan (Lahore / Karachi / Islamabad) 🇵🇰</option>
                  <option value="USA">USA Expat (Green Card / Citizen) 🇺🇸</option>
                  <option value="UK">UK Expat (British Citizen) 🇬🇧</option>
                  <option value="UAE">Dubai / UAE Expat (Golden Visa) 🇦🇪</option>
                  <option value="Saudi Arabia">Saudi Arabia Expat 🇸🇦</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="wine"
                size="md"
                className="w-full justify-center rounded-2xl font-bold py-3 text-xs shadow-md shadow-pink-900/20 mt-2"
                leftIcon={<Search className="w-4 h-4 text-white" />}
              >
                Search Compatible Matches Now
              </Button>
            </form>
          </div>

        </div>
      </Container>
    </div>
  );
}
