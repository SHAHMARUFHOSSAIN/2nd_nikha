'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConnection } from '@/lib/connection-context';
import { mockGatewayInstance } from '@/lib/payment/mock-payment-gateway';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import { MOCK_PROFILES } from '@/data/mock-data';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Heart,
  AlertTriangle,
  RefreshCw,
  Lock,
} from 'lucide-react';

interface MockCheckoutPageProps {
  params: {
    transactionId: string;
  };
}

export default function MockCheckoutPage({ params }: MockCheckoutPageProps) {
  const router = useRouter();
  const { activateInterestAfterPayment } = useConnection();
  const transaction = mockGatewayInstance.getTransaction(params.transactionId);

  const recipientProfile =
    MOCK_PROFILES.find((p) => p.id === transaction?.recipientId) || MOCK_PROFILES[1];

  const [paymentStatusState, setPaymentStatusState] = useState<
    'INITIAL' | 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED'
  >('INITIAL');

  // Handle Action 1: Pay & Send Interest (SUCCESS)
  const handlePaySuccess = () => {
    mockGatewayInstance.updateTransactionStatus(params.transactionId, 'SUCCESS');
    activateInterestAfterPayment(params.transactionId, recipientProfile.id);
    setPaymentStatusState('SUCCESS');
    setTimeout(() => {
      router.push(`/payment/success?txn=${params.transactionId}&amount=${MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT}`);
    }, 1200);
  };

  // Handle Action 2: Simulate Failure
  const handleSimulateFailure = () => {
    mockGatewayInstance.updateTransactionStatus(params.transactionId, 'FAILED');
    setPaymentStatusState('FAILED');
  };

  // Handle Action 3: Cancel Payment
  const handleCancelPayment = () => {
    mockGatewayInstance.updateTransactionStatus(params.transactionId, 'CANCELLED');
    setPaymentStatusState('CANCELLED');
  };

  // Handle Action 4: Simulate Pending
  const handleSimulatePending = () => {
    mockGatewayInstance.updateTransactionStatus(params.transactionId, 'PENDING');
    setPaymentStatusState('PENDING');
  };

  return (
    <div className="min-h-[85vh] py-10 bg-stone-50/50">
      <Container size="sm">
        <div className="space-y-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Profile</span>
          </button>

          {/* Test Payment Prominent Notice */}
          <div className="bg-amber-500/10 border-2 border-amber-400 p-3.5 rounded-2xl text-center space-y-1 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>TEST PAYMENT — NO REAL MONEY WILL BE CHARGED</span>
            </div>
            <p className="text-[11px] text-amber-800">
              This is a functional Mock Payment Gateway for testing the Express Interest activation flow.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-xl space-y-6">
            <div className="text-center space-y-2 border-b border-rose-100 pb-5">
              <Badge variant="wine">Mock Payment Gateway</Badge>
              <h1 className="text-2xl font-serif font-bold text-stone-900">
                Send Express Interest Checkout
              </h1>
              <p className="text-xs text-stone-500 font-mono">
                Txn ID: {params.transactionId}
              </p>
            </div>

            {/* Recipient Profile Thumbnail & Details */}
            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-sm shrink-0 bg-white">
                <Image
                  src={recipientProfile.photoUrl}
                  alt={recipientProfile.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">
                  Express Interest Recipient
                </span>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  {recipientProfile.fullName}, {recipientProfile.age}
                </h3>
                <p className="text-xs text-stone-600">
                  {recipientProfile.profession} • {recipientProfile.location}
                </p>
              </div>
            </div>

            {/* Itemized Payment Summary */}
            <div className="space-y-2 text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-medium">Purpose:</span>
                <span className="font-bold text-stone-900">Express Interest Activation</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="font-medium">Amount:</span>
                <span className="font-bold text-rose-800">
                  {formatCurrency(MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT, 'BDT')}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-stone-900">
                <span>Total Payable:</span>
                <span className="text-rose-700">
                  {formatCurrency(MEMBERSHIP_CONFIG.PREMIUM_MONTHLY_BDT, 'BDT')}
                </span>
              </div>
            </div>

            {/* Status Notices based on State Machine */}
            {paymentStatusState === 'FAILED' && (
              <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-red-800">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Payment Failed — Interest Not Activated</span>
                </div>
                <p className="text-[11px] text-red-700">
                  Your payment could not be processed. You can try paying again below.
                </p>
              </div>
            )}

            {paymentStatusState === 'CANCELLED' && (
              <div className="p-4 bg-stone-100 text-stone-800 border border-stone-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <XCircle className="w-4 h-4 text-stone-500" />
                  <span>Payment Cancelled</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Transaction was cancelled. No money was charged and interest remains inactive.
                </p>
              </div>
            )}

            {paymentStatusState === 'PENDING' && (
              <div className="p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Payment Pending Verification</span>
                </div>
                <p className="text-[11px] text-amber-700">
                  Your payment is currently being processed. Please check your payment status later.
                </p>
              </div>
            )}

            {/* 4 Test Payment Actions */}
            <div className="space-y-3 pt-2">
              <Button
                variant="wine"
                size="lg"
                onClick={handlePaySuccess}
                className="w-full justify-center shadow-lg shadow-rose-900/20"
                leftIcon={<Heart className="w-4 h-4 fill-white text-white" />}
              >
                Pay & Send Interest ❤️
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSimulateFailure}
                  className="w-full justify-center text-red-700 border-red-200 hover:bg-red-50 text-[11px]"
                >
                  Simulate Failure
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSimulatePending}
                  className="w-full justify-center text-amber-800 border-amber-200 hover:bg-amber-50 text-[11px]"
                >
                  Simulate Pending
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelPayment}
                  className="w-full justify-center text-stone-600 border-stone-200 hover:bg-stone-100 text-[11px]"
                >
                  Cancel Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
