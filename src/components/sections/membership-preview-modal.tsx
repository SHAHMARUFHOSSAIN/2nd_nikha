'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MEMBERSHIP_CONFIG, MEMBERSHIP_PLANS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Lock, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';

export interface MembershipPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MembershipPreviewModal({
  isOpen,
  onClose,
}: MembershipPreviewModalProps) {
  const router = useRouter();
  const { membershipPlans } = useAdmin();

  // Read live price configured by Admin
  const livePrice = (membershipPlans && membershipPlans[0]?.price)
    ? membershipPlans[0].price
    : MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT;

  const premiumPlan = MEMBERSHIP_PLANS.find((p) => p.id === 'premium_monthly');

  const handleUpgradeClick = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-600 via-pink-700 to-rose-800 text-white flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900">
            Active Premium Subscription Required
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            To protect member privacy and ensure serious matrimonial intentions, sending Interest requires an active Premium membership.
          </p>
        </div>

        {/* Pricing Box */}
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6 rounded-3xl border-2 border-pink-200 shadow-sm relative text-center">
          <Badge variant="wine" className="mb-2">
            Recommended For Serious Singles
          </Badge>
          <div className="flex items-baseline justify-center gap-1.5 my-2">
            <span className="text-4xl font-serif font-extrabold text-stone-900">
              {formatCurrency(livePrice, 'BDT')}
            </span>
            <span className="text-stone-500 font-medium text-sm">/ month</span>
          </div>
          <p className="text-xs text-stone-600">Cancel anytime. Safe & encrypted SSL payment.</p>

          {/* Key Unlocked Features */}
          <div className="mt-4 pt-4 border-t border-pink-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs text-stone-700">
            {premiumPlan?.features.slice(4).map((feat, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{feat.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How Connection Works Process */}
        <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-pink-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-pink-600" />
            How Connection Safeguards Work:
          </h4>
          <ol className="text-xs text-stone-600 space-y-1.5 list-decimal pl-4">
            <li>Subscribe to Premium via secure payment.</li>
            <li>Send Express Interest to your chosen profile.</li>
            <li>When the receiver accepts, a Mutual Match is formed.</li>
            <li>Private Chat, Photo Sharing & Verified Contact sharing unlock automatically.</li>
          </ol>
        </div>

        {/* CTA Actions */}
        <div className="space-y-3 pt-2">
          <Button
            variant="wine"
            size="lg"
            className="w-full justify-center shadow-lg shadow-pink-900/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleUpgradeClick}
          >
            Upgrade Now to Send Interest
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-stone-500 hover:text-stone-700"
            onClick={onClose}
          >
            Cancel & Continue Browsing
          </Button>
        </div>
      </div>
    </Modal>
  );
}
