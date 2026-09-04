'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, Sparkles, MessageSquare, User } from 'lucide-react';
import { useCommunication } from '@/lib/communication-context';
import { useAuth } from '@/lib/auth-context';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const communication = useCommunication();

  const totalUnread = (communication?.conversations || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Hide mobile bottom nav inside Admin Portal
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navTabs = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Home,
      isCenter: false,
    },
    {
      id: 'matches',
      label: 'Matches',
      href: isLoggedIn ? '/member/interests' : '/search',
      icon: Heart,
      isCenter: false,
    },
    {
      id: 'ai-match',
      label: 'AI Match',
      href: '/search',
      icon: Sparkles,
      isCenter: true,
    },
    {
      id: 'messages',
      label: 'Messages',
      href: isLoggedIn ? '/member/messages' : '/login',
      icon: MessageSquare,
      badge: totalUnread > 0 ? totalUnread : undefined,
      isCenter: false,
    },
    {
      id: 'profile',
      label: 'Profile',
      href: isLoggedIn ? '/member/profile' : '/login',
      icon: User,
      isCenter: false,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-pink-100 shadow-[0_-4px_20px_rgba(236,72,153,0.12)] px-3 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {navTabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.id === 'ai-match' && pathname === '/search');
          const Icon = tab.icon;

          if (tab.isCenter) {
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="flex flex-col items-center justify-center relative -top-4 group"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 text-white flex items-center justify-center shadow-lg shadow-pink-500/40 border-4 border-white group-hover:scale-105 transition-all">
                  <Icon className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-bold text-pink-600 mt-0.5 tracking-tight">
                  {tab.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-all relative ${
                isActive ? 'text-pink-600 font-bold' : 'text-stone-400 hover:text-stone-700 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-pink-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
