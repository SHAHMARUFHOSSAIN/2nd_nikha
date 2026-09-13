'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useConnection } from '@/lib/connection-context';
import { Profile } from '@/types';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCurrency } from '@/lib/currency-context';

export interface SendInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile: Profile;
  onSuccess?: () => void;
}

export function SendInterestModal({
  isOpen,
  onClose,
  targetProfile,
  onSuccess,
}: SendInterestModalProps) {
  const router = useRouter();
  const { formatAmount } = useCurrency();
  const { sendInterestRequest, getInterestStatus } = useConnection();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const existingStatus = getInterestStatus(targetProfile.id);

  const handleProceedToPayment = async () => {
    if (existingStatus === 'SENT' || existingStatus === 'ACCEPTED') {
      setNotice(`Interest already sent to ${targetProfile.fullName}.`);
      return;
    }

    setLoading(true);
    const result = await sendInterestRequest(targetProfile);
    setLoading(false);

    if (result.success && result.redirectUrl) {
      onClose();
      if (result.redirectUrl.startsWith('http://') || result.redirectUrl.startsWith('https://')) {
        window.location.href = result.redirectUrl;
      } else {
        router.push(result.redirectUrl);
      }
    } else if (result.message) {
      setNotice(result.message);
    }
    if (onSuccess) onSuccess();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="space-y-4 py-2 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-inner border border-rose-200">
          <Heart className="w-7 h-7 fill-rose-600 text-rose-600" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Express Interest Confirmation
          </h3>
          <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
            Sending interest lets <strong>{targetProfile.fullName}</strong> know you wish to connect for marriage.
          </p>
        </div>

        {notice && (
          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-semibold">
            {notice}
          </div>
        )}

        {/* Profile Card Summary */}
        <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center gap-3 text-left">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-rose-200 shrink-0">
            <Image
              src={targetProfile.photoUrl}
              alt={targetProfile.fullName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-stone-900">
              {targetProfile.fullName}, {targetProfile.age}
            </h4>
            <p className="text-xs text-stone-600">
              {targetProfile.profession} • {targetProfile.location}
            </p>
            <span className="text-[10px] font-bold text-rose-800 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3 text-rose-600" /> {targetProfile.matchPercentage}% Compatibility Match
            </span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
          <div className="flex justify-between">
            <span>Interest Activation Fee:</span>
            <strong className="text-rose-800 font-bold">
              {formatAmount(MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT, 6.99)}
            </strong>
          </div>
          <p className="text-[10px] text-stone-400 text-left">
            * Unlocks Express Interest sending & payment history receipt.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="wine"
            size="sm"
            onClick={handleProceedToPayment}
            disabled={loading}
            className="shadow-md"
            rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
          >
            {loading ? 'Initiating Gateway...' : 'Proceed to Checkout'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
