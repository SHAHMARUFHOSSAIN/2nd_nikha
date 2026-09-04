import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function PaymentFailPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-rose-50/30">
      <Container size="sm">
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
      </Container>
    </div>
  );
}
