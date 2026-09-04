'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { Shield, Crown, UserCheck } from 'lucide-react';

export function DemoAuthStateSwitcher() {
  const pathname = usePathname();
  const { userRole, setRole } = useAuth();

  // Hide floating switcher inside Admin Portal so it never blocks sidebar links
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const roles: { role: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { role: 'GUEST', label: 'Guest', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'hover:bg-stone-100 text-stone-700' },
    { role: 'FREE', label: 'Free Member', icon: <UserCheck className="w-3.5 h-3.5 text-rose-500" />, color: 'hover:bg-rose-50 text-rose-800' },
    { role: 'PREMIUM', label: 'Premium Member', icon: <Crown className="w-3.5 h-3.5 text-amber-500" />, color: 'hover:bg-amber-50 text-amber-900' },
    { role: 'ADMIN', label: 'Admin Portal', icon: <Shield className="w-3.5 h-3.5 text-purple-600" />, color: 'hover:bg-purple-50 text-purple-900' },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-stone-900/95 backdrop-blur text-white p-3 rounded-2xl shadow-2xl border border-stone-700 flex flex-col gap-2 max-w-xs select-none">
      <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
          <Shield className="w-3 h-3 text-rose-400" /> Demo Role Switcher
        </span>
        <span className="text-[9px] text-stone-400 font-mono">Active: {userRole}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {roles.map((r) => {
          const isActive = userRole === r.role;
          return (
            <button
              key={r.role}
              onClick={() => setRole(r.role)}
              className={`p-2 rounded-xl text-left font-medium transition-all flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:text-white'
              }`}
            >
              {r.icon}
              <span className="truncate">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
