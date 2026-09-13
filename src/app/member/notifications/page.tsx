'use client';

import React, { useState, useEffect } from 'react';
import { MemberLayout } from '@/components/member/member-layout';
import { Heart, Sparkles, Eye, ShieldCheck, Crown, Bell, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCommunication } from '@/lib/communication-context';
import { useAdmin } from '@/lib/admin-context';
import { MOCK_PROFILES } from '@/data/mock-data';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

interface DynamicNotificationItem {
  id: string;
  title: string;
  type: string;
  date: string;
  icon: React.ReactNode;
  link: string;
  isRead?: boolean;
}

export default function MemberNotificationsPage() {
  const { currentUser } = useAuth();
  const communication = useCommunication();
  const [notificationsList, setNotificationsList] = useState<DynamicNotificationItem[]>([]);
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Build real live notifications list
    const realNotifications: DynamicNotificationItem[] = [];

    // 1. Dynamic Profile Views / Visitors from localStorage
    try {
      const storedVisitors = localStorage.getItem('2ndchance_profile_visitors');
      if (storedVisitors) {
        const parsed = JSON.parse(storedVisitors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.slice(0, 5).forEach((item: any, idx: number) => {
            const visitorName = item.visitorName || 'A member candidate';
            realNotifications.push({
              id: item.id || `notif-v-${idx}`,
              title: `${visitorName} viewed your profile details`,
              type: 'Profile Viewed',
              date: item.visitedTimeAgo || 'Recently',
              icon: <Eye className="w-5 h-5 text-emerald-600" />,
              link: '/member/visitors',
            });
          });
        }
      }
    } catch (e) {}

    // 2. Dynamic Direct Messages / Active Conversations
    if (communication?.conversations && communication.conversations.length > 0) {
      communication.conversations.slice(0, 4).forEach((conv: any, idx: number) => {
        const partnerName = conv.partnerName || 'Member';
        realNotifications.push({
          id: `notif-msg-${conv.id || idx}`,
          title: `Active message conversation with ${partnerName}`,
          type: 'Direct Message',
          date: conv.lastMessageTimeAgo || 'Active',
          icon: <MessageSquare className="w-5 h-5 text-pink-600" />,
          link: `/member/messages?matchId=${conv.matchId || conv.partnerId}`,
        });
      });
    }

    // 3. Dynamic NID Verification Status Notification
    if (currentUser?.isNidVerified || currentUser?.isVerified) {
      realNotifications.push({
        id: 'notif-nid-badge',
        title: 'Identity Verification Badge awarded (NID Verified)',
        type: 'System Badge',
        date: 'Verified',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        link: '/member/profile',
      });
    }

    // 4. Dynamic Subscription Pass Active Notification
    realNotifications.push({
      id: 'notif-sub-pass',
      title: 'Active Matrimonial Subscription Pass & Premium Benefits',
      type: 'Subscription',
      date: 'Active',
      icon: <Crown className="w-5 h-5 text-amber-500" />,
      link: '/member',
    });

    // 5. Custom notifications stored in localStorage
    try {
      const storedCustom = localStorage.getItem('2ndchance_user_notifications');
      if (storedCustom) {
        const parsed = JSON.parse(storedCustom);
        if (Array.isArray(parsed)) {
          parsed.forEach((customNotif: any, idx: number) => {
            realNotifications.unshift({
              id: customNotif.id || `custom-n-${idx}`,
              title: customNotif.title || 'System Notification',
              type: customNotif.type || 'Alert',
              date: customNotif.date || 'Just now',
              icon: <Sparkles className="w-5 h-5 text-rose-500" />,
              link: customNotif.link || '/member',
            });
          });
        }
      }
    } catch (e) {}

    setNotificationsList(realNotifications);
  }, [currentUser, communication?.conversations]);

  const handleClearAll = () => {
    setNotificationsList([]);
    setIsCleared(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('2ndchance_user_notifications', JSON.stringify([]));
      }
    } catch (e) {}
  };

  return (
    <MemberLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Bell className="w-7 h-7 text-rose-500" />
              <span>Activity Alerts & Notifications</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Live updates on profile views, active messages, compatibility matches, and system alerts.
            </p>
          </div>

          {notificationsList.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-stone-600 border-stone-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Clear All
            </Button>
          )}
        </div>

        {notificationsList.length > 0 ? (
          <div className="space-y-3">
            {notificationsList.map((n) => (
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
        ) : (
          <EmptyState
            icon={Bell}
            title="No Notifications Available"
            description="You are all caught up! New profile views, messages, and system alerts will appear here in real-time."
            actionLabel="Discover Compatible Matches"
            onAction={() => window.location.href = '/search'}
          />
        )}
      </div>
    </MemberLayout>
  );
}
