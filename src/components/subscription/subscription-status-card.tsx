'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Crown, Sparkles, Clock, RefreshCw, ArrowRight } from 'lucide-react';

export function SubscriptionStatusCard() {
  const { userRole } = useAuth();
  const remainingDays = 6;
  const expiryDate = 'Sep 20, 2026';

  if (userRole === 'PREMIUM' || userRole === 'ADMIN') {
    return (
      <div className="bg-gradient-to-br from-brand-wineDark via-brand-wine to-brand-magenta text-white p-6 rounded-3xl shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur text-amber-300">
              <Crown className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider block">
                Current Active Pass
              </span>
              <h3 className="font-serif font-bold text-xl text-white">
                Weekly Pass (7 Days) ❤️
              </h3>
            </div>
          </div>
          <Badge variant="success" className="bg-amber-400 text-stone-950 font-extrabold border-none px-3 py-1 text-xs">
            ⏳ {remainingDays} Days Left
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white/10 p-3.5 rounded-2xl backdrop-blur">
          <div>
            <span className="text-stone-300 block">Pass Price:</span>
            <strong className="text-white">৳99 / $2.99</strong>
          </div>
          <div>
            <span className="text-stone-300 block">Validity Remaining:</span>
            <strong className="text-amber-300 font-bold">{remainingDays} Days Remaining</strong>
          </div>
          <div>
            <span className="text-stone-300 block">Expiry Date:</span>
            <strong className="text-white">{expiryDate}</strong>
          </div>
        </div>

        {/* Renewal Message Banner */}
        <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-2xl text-xs text-amber-100 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Clock className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Subscription Renewal Reminder</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-100">
            Your pass has <strong>{remainingDays} Days remaining</strong>. Renew now to maintain uninterrupted access to candidate profiles, direct chat, and verified contacts.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
          <span className="text-rose-200">Txn: TXN-PASS-884920</span>
          <Link href="/checkout?plan=weekly&priceBDT=99&priceUSD=2.99">
            <Button
              variant="wine"
              size="sm"
              className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold border-none shadow-md"
              rightIcon={<RefreshCw className="w-3.5 h-3.5 text-stone-950" />}
            >
              Renew Pass Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-rose-50/90 via-white to-pink-50/60 p-6 rounded-3xl border-2 border-rose-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Current Plan
            </span>
            <h3 className="font-serif font-bold text-xl text-stone-900">
              Free Member
            </h3>
          </div>
        </div>
        <Badge variant="outline">Active Free</Badge>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Upgrade to a Weekly or Monthly Pass to view candidate profiles, send direct messages, and exchange verified contacts.
      </p>

      <div className="pt-2 flex items-center justify-between border-t border-rose-100">
        <span className="text-xs font-bold text-rose-800">
          {formatCurrency(MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT, 'BDT')} / month
        </span>
        <Link href="/membership">
          <Button
            variant="wine"
            size="sm"
            className="shadow-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Upgrade to Premium
          </Button>
        </Link>
      </div>
    </div>
  );
}
