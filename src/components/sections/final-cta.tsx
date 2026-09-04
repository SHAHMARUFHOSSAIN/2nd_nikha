import React from 'react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { Heart, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export function FinalCta() {
  return (
    <section className="py-20 bg-gradient-to-r from-brand-wineDark via-brand-wine to-brand-magenta text-white relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

      <Container size="lg" className="relative z-10 text-center space-y-6">
        <div className="w-14 h-14 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-xl">
          <Heart className="w-7 h-7 text-rose-300 fill-rose-300 animate-pulse" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Your Second Chapter of Love & Happiness Starts Here
        </h2>

        <p className="text-rose-100 font-serif italic text-lg sm:text-xl">
          "{BRAND_TAGLINE}"
        </p>

        <p className="text-rose-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Join thousands of verified divorced, widowed, single parents, and mature singles who found hope, dignity, and lifelong companionship on {BRAND_NAME}.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 shadow-xl shadow-rose-950/40"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Create Your Free Account
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
          >
            Learn How It Works
          </Button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-rose-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Confidential Registration
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Zero Stigma Environment
          </span>
        </div>
      </Container>
    </section>
  );
}
