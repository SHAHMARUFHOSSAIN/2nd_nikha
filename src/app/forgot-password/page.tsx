'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BRAND_NAME } from '@/lib/constants';
import { KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-rose-50/30">
      <Container size="sm">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>

          {!submitted ? (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-serif font-bold text-stone-900">
                  Forgot Password?
                </h1>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Enter your registered email address or phone number. We will send you a password reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
                <Input
                  label="Registered Email or Phone"
                  placeholder="e.g. anika@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="wine"
                  size="md"
                  className="w-full justify-center"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-semibold">
                Reset link sent! Please check your inbox or SMS.
              </div>
              <Link href="/reset-password">
                <Button variant="wine" size="md" className="w-full justify-center">
                  Proceed to Reset Password
                </Button>
              </Link>
            </div>
          )}

          <div className="pt-4 border-t border-stone-100">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
