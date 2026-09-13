'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { MEMBERSHIP_PLANS as FALLBACK_PLANS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { MembershipPreviewModal } from './membership-preview-modal';
import { useAdmin } from '@/lib/admin-context';
import { useCurrency } from '@/lib/currency-context';
import { CurrencySwitcher } from '@/components/ui/currency-switcher';

export function MembershipPreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRequiredNotice = searchParams.get('reason') === 'subscription_required' || searchParams.get('required') === 'true';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { membershipPlans } = useAdmin();
  const { formatAmount, selectedCountry } = useCurrency();

  // Dynamically map live Admin Panel plans
  const activePlans = (membershipPlans && membershipPlans.length > 0)
    ? membershipPlans.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.billingPeriod === '1 Week'
          ? '7 days full premium access to send interests, unlock chat & contacts.'
          : '30 days full premium access with priority search placement & 24/7 VIP support.',
        priceBDT: p.price,
        priceUSD: p.id === 'weekly' || p.billingPeriod === '1 Week' ? 2.99 : 6.99,
        billingCycle: p.billingPeriod === '1 Week' ? 'week' : 'month',
        isPopular: p.id === 'monthly' || p.billingPeriod === '1 Month',
        badge: p.id === 'monthly' || p.billingPeriod === '1 Month' ? 'Best Value For Remarriage' : 'Quick Access',
        features: [
          { text: 'Complete Matrimonial Profile Setup', included: true },
          { text: 'Unlimited AI Match Searches & Profiles', included: true },
          { text: 'Unlimited Chatting, Photo Sharing & WhatsApp Number Sharing', included: true },
        ],
      }))
    : FALLBACK_PLANS.map((p) => ({
        ...p,
        priceBDT: p.priceBDT,
        priceUSD: p.priceUSD,
      }));

  const handleSelectPlan = (planId: string, priceBDT: number, priceUSD: number) => {
    router.push(`/checkout?plan=${planId}&priceBDT=${priceBDT}&priceUSD=${priceUSD}`);
  };

  return (
    <section id="membership" className="py-16 sm:py-20 bg-white relative">
      <Container size="xl">
        {isRequiredNotice && (
          <div className="mb-8 p-5 bg-amber-500/10 border-2 border-amber-500/80 text-amber-900 rounded-3xl text-center space-y-1 shadow-lg animate-in fade-in">
            <div className="flex items-center justify-center gap-2 font-serif font-bold text-base text-amber-900">
              <Lock className="w-5 h-5 text-amber-700" />
              <span>Subscription Pass Required to Access 2nd Nikha Features</span>
            </div>
            <p className="text-xs text-amber-800 max-w-xl mx-auto font-medium">
              To view member profiles, smart AI matches, send interest, or chat with matches, please choose a Weekly or Monthly Subscription Pass below.
            </p>
          </div>
        )}

        <SectionHeading
          eyebrow="Transparent PayStation Membership"
          title="Simple & Fair Pricing For Genuine Remarriage Connections"
          highlightWord="Simple & Fair"
          subtitle="Select Weekly Pass or Monthly Pass. Bangladeshi members pay in BDT via bKash/Nagad; International members pay in USD via Visa/Mastercard/AMEX."
          align="center"
        />

        {/* Currency & Country Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 mb-8 text-xs font-semibold text-stone-600">
          <div className="flex items-center gap-2 bg-pink-50/80 px-4 py-2 rounded-full border border-pink-200 shadow-xs">
            <span>Select Region & Payment Currency:</span>
            <CurrencySwitcher variant="pricing" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {activePlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-rose-50/60 via-white to-pink-50/40 border-2 border-pink-400 shadow-xl shadow-pink-100/60 scale-102'
                  : 'bg-white border-stone-200 shadow-md hover:border-pink-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold shadow-lg border whitespace-nowrap ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white border-pink-300'
                      : 'bg-gradient-to-r from-stone-900 to-pink-950 text-pink-200 border-pink-700/60'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 mr-1.5 animate-pulse" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-serif font-bold text-2xl text-stone-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1.5 my-4">
                  <span className="text-4xl font-serif font-extrabold text-stone-900">
                    {formatAmount(plan.priceBDT, plan.priceUSD)}
                  </span>
                  <span className="text-stone-500 text-sm font-medium">
                    / {plan.billingCycle}
                  </span>
                  <span className="text-xs text-pink-700 font-mono font-bold ml-2">
                    {selectedCountry.flag} {selectedCountry.currency}
                  </span>
                </div>

                <ul className="space-y-3 my-6 text-sm">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {feat.included ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center shrink-0">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <span
                        className={
                          feat.included ? 'text-stone-700 font-medium' : 'text-stone-400 line-through'
                        }
                      >
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2">
                <Button
                  variant={plan.isPopular ? 'wine' : 'primary'}
                  size="lg"
                  className="w-full justify-center shadow-lg shadow-pink-900/20"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => handleSelectPlan(plan.id, plan.priceBDT, plan.priceUSD || (plan.id === 'weekly' ? 2.99 : 6.99))}
                >
                  Pay {formatAmount(plan.priceBDT, plan.priceUSD)} Now
                </Button>
                <p className="text-[10px] text-center text-stone-400">
                  {selectedCountry.currency === 'BDT'
                    ? 'bKash, Nagad, Rocket, Local Cards'
                    : 'International Visa, Mastercard, AMEX Cards'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <MembershipPreviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </Container>
    </section>
  );
}
