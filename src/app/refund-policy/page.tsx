'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { FileText, ShieldCheck, RefreshCcw, ChevronRight, Mail, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="bg-stone-50/50 min-h-screen py-10 sm:py-14 space-y-10">

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-pink-950 via-stone-900 to-pink-950 text-white py-14 border-b border-pink-900/50 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-pink-600/10 filter blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-rose-600/10 filter blur-3xl pointer-events-none" />

        <Container size="lg" className="text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-pink-200 border border-white/20 shadow-md">
            <RefreshCcw className="w-4 h-4 text-emerald-400" />
            <span>Subscription &amp; Refund Policy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Subscription &amp; Refund Policy
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            This policy explains how subscription purchases are activated, how refunds are handled, and what to do in case of duplicate, incorrect, or failed payments.
          </p>

          <div className="pt-2">
            <span className="text-[11px] font-mono text-pink-300 font-semibold bg-stone-900/80 px-3 py-1 rounded-full border border-stone-800">
              Effective Date: March 2026
            </span>
          </div>
        </Container>
      </section>

      {/* Main Refund Policy Content Grid */}
      <Container size="lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sticky Table of Contents */}
          <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-pink-100 shadow-sm space-y-4 lg:sticky lg:top-24">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-pink-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-pink-600" />
              <span>Policy Index</span>
            </h3>

            <nav className="space-y-2 text-xs font-semibold text-stone-700">
              <a href="#subscription-purchase" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                1. Subscription Purchase
              </a>
              <a href="#subscription-activation" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                2. Subscription Activation
              </a>
              <a href="#subscription-duration" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                3. Subscription Duration
              </a>
              <a href="#premium-benefits" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                4. Premium Membership Benefits
              </a>
              <a href="#cancellation" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                5. Cancellation
              </a>
              <a href="#refund-eligibility" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                6. Refund Eligibility
              </a>
              <a href="#non-refundable" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                7. Non-Refundable Circumstances
              </a>
              <a href="#duplicate-payment" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                8. Duplicate / Incorrect Payment
              </a>
              <a href="#failed-payment" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                9. Failed Payment
              </a>
              <a href="#payment-verification" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                10. Payment Verification
              </a>
              <a href="#how-to-request" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                11. How to Request a Refund
              </a>
              <a href="#processing-timeline" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                12. Refund Processing Timeline
              </a>
              <a href="#support" className="block p-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-all border border-transparent hover:border-pink-200">
                13. Support Contact
              </a>
            </nav>
          </div>

          {/* Right: Policy Content */}
          <div className="lg:col-span-8 space-y-6">

            <section id="subscription-purchase" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">1. Subscription Purchase</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Premium membership on 2nd Chance Matrimonial is offered as a paid subscription on a weekly or monthly basis. When you purchase a subscription, you select a plan from the Membership Plans page and complete your payment securely through the SSLCommerz payment gateway.
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                By completing a payment, you agree to the Terms &amp; Conditions, Privacy Policy, and this Subscription &amp; Refund Policy. A record of your consent is captured by the platform at the time of payment.
              </p>
            </section>

            <section id="subscription-activation" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">2. Subscription Activation</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your subscription is activated automatically as soon as SSLCommerz confirms the payment as successful. Activation may take a few minutes while the payment is verified by the gateway. Once verified, your Premium benefits are applied to your account immediately.
              </p>
              <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>If you paid before registering (guest checkout), your benefits are applied to your account automatically when you complete registration with the same email address used for payment.</span>
              </div>
            </section>

            <section id="subscription-duration" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">3. Subscription Duration</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Weekly Pass subscriptions are active for seven (7) days from the activation date. Monthly Pass subscriptions are active for thirty (30) days from the activation date. When your subscription expires, Premium benefits are paused until you purchase a new subscription.
              </p>
            </section>

            <section id="premium-benefits" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">4. Premium Membership Benefits</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Premium membership unlocks features including unlimited Express Interests, Mutual Match chatting, Photo Sharing, and Direct Contact details. These digital benefits are delivered immediately upon successful payment verification.
              </p>
            </section>

            <section id="cancellation" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">5. Cancellation</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Subscriptions do not auto-renew and may be cancelled at any time by contacting our support team. Cancellation stops future charges only; it does not entitle you to a refund for the already-active billing period in which you used the Premium benefits.
              </p>
            </section>

            <section id="refund-eligibility" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">6. Refund Eligibility</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                Because Premium membership is a digital service delivered immediately upon activation, refunds are granted only in the circumstances described below:
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5">
                <li>Duplicate, incorrect, or unintended successful payments (see Section 8).</li>
                <li>Payments captured by the gateway where the platform could not verify or activate the subscription due to a platform or gateway technical fault.</li>
                <li>Errors entirely attributable to the platform that prevented delivery of the purchased subscription.</li>
              </ul>
            </section>

            <section id="non-refundable" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">7. Non-Refundable Circumstances</h2>
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-2xl text-[11px] text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>No refund is provided where the subscription was successfully activated and the Premium benefits were delivered or made available, including cases where the member later changes their mind, deletes their profile, or chooses not to continue using the platform.</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Refunds are also not provided for a subscription period that was already active and consumed, or where a refund claim is the result of the member failing to follow the correct purchase or registration process.
              </p>
            </section>

            <section id="duplicate-payment" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">8. Duplicate / Incorrect Payment</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                If you are charged more than once for the same plan in a single transaction, or discover an incorrect charge, contact support within 7 days of the payment with your transaction ID and payment reference. After we verify the duplicate or incorrect transaction through the gateway, a refund of the excess amount is initiated.
              </p>
            </section>

            <section id="failed-payment" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">9. Failed Payment</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                If a payment fails, you are not charged and no subscription is activated. If your bank or mobile wallet statement shows a deduction but our system or SSLCommerz marks the transaction as failed, please keep the transaction reference and contact support. We will verify the transaction with the gateway; if funds were captured, a refund is initiated.
              </p>
            </section>

            <section id="payment-verification" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">10. Payment Verification</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                All payments are verified server-side through SSLCommerz before a subscription is activated. A payment is only considered successful after the gateway confirms it. We may also re-verify a transaction while processing a refund request to confirm its status, amount, and settlement before any refund is issued.
              </p>
            </section>

            <section id="how-to-request" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">11. How to Request a Refund</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                To request a refund, contact our support team and provide:
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5">
                <li>Your full name and the email address used for payment.</li>
                <li>The transaction ID and payment date.</li>
                <li>The amount charged and the plan purchased.</li>
                <li>A short explanation of why you believe a refund is due.</li>
              </ul>
              <div className="flex items-start gap-2.5 p-3 bg-pink-50 border border-pink-100 rounded-2xl text-[11px] text-pink-800">
                <Mail className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <span>Please include the words "Refund Request" in your email subject line so that it is directed to the correct team.</span>
              </div>
            </section>

            <section id="processing-timeline" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">12. Refund Processing Timeline</h2>
              <div className="flex items-start gap-2.5 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-[11px] text-emerald-800">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Approved refunds will be processed within 7–10 working days.</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Once approved, the refund is submitted to the originating payment method. Depending on your bank or mobile financial service, the refunded amount may take additional time to appear in your account after the platform has processed it.
              </p>
            </section>

            <section id="support" className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">13. Support Contact</h2>
              <p className="text-xs text-stone-600 leading-relaxed">
                For subscription, payment, or refund questions, please contact our support team. You can also review our Terms &amp; Conditions, Privacy Policy, or reach us through the Contact Us page.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline"><Link className="text-pink-700" href="/contact">Contact Us</Link></Badge>
                <Badge variant="outline"><Link className="text-pink-700" href="/terms">Terms &amp; Conditions</Link></Badge>
                <Badge variant="outline"><Link className="text-pink-700" href="/privacy">Privacy Policy</Link></Badge>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-stone-400">Refund Policy · 2nd Chance Matrimonial</p>
                <ChevronRight className="w-4 h-4 text-pink-300" />
              </div>
            </section>

          </div>
        </div>
      </Container>
    </div>
  );
}