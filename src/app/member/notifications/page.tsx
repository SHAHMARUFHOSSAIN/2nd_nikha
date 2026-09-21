'use client';

import React, { useState, useEffect } from 'react';
import { MemberLayout } from '@/components/member/member-layout';
import { Heart, Sparkles, Eye, ShieldCheck, Crown, Bell, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useCommunication } from '@/lib/communication-context';
import { useConnection } from '@/lib/connection-context';
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
  const connection = useConnection();
  const [notificationsList, setNotificationsList] = useState<DynamicNotificationItem[]>([]);
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const realNotifications: DynamicNotificationItem[] = [];

    // 1. DB-backed notifications (interests, matches, system alerts)
    if (connection?.notifications && connection.notifications.length > 0) {
      connection.notifications.slice(0, 20).forEach((n: any) => {
        const isInterest = /interest/i.test(`${n.title} ${n.message}`);
        const isMatch = /match|accept/i.test(`${n.title} ${n.message}`);
        realNotifications.push({
          id: n.id,
          title: n.title || n.message,
          type: isInterest ? 'Interest' : isMatch ? 'Match' : n.title?.includes('Subscript') ? 'Subscription' : 'System',
          date: n.date || 'Recently',
          icon: isInterest ? <Heart className="w-5 h-5 text-rose-600" /> :
                 isMatch ? <Sparkles className="w-5 h-5 text-amber-500" /> :
                 <Crown className="w-5 h-5 text-amber-500" />,
          link: n.targetUrl || '/member',
          isRead: n.read,
        });
      });
    }

    // 2. Dynamic Direct Messages / Active Conversations
    if (communication?.conversations && communication.conversations.length > 0) {
      communication.conversations.slice(0, 4).forEach((conv: any, idx: number) => {
        const partnerName = conv.profile?.fullName || 'Member';
        realNotifications.push({
          id: `notif-msg-${conv.id || idx}`,
          title: `Active message conversation with ${partnerName}`,
          type: 'Direct Message',
          date: conv.lastMessageAt || 'Active',
          icon: <MessageSquare className="w-5 h-5 text-pink-600" />,
          link: `/member/messages?matchId=${conv.matchId || conv.partnerId}`,
        });
      });
    }

    setNotificationsList(realNotifications);
  }, [currentUser, communication?.conversations, connection?.notifications]);

  const handleClearAll = () => {
    setNotificationsList([]);
    setIsCleared(true);
    fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({}),
    }).catch(() => {});
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
