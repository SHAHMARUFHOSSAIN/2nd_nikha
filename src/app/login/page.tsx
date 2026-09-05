'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { Heart, LogIn, ShieldAlert, CheckCircle2, ArrowRight, Crown } from 'lucide-react';

import { MOCK_PROFILES } from '@/data/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [emailOrPhone, setEmailOrPhone] = useState('anika.rahman@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState(null);

    if (!emailOrPhone) {
      setErrorState('Please enter your email or registered phone number.');
      return;
    }
    if (!password) {
      setErrorState('Please enter your account password.');
      return;
    }

    if (password === 'blocked') {
      setErrorState('This account has been suspended or blocked due to policy review.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const foundProfile = MOCK_PROFILES.find(
        (p) => p.email?.toLowerCase() === emailOrPhone.toLowerCase() || p.fullName.toLowerCase().includes(emailOrPhone.toLowerCase())
      ) || MOCK_PROFILES[0];

      login(foundProfile, 'PREMIUM');
      router.push('/member');
    }, 400);
  };

  const handleQuickDemoLogin = (role: 'PREMIUM' | 'FREE') => {
    const selectedProfile = role === 'PREMIUM' ? MOCK_PROFILES[0] : MOCK_PROFILES[1];
    login(selectedProfile, role);
    router.push('/member');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 bg-gradient-to-b from-rose-50/50 via-white to-pink-50/40">
      <Container size="sm">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100/90 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-brand-wine flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-serif font-bold text-2xl text-stone-900">
                {BRAND_NAME}
              </span>
            </Link>
            <h1 className="text-2xl font-serif font-bold text-stone-900 tracking-tight pt-2">
              Welcome Back
            </h1>
            <p className="text-xs text-stone-500">
              Sign in to manage your matches, preferences, and interests.
            </p>
          </div>

          {/* Validation Notice */}
          {errorState && (
            <div className="p-3.5 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs flex items-start gap-2.5 font-medium animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorState}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email or Phone Number"
              placeholder="e.g. anika@example.com or 01712345678"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-rose-600 focus:ring-rose-500"
                />
                <span>Remember me</span>
              </label>

              <Link href="/forgot-password" className="text-rose-700 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="wine"
              size="lg"
              className="w-full justify-center shadow-lg shadow-rose-900/20"
              disabled={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Member Portal'}
            </Button>
          </form>

          {/* Quick Demo Login Helpers */}
          <div className="pt-3 border-t border-stone-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 block text-center tracking-wider">
              ⚡ Quick Demo 1-Click Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin('PREMIUM')}
                className="w-full justify-center text-xs border-amber-200 bg-amber-50/50 text-amber-900 hover:bg-amber-100"
                leftIcon={<Crown className="w-3.5 h-3.5 text-amber-600" />}
              >
                Login (Premium)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin('FREE')}
                className="w-full justify-center text-xs border-stone-200 text-stone-700 hover:bg-stone-50"
              >
                Login (Free Member)
              </Button>
            </div>
          </div>

          {/* Register Link Footer */}
          <div className="text-center pt-2 text-xs text-stone-600">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-bold text-rose-700 hover:underline">
              Register Free Profile
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
}
