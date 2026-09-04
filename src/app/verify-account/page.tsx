'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BRAND_NAME } from '@/lib/constants';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VerifyAccountPage() {
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerified(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-rose-50/30">
      <Container size="sm">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>

          {!isVerified ? (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-serif font-bold text-stone-900">
                  Verify Your Account
                </h1>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  We sent a 6-digit verification code to your registered mobile number / email address.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-4 max-w-xs mx-auto">
                <Input
                  placeholder="Enter 6-digit code (e.g. 123456)"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="text-center font-mono text-lg tracking-widest"
                />

                <Button
                  type="submit"
                  variant="wine"
                  size="md"
                  className="w-full justify-center"
                >
                  Verify Code
                </Button>
              </form>

              <p className="text-xs text-stone-500 pt-2">
                Didn't receive code?{' '}
                <button
                  onClick={() => alert('Verification code resent!')}
                  className="font-bold text-rose-700 hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-sm font-semibold">
                ✓ Account Verified Successfully!
              </div>
              <p className="text-xs text-stone-600">
                Your profile is now active and ready for matching.
              </p>
              <Link href="/member">
                <Button
                  variant="wine"
                  size="md"
                  className="w-full justify-center"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
