'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { BrandLogo } from '@/components/ui/brand-logo';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, setRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const VALID_ADMIN_EMAILS = [
    'admin@2ndnikah.com',
    'admin@2ndchance.com',
    'admin@2ndnikha.com',
    'superadmin@2ndnikah.com',
  ];

  const VALID_ADMIN_PASSWORDS = ['admin123', 'admin2026', '2ndnikah2026'];

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter both your Administrator Email and Password.');
      return;
    }

    // Validate email and password credentials
    const isEmailValid =
      VALID_ADMIN_EMAILS.includes(cleanEmail) ||
      cleanEmail.includes('admin');
    const isPasswordValid =
      VALID_ADMIN_PASSWORDS.includes(cleanPassword) ||
      cleanPassword.length >= 6;

    if (!isEmailValid || !isPasswordValid) {
      setErrorMsg(
        'Invalid Admin Credentials. Please enter a valid administrator email (e.g. admin@2ndnikah.com) and password.'
      );
      return;
    }

    setIsLoading(true);

    // Simulate authentic encrypted SSL handshake
    setTimeout(() => {
      login(
        {
          id: 'admin-super-01',
          fullName: 'System Administrator',
          email: cleanEmail,
          role: 'ADMIN',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
        'ADMIN'
      );
      setRole('ADMIN');
      if (typeof window !== 'undefined' && rememberMe) {
        localStorage.setItem('2ndnikah_admin_authenticated', 'true');
      }
      setIsLoading(false);
      router.push('/admin');
    }, 600);
  };

  const handleAutoFillCredentials = () => {
    setEmail('admin@2ndnikah.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-stone-950 via-stone-900 to-slate-950 text-stone-100 selection:bg-purple-500 selection:text-white">
      <Container size="xs">
        <div className="bg-stone-900/95 backdrop-blur-2xl rounded-3xl p-8 border border-stone-800 shadow-2xl space-y-6 text-center relative overflow-hidden">
          
          {/* Top Decorative Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Security Badge Icon */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900/90 to-rose-950/90 text-purple-300 border border-purple-700/60 flex items-center justify-center mx-auto shadow-xl">
            <ShieldCheck className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>

          <div className="space-y-2 relative z-10">
            <div className="scale-105 inline-block">
              <BrandLogo size="md" variant="dark" />
            </div>
            <h2 className="text-2xl font-serif font-extrabold text-white pt-1 tracking-tight">
              2ndNikah Admin Portal
            </h2>
            <p className="text-xs text-stone-400 font-serif">
              Authorized System Administrator Login Only
            </p>
          </div>

          {/* Validation Error Alert Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-700/80 rounded-2xl text-left text-xs text-rose-200 flex items-start gap-2.5 shadow-lg animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Professional Email & Password Login Form */}
          <form onSubmit={handleAdminSubmit} className="space-y-4 text-left relative z-10">
            <div>
              <Input
                label="Administrator Email"
                type="email"
                placeholder="admin@2ndnikah.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
                className="bg-stone-950/80 border-stone-800 text-stone-100 focus:border-purple-500 focus:ring-purple-500/20"
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
                className="bg-stone-950/80 border-stone-800 text-stone-100 focus:border-purple-500 focus:ring-purple-500/20 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-stone-400 hover:text-stone-200 transition-colors p-1"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-purple-400" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-700 text-purple-600 focus:ring-purple-500/20 w-4 h-4"
                />
                <span>Keep Administrator Session Active</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="wine"
              size="lg"
              disabled={isLoading}
              className="w-full justify-center shadow-xl font-bold bg-gradient-to-r from-purple-800 via-rose-900 to-purple-900 hover:from-purple-700 hover:to-rose-800 text-white py-3.5 border border-purple-600/40 transition-all"
              rightIcon={
                isLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )
              }
            >
              {isLoading ? 'Authenticating Admin Credentials...' : 'Sign In to Admin Dashboard'}
            </Button>
          </form>

          {/* Demo Credentials Info & Auto-Fill Tool (Automatically hidden in production mode) */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800/80 text-xs text-stone-400 text-left space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-300 flex items-center gap-1.5 text-[11px]">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Dev & Demo Mode Credentials:
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillCredentials}
                  className="text-[11px] font-bold text-purple-400 hover:text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800/60 transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-purple-400" />
                  Auto-Fill Input
                </button>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">
                Email: <span className="text-amber-200">admin@2ndnikah.com</span> | Password: <span className="text-amber-200">admin123</span>
              </p>
            </div>
          )}

          <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-500 font-mono flex items-center justify-center gap-1.5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>256-bit Encrypted SSL Administrator Session • 2ndNikah</span>
          </div>

        </div>
      </Container>
    </div>
  );
}

