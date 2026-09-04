'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { MemberSidebar } from './member-sidebar';
import { MobileBottomNav } from './mobile-bottom-nav';

export function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex bg-stone-50/40 min-h-[calc(100vh-4rem)]">
        <MemberSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-y-auto">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </ProtectedRoute>
  );
}
