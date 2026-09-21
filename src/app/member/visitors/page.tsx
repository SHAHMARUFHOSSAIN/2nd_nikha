'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MemberLayout } from '@/components/member/member-layout';
import { useConnection } from '@/lib/connection-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Eye,
  Heart,
  MessageSquare,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  User,
} from 'lucide-react';
import { ProfileDetailModal } from '@/components/profile/profile-detail-modal';

interface VisitorItem {
  id: string;
  visitedAt: string;
  visitedTimeAgo: string;
  isNew: boolean;
  profile: any;
}

export default function ProfileVisitorsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'today' | 'new'>('all');
  const [visitorsList, setVisitorsList] = useState<VisitorItem[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  // Real, stored ProfileVisit records (DB) for the signed-in member.
  useEffect(() => {
    (async () => {
      if (typeof window === 'undefined') return;
      try {
        const res = await fetch('/api/visits', { cache: 'no-store', credentials: 'include' });
        const json = await res.json().catch(() => null);
        const rows: any[] = Array.isArray(json?.visitors) ? json.visitors : [];
        const visits: VisitorItem[] = rows.map((v: any) => ({
          id: v?.id || `v-${v?.visitorId}`,
          visitedAt: v?.visitedAt,
          visitedTimeAgo: v?.visitedTimeAgo || v?.visitedAt || 'Recently',
          isNew: !!v?.isNew,
          profile: v?.profile,
        }));
        setVisitorsList(visits);
      } catch (err) {}
    })();
  }, [currentUser]);

  const filteredVisitors = visitorsList.filter((v) => {
    if (filter === 'new') return v.isNew;
    if (filter === 'today') return (v.visitedTimeAgo || '').includes('ago');
    return true;
  });

  return (
    <MemberLayout title="Profile Visitors">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-inner">
                <Eye className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
                  <span>Profile Visitors</span>
                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs">
                    {visitorsList.length} Views
                  </Badge>
                </h1>
                <p className="text-xs text-stone-500 font-medium">
                  Members who recently visited and viewed your matrimonial profile.
                </p>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Visitors ({visitorsList.length})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === 'new'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              New ({visitorsList.filter((v) => v.isNew).length})
            </button>
          </div>
        </div>

        {/* Visitors List Grid */}
        {filteredVisitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredVisitors.map((item) => {
              const p = item.profile;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
                >
                  {/* Visited Timestamp Tag */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Viewed {item.visitedTimeAgo}</span>
                    </span>
                    {item.isNew && (
                      <span className="text-[10px] font-extrabold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        New Visit
                      </span>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div
                    onClick={() => setSelectedProfile(p)}
                    className="flex items-start gap-4 cursor-pointer group/card"
                  >
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-rose-50 border-2 border-emerald-100 shrink-0 shadow-xs">
                      <Image
                        src={p.photoUrl || '/images/default-avatar.jpg'}
                        alt={p.fullName}
                        fill
                        className="object-cover object-top group-hover/card:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 truncate group-hover/card:text-rose-700 transition-colors">
                          {p.fullName}, {p.age}
                        </h3>
                        <VerifiedBadge showLabel labelText="Verified" />
                      </div>

                      <div className="space-y-0.5 text-xs text-stone-600">
                        <p className="flex items-center gap-1.5 truncate">
                          <Briefcase className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{p.profession || 'Professional'}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <GraduationCap className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{p.education || 'Higher Education'}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{p.location || 'Dhaka, Bangladesh'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/member/messages?matchId=${p.id}`)}
                      className="rounded-full text-xs border-stone-200 hover:border-pink-500 hover:bg-pink-50 text-stone-700 flex-1 font-bold"
                      leftIcon={<MessageSquare className="w-3.5 h-3.5 text-pink-600" />}
                    >
                      Message
                    </Button>

                    <Button
                      variant="wine"
                      size="sm"
                      onClick={() => setSelectedProfile(p)}
                      className="rounded-full text-xs flex-1 font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-xs"
                      leftIcon={<User className="w-3.5 h-3.5 text-white" />}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Eye}
            title="No Visitors Found"
            description="No recent profile visitors match your selected filter criteria."
            actionLabel="View All Visitors"
            onAction={() => setFilter('all')}
          />
        )}
      </div>

      {selectedProfile && (
        <ProfileDetailModal
          profile={selectedProfile}
          isOpen={Boolean(selectedProfile)}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </MemberLayout>
  );
}
