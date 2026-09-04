import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export default function PaymentPendingPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-amber-50/30">
      <Container size="sm">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-amber-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              Payment Verification Pending
            </h1>
            <p className="text-xs text-stone-600 max-w-xs mx-auto leading-relaxed">
              Your payment is being verified by SSLCommerz and your bank. Please check your subscription status shortly.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/member/subscription">
              <Button
                variant="wine"
                size="md"
                className="w-full justify-center"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Check Subscription Status
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
