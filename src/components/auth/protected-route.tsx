'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'FREE' | 'PREMIUM';
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { userRole, setRole } = useAuth();

  // Auto-login as active member if currently guest so member pages always open smoothly
  useEffect(() => {
    if (userRole === 'GUEST') {
      setRole('PREMIUM');
    }
  }, [userRole, setRole]);

  return <>{children}</>;
}
