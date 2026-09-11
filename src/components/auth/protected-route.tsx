'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'FREE' | 'PREMIUM';
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { userRole, isLoggedIn } = useAuth();

  useEffect(() => {
    if (userRole === 'GUEST' || !isLoggedIn) {
      router.push('/login');
    } else if (userRole === 'FREE') {
      router.push('/membership?reason=subscription_required');
    }
  }, [userRole, isLoggedIn, router]);

  if (userRole === 'GUEST' || userRole === 'FREE' || !isLoggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-rose-600 border-t-transparent animate-spin mb-4" />
        <p className="text-xs text-stone-500 font-medium">Checking subscription pass status...</p>
      </div>
    );
  }

  return <>{children}</>;
}

