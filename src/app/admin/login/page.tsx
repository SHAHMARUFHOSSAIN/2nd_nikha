'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { BrandLogo } from '@/components/ui/brand-logo';
import { ShieldCheck, Lock, Mail, ArrowRight, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [email, setEmail] = useState('admin@2ndchance.com');
  const [password, setPassword] = useState('admin123');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRole('ADMIN');
    router.push('/admin');
  };

  const handleDemoQuickLogin = () => {
    setRole('ADMIN');
    router.push('/admin');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-stone-100">
      <Container size="xs">
        <div className="bg-stone-900/90 rounded-3xl p-8 border border-stone-800 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-950/80 text-purple-400 border border-purple-800 flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="scale-95 inline-block">
              <BrandLogo size="md" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white pt-2">
              Admin Portal Authentication
            </h2>
            <p className="text-xs text-stone-400">
              Authorized system administrator access only.
            </p>
          </div>

          <form onSubmit={handleAdminSubmit} className="space-y-4 text-left">
            <Input
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-stone-400" />}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4 text-stone-400" />}
            />

            <Button
              type="submit"
              variant="wine"
              size="lg"
              className="w-full justify-center shadow-lg bg-gradient-to-r from-purple-800 to-rose-900 hover:from-purple-700 hover:to-rose-800 text-white"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Login to Admin Dashboard
            </Button>
          </form>

          <div className="pt-2 border-t border-stone-800">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDemoQuickLogin}
              className="w-full justify-center border-stone-700 text-stone-300 hover:bg-stone-800"
            >
              ⚡ Instant 1-Click Demo Admin Login
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
