'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AdminPermission } from '@/types/admin';
import { Shield, ShieldAlert, LogIn, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminGuardProps {
  requiredPermission?: AdminPermission;
  children: React.ReactNode;
}

export function AdminGuard({ requiredPermission, children }: AdminGuardProps) {
  const { userRole, setRole, isLoggedIn } = useAuth();

  // If user is not logged in or not ADMIN
  if (!isLoggedIn || userRole !== 'ADMIN') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-gradient-to-br from-stone-950 via-stone-900 to-slate-950 text-stone-100">
        <div className="max-w-md w-full bg-stone-900/95 backdrop-blur-2xl border border-stone-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 text-red-400 border border-red-800/80 flex items-center justify-center mx-auto shadow-xl">
            <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-extrabold text-white">
              Administrator Authentication Required
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed font-serif">
              You must sign in with valid Administrator Email & Password credentials to access the 2ndNikah System Admin Portal.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/admin/login" className="block">
              <Button
                variant="wine"
                size="lg"
                className="w-full justify-center bg-gradient-to-r from-purple-800 to-rose-900 hover:from-purple-700 hover:to-rose-800 text-white font-bold py-3.5 shadow-xl border border-purple-600/40"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
