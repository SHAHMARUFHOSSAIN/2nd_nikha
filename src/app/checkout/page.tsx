'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SSLCommerzHandoffModal } from '@/components/payment/sslcommerz-handoff-modal';
import { PaymentService } from '@/lib/payment/payment-service';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdmin } from '@/lib/admin-context';
import { useCurrency } from '@/lib/currency-context';
import { CurrencySwitcher } from '@/components/ui/currency-switcher';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHandoffOpen, setIsHandoffOpen] = useState(false);
  const { membershipPlans } = useAdmin();
  const { selectedCountry, currency, formatAmount, getNumericAmount } = useCurrency();

  // Read URL query params or default to monthly plan
  const planIdParam = searchParams.get('plan') || 'monthly';
  
  // Match plan from live Admin Context state
  const targetPlan = membershipPlans?.find((p) => p.id === planIdParam || p.billingPeriod?.toLowerCase().includes(planIdParam.toLowerCase())) 
    || membershipPlans?.[0];

  const planName = targetPlan ? targetPlan.name : (planIdParam === 'weekly' ? 'Weekly Pass' : 'Monthly Pass');
  const bdtPrice = targetPlan ? targetPlan.price : (planIdParam === 'weekly' ? 99 : 299);
  const usdPrice = planIdParam === 'weekly' ? 0.99 : 2.99;

  const currentPriceFormatted = formatAmount(bdtPrice, usdPrice);
  const numericAmountToCharge = getNumericAmount(bdtPrice, usdPrice);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: 'Anika Rahman',
    email: 'anika.rahman@example.com',
    phone: '01712345678',
  });

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsHandoffOpen(true);

    const session = await PaymentService.initiatePayment({
      userId: 'p-101',
      planId: planIdParam,
      purpose: 'subscription',
      amount: numericAmountToCharge,
      currency: currency,
      customerName: customerInfo.fullName,
      customerEmail: customerInfo.email,
      customerPhone: customerInfo.phone,
    });

    setTimeout(() => {
      setIsHandoffOpen(false);
      router.push(session.redirectUrl);
    }, 1000);
  };

  return (
    <Container size="md">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/membership"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Membership Plans</span>
          </Link>

          <CurrencySwitcher variant="navbar" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Info Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-5">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Checkout Billing Details
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter your details for secure subscription activation ({planName}).
              </p>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={customerInfo.fullName}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                }
              />
              <Input
                label="Email Address"
                type="email"
                value={customerInfo.email}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, email: e.target.value })
                }
              />
              <Input
                label="Phone Number"
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
              />

              <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 text-xs text-stone-600 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-pink-900">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>SSLCommerz Gateway ({selectedCountry.flag} {currency})</span>
                  </span>
                  <span className="font-mono text-xs">{currentPriceFormatted}</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {currency === 'BDT'
                    ? 'Supports bKash, Nagad, Rocket, Upay, Visa, Mastercard, AMEX and Bangladeshi Bank Internet Banking.'
                    : 'Supports International Visa, Mastercard, AMEX cards. Funds settle directly to your Bangladeshi Bank Account via SSLCommerz.'}
                </p>
              </div>

              <Button
                type="submit"
                variant="wine"
                size="lg"
                className="w-full justify-center shadow-lg shadow-pink-900/20"
                rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
              >
                Pay {currentPriceFormatted} via SSLCommerz
              </Button>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-semibold text-stone-900">
                <span>{planName} ({selectedCountry.flag} {currency})</span>
                <span className="font-mono font-bold">{currentPriceFormatted}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Unlocks unlimited Express Interests, Mutual Match chatting, Photo Sharing, and Direct Contact details.
              </p>

              <div className="pt-3 border-t border-stone-100 space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono">{currentPriceFormatted}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>SSL Gateway Fee</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Due</span>
                  <span className="text-pink-700 font-extrabold text-base font-mono">
                    {currentPriceFormatted}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
                <p className="font-bold text-stone-700">🏦 Settlement Notice:</p>
                <p>All BDT & USD payments are securely processed by SSLCommerz and deposited to your Bangladeshi Bank Account.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SSLCommerzHandoffModal
        isOpen={isHandoffOpen}
        onClose={() => setIsHandoffOpen(false)}
      />
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-[85vh] py-12 bg-stone-50/50">
      <Suspense fallback={
        <div className="text-center py-20 font-bold text-stone-500">Loading checkout...</div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
