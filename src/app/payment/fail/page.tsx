'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || '';

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-red-100 shadow-xl text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
        <XCircle className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Payment Failed
        </h1>
        <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
          We could not complete your transaction with SSLCommerz. No charge was processed and no Premium subscription was activated.
        </p>
        {reason && (
          <p className="text-[11px] font-mono text-red-600 bg-red-50 p-2 rounded-xl max-w-xs mx-auto">
            Reason: {reason}
          </p>
        )}
      </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/checkout" className="w-full sm:w-auto">
              <Button
                variant="wine"
                size="md"
                className="w-full justify-center"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Try Again
              </Button>
            </Link>
            <Link href="/membership" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full justify-center"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Membership
              </Button>
            </Link>
          </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-rose-50/30">
      <Container size="sm">
        <Suspense fallback={<div className="text-center text-xs font-bold text-stone-500 py-10">Loading...</div>}>
          <PaymentFailContent />
        </Suspense>
      </Container>
    </div>
  );
}
