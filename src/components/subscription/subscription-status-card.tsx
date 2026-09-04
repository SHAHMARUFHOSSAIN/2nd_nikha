'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Crown, Sparkles, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

export function SubscriptionStatusCard() {
  const { userRole } = useAuth();

  if (userRole === 'PREMIUM') {
    return (
      <div className="bg-gradient-to-br from-brand-wineDark via-brand-wine to-brand-magenta text-white p-6 rounded-3xl shadow-lg space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur text-amber-300">
              <Crown className="w-5 h-5 fill-amber-300" />
            </div>
            <div>
              <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider block">
                Current Plan
              </span>
              <h3 className="font-serif font-bold text-xl text-white">
                Premium Monthly ❤️
              </h3>
            </div>
          </div>
          <Badge variant="success" className="bg-emerald-500 text-white font-bold border-none">
            Active
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-white/10 p-3.5 rounded-2xl backdrop-blur">
          <div>
            <span className="text-stone-300 block">Monthly Price:</span>
            <strong className="text-white">{formatCurrency(MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT, 'BDT')}</strong>
          </div>
          <div>
            <span className="text-stone-300 block">Status:</span>
            <strong className="text-emerald-300">Verified Active</strong>
          </div>
          <div>
            <span className="text-stone-300 block">Renews / Expires:</span>
            <strong className="text-white">Mar 01, 2026</strong>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
          <span className="text-rose-200">Txn: TXN-SSL-884920</span>
          <Link href="/member/subscription">
            <Button variant="outline" size="sm" className="border-white/30 text-white bg-white/10 hover:bg-white/20">
              Manage Membership
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
        Upgrade to Premium to send unlimited Interest requests, initiate chat after mutual match, and view verified WhatsApp / contact details.
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
