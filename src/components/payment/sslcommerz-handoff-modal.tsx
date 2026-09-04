'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { ShieldCheck, Loader2, Lock } from 'lucide-react';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export interface SSLCommerzHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount?: number;
}

export function SSLCommerzHandoffModal({
  isOpen,
  onClose,
  amount = MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT,
}: SSLCommerzHandoffModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center space-y-5 py-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-wine to-brand-magenta text-white flex items-center justify-center mx-auto shadow-xl">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Redirecting to Secure Payment
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
            Your payment of <strong>{formatCurrency(amount, 'BDT')}</strong> will be securely processed through <strong>SSLCommerz Gateway</strong>.
          </p>
        </div>

        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Connection</span>
          </div>
          <p className="text-[11px] text-stone-400">
            Supports bKash, Nagad, Rocket, Visa, Mastercard, and Net Banking.
          </p>
        </div>

        <p className="text-[10px] text-stone-400 italic">
          Please do not refresh or close this browser window during handoff.
        </p>
      </div>
    </Modal>
  );
}
