'use client';

import React from 'react';
import { MemberLayout } from '@/components/member/member-layout';
import { Heart, Sparkles, Eye, ShieldCheck, Crown, Bell } from 'lucide-react';
import Link from 'next/link';

export default function MemberNotificationsPage() {
  const notifications = [
    {
      id: 'n-1',
      title: 'Tanvir Ahmed expressed interest in your profile',
      type: 'New Interest',
      date: '2 hours ago',
      icon: <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />,
      link: '/member#interests',
    },
    {
      id: 'n-2',
      title: 'Mahmudul Hasan viewed your profile details',
      type: 'Profile Viewed',
      date: '1 day ago',
      icon: <Eye className="w-5 h-5 text-emerald-600" />,
      link: '/member#visitors',
    },
    {
      id: 'n-3',
      title: '3 new compatible matches added in Dhaka',
      type: 'New Match',
      date: '2 days ago',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      link: '/search',
    },
    {
      id: 'n-4',
      title: 'Identity Verification Badge awarded (NID Verified)',
      type: 'System',
      date: '3 days ago',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      link: '/member/profile',
    },
  ];

  return (
    <MemberLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Bell className="w-7 h-7 text-rose-500" />
              <span>Activity Alerts & Notifications</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Stay updated on profile interests, compatibility matches, and system alerts.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <Link
              key={n.id}
              href={n.link}
              className="block bg-white p-4 rounded-2xl border border-rose-100/90 shadow-sm hover:border-rose-300 transition-all group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 group-hover:scale-105 transition-transform">
                    {n.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-sm group-hover:text-rose-700 transition-colors">
                      {n.title}
                    </h4>
                    <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {n.type}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-stone-400 font-medium shrink-0">
                  {n.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MemberLayout>
  );
}
