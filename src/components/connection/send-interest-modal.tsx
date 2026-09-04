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
      router.push(result.redirectUrl);
    } else if (result.message) {
      setNotice(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center space-y-5 py-2">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
          <Heart className="w-8 h-8 fill-rose-600" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Express Interest in {targetProfile.fullName.split(' ')[0]}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Send an express interest request to start your journey towards a mutual connection.
          </p>
        </div>

        {notice && (
          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-semibold">
            {notice}
          </div>
        )}

        {/* Candidate Summary Card */}
        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center gap-3 text-left">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
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
              {formatCurrency(MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT, 'BDT')}
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
