'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Heart,
  Star,
  Eye,
  MessageSquare,
  Crown,
  Bell,
  Settings,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function MemberSidebar() {
  const pathname = usePathname();
  const { userRole, currentUser: authUser } = useAuth();
  const currentUser = authUser || { fullName: 'Member' };
  const initials = currentUser.fullName
    ? currentUser.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'MB';

  const links = [
    { label: 'Dashboard', href: '/member', icon: LayoutDashboard },
    { label: 'My Profile', href: '/member/profile', icon: User },
    { label: 'Discover Matches', href: '/search', icon: Search },
    { label: 'Shortlist', href: '/member/shortlist', icon: Star },
    { label: 'Notifications', href: '/member/notifications', icon: Bell, badge: '3' },
    { label: 'Settings', href: '/member/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-rose-100/90 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 hidden lg:flex">
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-200 text-rose-800 font-serif font-bold flex items-center justify-center border border-rose-300 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
              {currentUser.fullName}
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
              {userRole === 'PREMIUM' ? '👑 Premium Member' : '🌸 Free Member'}
            </span>
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-md shadow-pink-200/50'
                    : 'text-stone-700 hover:bg-rose-50 hover:text-rose-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-stone-400')} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-white text-rose-700'
                        : 'bg-rose-100 text-rose-800'
                    )}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Upgrade Box if Free Member */}
      {userRole !== 'PREMIUM' && (
        <div className="bg-gradient-to-br from-brand-wineDark via-brand-wine to-brand-magenta text-white p-4 rounded-2xl shadow-md space-y-2 text-xs">
          <p className="font-bold text-white flex items-center gap-1">
            <Crown className="w-4 h-4 text-amber-300" />
            Upgrade to Premium
          </p>
          <p className="text-rose-200 leading-relaxed">
            Send unlimited interests, chat with matches, and share contacts.
          </p>
          <Link href="#membership" className="block pt-1">
            <button className="w-full bg-white text-brand-wine font-bold py-1.5 rounded-xl hover:bg-rose-50 transition-colors text-center text-xs">
              Upgrade Now
            </button>
          </Link>
        </div>
      )}
    </aside>
  );
}
