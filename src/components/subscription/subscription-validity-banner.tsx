'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Crown, Clock, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';

export function SubscriptionValidityBanner() {
  const { userRole } = useAuth();
  const isPaidMember = userRole === 'PREMIUM' || userRole === 'ADMIN';

  // Active pass remaining validity days
  const remainingDays = 6;
  const passName = 'Weekly Pass (7 Days)';
  const expiryDate = 'Sep 20, 2026';

  if (!isPaidMember) {
    return (
      <div className="p-5 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 border-2 border-rose-300 rounded-3xl space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-600 text-white shrink-0 shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-stone-900">
                No Active Subscription Pass
              </h4>
              <p className="text-xs text-stone-600">
                Get full access to view candidate profiles, send direct messages, and exchange contacts.
              </p>
            </div>
          </div>

          <Link href="/checkout?plan=weekly&priceBDT=99&priceUSD=2.99">
            <Button variant="wine" size="sm" className="rounded-full text-xs font-bold shadow-md shrink-0" rightIcon={<ArrowRight className="w-4 h-4 text-white" />}>
              Get Pass Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border-2 border-amber-300 rounded-3xl space-y-3 shadow-md animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Pass Info & Expiry Badge */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 shrink-0 shadow-md">
            <Crown className="w-5 h-5 fill-stone-950" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-serif font-bold text-base text-stone-900">
                Active Subscription: <span className="text-pink-700">{passName}</span>
              </h4>
              <span className="px-3 py-0.5 rounded-full bg-amber-400 text-stone-950 font-extrabold text-[11px] shadow-xs flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-950" />
                <span>{remainingDays} Days Remaining</span>
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Valid until <strong>{expiryDate}</strong> • Full Premium Match & Messaging Access
            </p>
          </div>
        </div>

        {/* Renew Action Button */}
        <Link href="/checkout?plan=weekly&priceBDT=99&priceUSD=2.99">
          <Button
            variant="wine"
            size="sm"
            className="rounded-full text-xs font-bold shadow-md bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shrink-0"
            rightIcon={<RefreshCw className="w-3.5 h-3.5 text-white" />}
          >
            Renew Subscription Pass
          </Button>
        </Link>
      </div>

      {/* Notice Message */}
      <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 text-xs text-stone-700 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Subscription Renewal Notice:</strong> Your pass has <strong>{remainingDays} Days remaining</strong>. Renew now to ensure uninterrupted access to matches and direct messaging.
        </span>
      </div>
    </div>
  );
}
