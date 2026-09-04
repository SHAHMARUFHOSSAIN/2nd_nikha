'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Lock, Eye, FileText, UserCheck, CheckCircle2, Phone, Mail, ArrowRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-stone-50/50 min-h-screen py-10 sm:py-14 space-y-10">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-pink-950 via-stone-900 to-pink-950 text-white py-14 border-b border-pink-900/50 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-pink-600/10 filter blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-rose-600/10 filter blur-3xl pointer-events-none" />

        <Container size="lg" className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-pink-200 border border-white/20 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Matrimonial Privacy Standard</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Privacy Policy & Data Security
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            At 2nd Chance Matrimonial, your personal dignity, NID credentials, photo privacy, and communication confidentiality are protected by highest enterprise security standards.
          </p>

          <div className="pt-2">
            <span className="text-[11px] font-mono text-pink-300 font-semibold bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800">
              Last Revised & Updated: March 2026
            </span>
          </div>
        </Container>
      </section>

      {/* Main Privacy Policy Content Grid */}
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Table of Contents (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-4 lg:sticky lg:top-24">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-pink-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-600" />
              <span>Policy Index</span>
            </h3>

            <nav className="space-y-2 text-xs font-semibold text-stone-700">
              <a href="#information-collection" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                1. Information We Collect
              </a>
              <a href="#photo-privacy" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                2. Photo & NID Privacy Controls
              </a>
              <a href="#payment-security" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                3. SSLCommerz Payment Data Security
              </a>
              <a href="#data-usage" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                4. Communication Confidentiality
              </a>
              <a href="#user-rights" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                5. Your Privacy Rights & Controls
              </a>
              <a href="#dpo-contact" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                6. Contact Privacy Officer
              </a>
            </nav>

            <div className="p-4 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 rounded-2xl border border-pink-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-pink-900">
                <Lock className="w-4 h-4 text-pink-600" />
                <span>Need Instant Privacy Help?</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Contact our dedicated Matrimonial Support Team for immediate profile unlisting or data inquiry.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-bold text-pink-700 hover:text-pink-900 pt-1"
              >
                <span>Go to Contact Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Detailed Privacy Document (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-8 text-stone-800 leading-relaxed">
            
            {/* Section 1 */}
            <section id="information-collection" className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                  01
                </span>
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  Information We Collect & Verify
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                To maintain a safe, authentic, and high-trust matrimonial sanctuary for divorced, widowed, single parents, and mature singles in Bangladesh and worldwide, we collect the following essential data:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 pl-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Account Profile Details:</strong> Full name, date of birth, age, height, marital status, religion, mother tongue, residency status, education degree, profession, and family origin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Identity Verification Documents:</strong> National ID (NID) card, Passport, or Educational Certificates for identity audit. NID documents are encrypted and accessible strictly by authorized moderation staff.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Contact Preferences:</strong> Phone number, WhatsApp number, and email address used for contact sharing after mutual interest approval.</span>
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="photo-privacy" className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                  02
                </span>
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  Photo & NID Privacy Controls
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                We understand that privacy is paramount in matrimonial matching. You retain 100% control over how your profile photo and personal credentials are presented:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 space-y-1 text-xs">
                  <h4 className="font-bold text-pink-900 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-pink-600" />
                    <span>Photo Visibility Toggle</span>
                  </h4>
                  <p className="text-stone-600">You can choose whether your profile photo is visible to all verified members or strictly to candidates whose interest you accept.</p>
                </div>

                <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 space-y-1 text-xs">
                  <h4 className="font-bold text-pink-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-pink-600" />
                    <span>NID Document Privacy</span>
                  </h4>
                  <p className="text-stone-600">Your raw NID image is NEVER displayed publicly. Only the verified green badge (`NID Verified`) appears on your profile card.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="payment-security" className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                  03
                </span>
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  SSLCommerz Payment Security (Zero Credit Card Storage)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                All membership transactions (Weekly Pass ৳99 BDT / Monthly Pass ৳299 BDT / International USD $4.99) are processed via **SSLCommerz**, Bangladesh's premier PCI-DSS compliant payment gateway.
              </p>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Secure Payment Assurance</span>
                </p>
                <p className="text-emerald-800">
                  We NEVER store your credit card details, debit card numbers, bKash PIN, or Nagad OTP on our servers. All financial transactions occur directly inside SSLCommerz's encrypted bank portal.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="data-usage" className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                  04
                </span>
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  Communication Confidentiality
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                Your private Messenger chats, shared contact details, and exchanged photos are end-to-end protected. We do not sell, rent, or share member personal data with third-party advertising brokers.
              </p>
            </section>

            {/* Section 5 */}
            <section id="user-rights" className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                  05
                </span>
                <h2 className="font-serif font-bold text-xl text-stone-900">
                  Your Privacy Rights & Account Control
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-600">
                You have full ownership of your data on 2nd Chance Matrimonial:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 pl-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                  <span><strong>Profile Hide / Pause:</strong> Temporarily hide your profile from search results while reviewing existing matches.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />
                  <span><strong>Permanent Deletion:</strong> Permanently delete your account, chat history, and uploaded photos anytime from Settings.</span>
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="dpo-contact" className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Contact Data Protection Officer (DPO)
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                If you have privacy concerns or need assistance with your personal data:
              </p>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-2">
                <p className="flex items-center gap-2 font-bold text-stone-900">
                  <Mail className="w-4 h-4 text-pink-600" />
                  <span>privacy@2ndchancebd.com</span>
                </p>
                <p className="flex items-center gap-2 text-stone-600">
                  <Phone className="w-4 h-4 text-pink-600" />
                  <span>+880 1700-000000 (Dhaka Headquarters)</span>
                </p>
              </div>
            </section>

          </div>

        </div>
      </Container>

    </div>
  );
}
