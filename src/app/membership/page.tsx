import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { MembershipPreview } from '@/components/sections/membership-preview';
import { PlanComparisonTable } from '@/components/subscription/plan-comparison-table';
import { BRAND_NAME } from '@/lib/constants';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: `Membership Plans & Pricing | ${BRAND_NAME}`,
  description:
    'Transparent, affordable membership plans for serious singles seeking a second chance at marriage.',
};

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-stone-50/40 py-12 md:py-16 space-y-16">
      {/* Hero & Pricing Cards */}
      <MembershipPreview />

      {/* Feature Comparison Table */}
      <Container size="xl">
        <PlanComparisonTable />

        <div className="mt-12 p-6 bg-rose-50/60 rounded-3xl border border-rose-200 text-center space-y-2 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-rose-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <span>Encrypted & Safe Payments</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            All transactions are securely processed through SSLCommerz. Your financial details are encrypted and never stored on our servers.
          </p>
        </div>
      </Container>
    </div>
  );
}
