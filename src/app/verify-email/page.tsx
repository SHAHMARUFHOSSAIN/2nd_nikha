'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { BRAND_NAME } from '@/lib/constants';
import { ShieldCheck, CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'idle'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('idle');
      return;
    }
    let cancelled = false;
    (async () => {
      setStatus('loading');
      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
          credentials: 'include',
        });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (res.ok && data?.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(data?.error || 'This link is invalid or expired.');
        }
      } catch {
        if (cancelled) return;
        setStatus('error');
        setErrorMsg('Could not reach the verification service. Please try again.');
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setResendMsg('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setResendMsg(data?.alreadyVerified
          ? 'Your email is already verified.'
          : 'A new verification email is on its way. The previous link has been invalidated.');
      } else {
        setResendMsg(data?.error || 'Could not resend. Please try again later.');
      }
    } catch {
      setResendMsg('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-rose-50/30">
      <Container size="sm">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-xl space-y-6 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner ${
            status === 'success' ? 'bg-emerald-100 text-emerald-600' : status === 'error' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'
          }`}>
            {status === 'success' ? <CheckCircle2 className="w-7 h-7" /> : status === 'error' ? <XCircle className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">Email Verification</h1>
          </div>

          {status === 'loading' && (
            <p className="text-xs text-stone-600">Verifying your email address...</p>
          )}

          {status === 'success' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-sm font-semibold">
                ✓ Email Verified Successfully!
              </div>
              <p className="text-xs text-stone-600">
                Your email address is now verified and your {BRAND_NAME} account is fully active.
              </p>
              <Link href="/member">
                <Button variant="wine" size="md" className="w-full justify-center" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-sm font-semibold">
                ✕ Verification Failed
              </div>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">{errorMsg}</p>
              <Button
                variant="wine"
                size="md"
                className="w-full justify-center"
                onClick={handleResend}
                disabled={resending}
                rightIcon={<RefreshCcw className="w-4 h-4" />}
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </Button>
              {resendMsg && <p className="text-[11px] text-stone-500">{resendMsg}</p>}
              <p className="text-xs text-stone-500 pt-1">
                Need help?{' '}
                <Link href="/contact" className="font-bold text-rose-700 hover:underline">Contact Support</Link>
              </p>
            </div>
          )}

          {status === 'idle' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Please open the verification link sent to your email, or request a new one below.
              </p>
              <Button variant="wine" size="md" className="w-full justify-center" onClick={handleResend} disabled={resending}>
                {resending ? 'Sending...' : 'Send Verification Email'}
              </Button>
              {resendMsg && <p className="text-[11px] text-stone-500">{resendMsg}</p>}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-stone-500">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}