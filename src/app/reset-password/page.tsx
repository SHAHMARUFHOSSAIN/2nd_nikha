'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 bg-rose-50/30">
      <Container size="sm">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          {!success ? (
            <>
              <div className="space-y-2">
                <h1 className="text-2xl font-serif font-bold text-stone-900">
                  Set New Password
                </h1>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Create a strong password to protect your account.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-4 max-w-sm mx-auto text-left">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="wine"
                  size="md"
                  className="w-full justify-center"
                >
                  Update Password
                </Button>
              </form>
            </>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-semibold">
                ✓ Password reset successfully!
              </div>
              <Link href="/login">
                <Button variant="wine" size="md" className="w-full justify-center">
                  Login With New Password
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
