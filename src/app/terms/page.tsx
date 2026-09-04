'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="bg-stone-50/50 min-h-screen py-10 sm:py-14 space-y-10">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-stone-900 via-pink-950 to-stone-900 text-white py-14 border-b border-pink-900/50 relative overflow-hidden">
        <Container size="lg" className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-pink-200 border border-white/20 shadow-md">
            <FileText className="w-4 h-4 text-pink-400" />
            <span>Official Matrimonial Membership Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Please read these Terms of Service carefully before creating your profile on 2nd Chance Matrimonial Platform.
          </p>
        </Container>
      </section>

      {/* Main Terms Document */}
      <Container size="lg">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-8 text-stone-800 leading-relaxed max-w-4xl mx-auto">
          
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
              1. Eligibility & Verification Requirements
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              You must be at least 18 years of age (for females) or 21 years of age (for males) and legally eligible for marriage under applicable laws. You agree to submit authentic NID or Passport credentials for verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
              2. Code of Conduct & Respectful Matrimonial Intent
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              2nd Chance Matrimonial is strictly a serious matrimonial sanctuary for marriage seekers. Dating, casual encounters, financial solicitations, harassment, or offensive behavior will result in immediate permanent account termination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif font-bold text-xl text-stone-900 border-b border-stone-100 pb-3">
              3. Membership & SSLCommerz Payments
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              All subscription purchases (Weekly Pass ৳99 BDT / Monthly Pass ৳299 BDT / International USD $4.99) are processed via SSLCommerz gateway and grant access to premium features for the selected duration.
            </p>
          </section>

        </div>
      </Container>

    </div>
  );
}
