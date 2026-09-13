'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OFFICIAL_2ND_CHANCE_LOGO } from '@/lib/official-logo-data';
import {
  Heart,
  ShieldCheck,
  LogIn,
  Lock,
  Sparkles,
  ArrowRight,
  Check,
  Crown,
  Users,
  BadgeCheck,
  Building2,
  GraduationCap,
  MapPin,
  Sparkle,
  Smile,
} from 'lucide-react';
import { CurrencySwitcher } from '@/components/ui/currency-switcher';
import { useCurrency } from '@/lib/currency-context';

import { useAdmin } from '@/lib/admin-context';
import { BrandLogo } from '@/components/ui/brand-logo';

export function VisitorLandingGateway() {
  const router = useRouter();
  const { formatAmount } = useCurrency();

  let brandLogoUrl = OFFICIAL_2ND_CHANCE_LOGO;
  try {
    const admin = useAdmin();
    if (admin?.settings?.branding?.logoUrl) {
      brandLogoUrl = admin.settings.branding.logoUrl;
    }
  } catch (e) {
    // Context fallback
  }

  const handleSelectPass = (planId: string) => {
    const usd = planId === 'weekly' ? 2.99 : 6.99;
    const bdt = planId === 'weekly' ? 99 : 299;
    router.push(`/checkout?plan=${planId}&priceBDT=${bdt}&priceUSD=${usd}`);
  };

  // Sample verified candidates for preview section
  const candidatePreviews = [
    {
      age: 29,
      profession: 'Software Engineer',
      education: 'MSc in Computer Science',
      location: 'Dhaka, Bangladesh',
      status: 'Divorced',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    },
    {
      age: 34,
      profession: 'Doctor (BCS Health Officer)',
      education: 'MBBS, FCPS',
      location: 'Chittagong / Overseas',
      status: 'Widowed',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    },
    {
      age: 31,
      profession: 'Bank Senior Officer',
      education: 'BBA, MBA (Dhaka University)',
      location: 'Dhaka',
      status: 'Single Parent (1 Child)',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    },
  ];

  return (
    <div className="min-h-screen relative bg-stone-950 text-stone-900 selection:bg-pink-500 selection:text-white">
      
      {/* Premium Full-Page Ultra-Clear Wedding Couple Wallpaper Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000"
          alt="Matrimonial Marriage Background"
          fill
          priority
          className="object-cover object-center filter contrast-110 brightness-100 saturate-110"
        />
        {/* Subtle Crystal-Clear Light Vignette Gradient Overlay (No Blur) */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/25 to-stone-950/60" />
        
        {/* Glowing Decorative Light Ornaments */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 py-6 sm:py-10">
        <Container size="xl">
          <div className="space-y-12 max-w-6xl mx-auto">
            
            {/* Top Brand Bar - Sleek Floating Navbar */}
            <header className="flex flex-row items-center justify-between gap-1 sm:gap-4 border border-white/40 px-2 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-full bg-white/95 shadow-2xl backdrop-blur-2xl relative z-50 max-w-full">
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Link href="/" className="flex items-center gap-1 group">
                  <div className="hidden sm:block">
                    <BrandLogo size="md" showTagline />
                  </div>
                  <div className="sm:hidden">
                    <BrandLogo size="sm" showTagline={false} />
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                <CurrencySwitcher variant="navbar" dropPosition="down" />
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-2.5 sm:px-5 py-1 sm:py-2 border-2 border-pink-300 bg-pink-50 text-pink-900 font-bold hover:bg-pink-100 text-[10px] sm:text-xs shadow-xs shrink-0"
                    leftIcon={<LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-600" />}
                  >
                    <span className="hidden sm:inline">Member Login</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                </Link>
              </div>
            </header>

            {/* Hero Section with Generous Top Clearance (Prevents Dropdown Overlap) */}
            <section className="space-y-6 max-w-4xl mx-auto pt-8 sm:pt-14 text-center">
              
              <div className="inline-flex items-center gap-2 bg-stone-950/70 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30 shadow-2xl">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                <span className="text-xs sm:text-sm font-serif font-bold text-rose-100 tracking-wide uppercase">
                  🌸 BD & Global Expat Matrimonial Sanctuary • Every Heart Deserves a Second Chance
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold text-white leading-tight tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                Make Your Payment &{' '}
                <span className="bg-gradient-to-r from-pink-400 via-pink-300 to-rose-400 bg-clip-text text-transparent">
                  Start Your Beautiful Journey ❤️
                </span>
              </h1>

              <p className="text-base sm:text-xl text-stone-100 leading-relaxed font-serif max-w-2xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-semibold">
                A respectful, secure matrimonial sanctuary dedicated to divorced, widowed, single parents, and mature singles seeking a genuine lifelong companion.
              </p>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
                <span className="bg-white/95 text-rose-900 font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-2xl border border-rose-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  💍 100% Halal & NID Verified Profiles
                </span>
                <span className="bg-rose-600/90 text-white font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-2xl border border-rose-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  🔒 Private & Secure Matchmaking
                </span>
              </div>

              {/* Step Process Guidance Bar */}
              <div className="mt-8 p-4 bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 text-xs sm:text-sm text-white font-semibold flex items-center justify-center gap-2 max-w-2xl mx-auto shadow-2xl">
                <Lock className="w-4.5 h-4.5 text-amber-300 shrink-0" />
                <span>
                  <strong>3-Step Access:</strong> Step 1: Choose Subscription Pass → Step 2: Pay & Activate Account → Step 3: Complete Profile & View Matches
                </span>
              </div>
            </section>

            {/* Matrimonial Trust Statistics Bar - Glassmorphism */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl text-white">
              <div className="text-center space-y-1 p-2">
                <div className="flex items-center justify-center gap-1.5 text-amber-300">
                  <BadgeCheck className="w-5 h-5 text-amber-300" />
                  <span className="text-2xl sm:text-3xl font-serif font-extrabold text-white drop-shadow-md">10,000+</span>
                </div>
                <p className="text-[11px] text-rose-100 font-serif font-medium">Verified Candidates</p>
              </div>

              <div className="text-center space-y-1 p-2 border-l border-white/20">
                <div className="flex items-center justify-center gap-1.5 text-pink-300">
                  <Heart className="w-5 h-5 text-pink-300 fill-pink-300" />
                  <span className="text-2xl sm:text-3xl font-serif font-extrabold text-white drop-shadow-md">2,400+</span>
                </div>
                <p className="text-[11px] text-rose-100 font-serif font-medium">Successful Remarriages</p>
              </div>

              <div className="text-center space-y-1 p-2 border-l border-white/20">
                <div className="flex items-center justify-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  <span className="text-2xl sm:text-3xl font-serif font-extrabold text-white drop-shadow-md">100%</span>
                </div>
                <p className="text-[11px] text-rose-100 font-serif font-medium">NID Verified & Private</p>
              </div>

              <div className="text-center space-y-1 p-2 border-l border-white/20">
                <div className="flex items-center justify-center gap-1.5 text-amber-300">
                  <Crown className="w-5 h-5 text-amber-300 fill-amber-300" />
                  <span className="text-2xl sm:text-3xl font-serif font-extrabold text-white drop-shadow-md">24/7</span>
                </div>
                <p className="text-[11px] text-rose-100 font-serif font-medium">VIP Matchmaking Support</p>
              </div>
            </div>

            {/* Upfront Subscription Pass Cards Grid - Glassmorphism */}
            <section className="space-y-6 pt-2">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center justify-center gap-2 drop-shadow-md">
                  <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                  <span>Choose Your Matrimonial Subscription Pass</span>
                </h2>
                <p className="text-xs sm:text-sm text-rose-100 font-serif font-medium">
                  Select a pass below to pay, activate your account, and instantly view verified matches.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                
                {/* Card 1: Weekly Pass (Glass Card) */}
                <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/40 shadow-2xl hover:border-pink-300/80 transition-all flex flex-col justify-between relative group text-white hover:-translate-y-1">
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-3.5 py-1 rounded-full bg-white/20 text-rose-100 border border-white/30 text-[10px] font-bold uppercase tracking-wider">
                          Quick Trial Pass
                        </span>
                        <h3 className="font-serif font-bold text-2xl text-white mt-2 drop-shadow-sm">
                          Weekly Pass
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl sm:text-4xl font-serif font-extrabold text-white drop-shadow-md">
                          {formatAmount(99, 2.99)}
                        </span>
                        <span className="text-rose-200 text-xs font-medium block">/ 7 Days Access</span>
                      </div>
                    </div>

                    <p className="text-xs text-rose-100 leading-relaxed font-serif">
                      7 days full access to complete profile registration, search verified candidate profiles, and express mutual interest.
                    </p>

                    <div className="space-y-2.5 pt-3 text-xs text-stone-100 border-t border-white/20">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Complete Matrimonial Profile Setup</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Unlimited AI Match Searches & Profiles</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Unlimited Chatting, Photo Sharing & WhatsApp Number Sharing</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      variant="wine"
                      size="lg"
                      onClick={() => handleSelectPass('weekly')}
                      className="w-full justify-center rounded-2xl shadow-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 py-3.5 text-white border border-pink-400/50"
                      rightIcon={<ArrowRight className="w-5 h-5 text-white" />}
                    >
                      Pay {formatAmount(99, 2.99)} & Start Registration
                    </Button>
                  </div>
                </div>

                {/* Card 2: Monthly VIP Pass (Royal Glass Card) */}
                <div className="bg-gradient-to-b from-rose-900/40 via-white/20 to-pink-900/40 backdrop-blur-2xl rounded-3xl p-8 border-2 border-amber-300/80 shadow-2xl flex flex-col justify-between relative transform hover:-translate-y-1 transition-all text-white">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant="wine" className="shadow-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold px-4 py-1 text-xs tracking-wide border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1 animate-pulse" />
                      Best Value For Remarriage
                    </Badge>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-between items-start pt-2">
                      <div>
                        <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/40 text-[10px] font-bold uppercase tracking-wider">
                          Most Popular
                        </span>
                        <h3 className="font-serif font-bold text-2xl text-white mt-2 drop-shadow-sm">
                          Monthly Pass
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-300 drop-shadow-md">
                          {formatAmount(299, 6.99)}
                        </span>
                        <span className="text-rose-200 text-xs font-medium block">/ 30 Days Access</span>
                      </div>
                    </div>

                    <p className="text-xs text-rose-100 leading-relaxed font-serif">
                      30 days full premium access with priority search placement, private photo unlock, and 24/7 VIP matchmaking assistance.
                    </p>

                    <div className="space-y-2.5 pt-3 text-xs text-stone-100 border-t border-white/20">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Complete Matrimonial Profile Setup</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Unlimited AI Match Searches & Profiles</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Unlimited Chatting, Photo Sharing & WhatsApp Number Sharing</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      variant="wine"
                      size="lg"
                      onClick={() => handleSelectPass('monthly')}
                      className="w-full justify-center rounded-2xl shadow-2xl font-extrabold bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white py-3.5 border border-rose-400/60"
                      rightIcon={<ArrowRight className="w-5 h-5 text-white" />}
                    >
                      Pay {formatAmount(299, 6.99)} & Start Registration
                    </Button>
                  </div>
                </div>

              </div>
            </section>



            {/* Payment & Security Notice Banner - Glassmorphism Footer */}
            <footer className="p-6 bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 text-center space-y-2 max-w-4xl mx-auto shadow-2xl text-white">
              <div className="flex items-center justify-center gap-2 font-serif font-bold text-base text-white drop-shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>100% Secure SSL Payment & Dignified Matrimonial Guarantee</span>
              </div>
              <p className="text-xs text-rose-100 max-w-2xl mx-auto font-serif">
                Your payment activates instant access to search candidates, send interest requests, and complete your full matrimony profile setup. Privacy and NID verification are guaranteed.
              </p>
            </footer>

          </div>
        </Container>
      </div>
    </div>
  );
}
