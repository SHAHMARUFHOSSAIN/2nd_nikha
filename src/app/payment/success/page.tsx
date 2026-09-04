'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { PaymentService } from '@/lib/payment/payment-service';
import { PaymentVerificationResult } from '@/lib/payment/gateway-interface';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { setRole } = useAuth();
  const txnId = searchParams.get('txn') || 'TXN-SSL-884920';

  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<PaymentVerificationResult | null>(null);

  useEffect(() => {
    PaymentService.verifyPayment(txnId).then((res) => {
      setVerificationResult(res);
      setIsVerifying(false);
      if (res.verified) {
        setRole('PREMIUM');
      }
    });
  }, [txnId, setRole]);

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-2xl text-center space-y-6">
      {isVerifying ? (
        <div className="space-y-4 py-8">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Verifying Payment with Gateway...
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Securely confirming transaction ID <strong>{txnId}</strong> with payment verification server.
          </p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <Badge variant="success">Verified Paid</Badge>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Payment Successful ❤️
            </h1>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              Your payment has been verified. Express interest and Premium benefits are now active!
            </p>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-xs text-stone-700 text-left space-y-2">
            <div className="flex justify-between border-b border-rose-100 pb-1.5">
              <span className="font-semibold text-stone-900">Purpose:</span>
              <span>Express Interest / Premium</span>
            </div>
            <div className="flex justify-between border-b border-rose-100 pb-1.5">
              <span className="font-semibold text-stone-900">Amount Paid:</span>
              <span className="font-bold text-rose-800">
                {formatCurrency(MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT, 'BDT')}
              </span>
            </div>
            <div className="flex justify-between border-b border-rose-100 pb-1.5">
              <span className="font-semibold text-stone-900">Transaction ID:</span>
              <span className="font-mono text-stone-800">{txnId}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/member">
              <Button
                variant="wine"
                size="lg"
                className="w-full justify-center shadow-lg shadow-rose-900/20"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Go to Dashboard & View Matches
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 bg-gradient-to-b from-rose-50/40 via-white to-pink-50/30">
      <Container size="sm">
        <Suspense fallback={
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500 mx-auto" />
            <p className="text-xs text-stone-500 mt-2">Loading Payment Details...</p>
          </div>
        }>
          <PaymentSuccessContent />
        </Suspense>
      </Container>
    </div>
  );
}
