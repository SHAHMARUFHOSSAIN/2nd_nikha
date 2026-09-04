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
      <div className="min-h-[80vh] flex items-center justify-center p-6 bg-stone-950 text-stone-100">
        <div className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-950/80 text-red-400 border border-red-800 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-white">
              Admin Authorization Required
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed">
              You must be logged in as an authorized System Administrator to access this section of the 2nd Chance Admin Portal.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              variant="wine"
              size="lg"
              onClick={() => setRole('ADMIN')}
              className="w-full justify-center bg-gradient-to-r from-purple-800 to-rose-900 hover:from-purple-700 hover:to-rose-800 text-white font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              ⚡ Switch to Super Admin Mode
            </Button>

            <Link href="/admin/login" className="block">
              <Button variant="outline" size="sm" className="w-full justify-center border-stone-700 text-stone-300 hover:bg-stone-800">
                Go to Admin Login Page
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
