import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Ban, ArrowLeft, RefreshCw } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-rose-50/30">
      <Container size="sm">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto shadow-inner">
            <Ban className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Payment Cancelled
            </h1>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              You cancelled the SSLCommerz payment session. No payment was completed.
            </p>
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
                Return to Membership
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
