'use client';

import React from 'react';
import Link from 'next/link';
import { MemberLayout } from '@/components/member/member-layout';
import { SubscriptionStatusCard } from '@/components/subscription/subscription-status-card';
import { Button } from '@/components/ui/button';
import { PlanComparisonTable } from '@/components/subscription/plan-comparison-table';
import { History, Crown, ShieldCheck } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <MemberLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Crown className="w-7 h-7 text-amber-500" />
              <span>Membership & Subscription</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Manage your active subscription plan, billing details, and payment receipts.
            </p>
          </div>

          <Link href="/member/subscription/history">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<History className="w-4 h-4 text-stone-500" />}
            >
              View Payment History
            </Button>
          </Link>
        </div>

        {/* Current Active Status Card */}
        <SubscriptionStatusCard />

        {/* Detailed Feature Comparison */}
        <PlanComparisonTable />
      </div>
    </MemberLayout>
  );
}
