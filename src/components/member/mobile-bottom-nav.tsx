'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Search, Star, Bell, User, Settings } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { label: 'Discover', href: '/search', icon: Search },
    { label: 'Shortlist', href: '/member/shortlist', icon: Star },
    { label: 'Alerts', href: '/member/notifications', icon: Bell },
    { label: 'Profile', href: '/member/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 py-2 px-3 flex items-center justify-around lg:hidden shadow-lg">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-[11px] font-medium transition-colors',
              isActive
                ? 'text-rose-600 font-bold'
                : 'text-stone-500 hover:text-stone-900'
            )}
          >
            <Icon className={cn('w-5 h-5', isActive ? 'text-rose-600' : 'text-stone-400')} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
