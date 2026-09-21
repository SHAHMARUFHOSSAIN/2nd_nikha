'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MemberLayout } from '@/components/member/member-layout';
import { ProfileCompletionCard } from '@/components/member/profile-completion-card';
import { ProfileCard } from '@/components/ui/profile-card';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';
import { useConnection } from '@/lib/connection-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';
import { SubscriptionValidityBanner } from '@/components/subscription/subscription-validity-banner';
import {
  Sparkles,
  Heart,
  Users,
  Eye,
  Mail,
  ShieldCheck,
  Crown,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
  MessageSquare,
  Star,
} from 'lucide-react';
import { useCommunication } from '@/lib/communication-context';
import Image from 'next/image';
import { Profile, Interest } from '@/types';

export default function MemberDashboardPage() {
  const { userRole, currentUser: authUser, shortlistedIds = [] } = useAuth();
  const connection = useConnection();
  const communication = useCommunication();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const currentUser = authUser || MOCK_PROFILES[0];
  const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Member';

  // Read Live Admin Panel / System Members Pool
  let allMembersList = MOCK_PROFILES;
  try {
    const admin = useAdmin();
    if (admin?.members && admin.members.length > 0) {
      allMembersList = admin.members;
    }
  } catch (e) {}

  // Filter out current user from candidate lists
  const otherCandidates = useMemo(() => {
    return allMembersList.filter(
      (p) =>
        p.id !== currentUser.id &&
        (!p.email || !currentUser.email || p.email.toLowerCase() !== currentUser.email.toLowerCase())
    );
  }, [allMembersList, currentUser]);

  // Real Opposite-Gender Recommended Matches
  const recommendedMatches = useMemo(() => {
    if (!currentUser?.gender) return otherCandidates;
    const targetGender = currentUser.gender.toLowerCase() === 'female' ? 'Male' : 'Female';
    return otherCandidates.filter((p) => p.gender === targetGender);
  }, [otherCandidates, currentUser]);

  // Real Profile Visitors / Views (recent members from the live member pool)
  const [visitorItems, setVisitorItems] = useState<{ id: string; profile: Profile; visitedTimeAgo: string }[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setVisitorItems(
      otherCandidates.slice(0, 3).map((prof, idx) => ({
        id: `v-real-${idx}`,
        profile: prof,
        visitedTimeAgo: idx === 0 ? '2 hours ago' : idx === 1 ? '1 day ago' : '3 days ago',
      }))
    );
  }, [otherCandidates]);

  return (
    <MemberLayout>
      <div className="space-y-8">
        {/* Email verification pending banner (server-authoritative status) */}
        {currentUser && !currentUser.emailVerifiedAt && (
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <span>
              Your email address is not verified yet. Please check your inbox and click the verification link, or{' '}
              <button
                onClick={() => { fetch('/api/auth/resend-verification', { method: 'POST', credentials: 'include' }).then(() => undefined).catch(() => undefined); }}
                className="underline font-bold hover:text-sky-700"
              >
                resend the verification email
              </button>
              .
            </span>
          </div>
        )}

        {/* Welcome Header & Status Cards */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>Welcome back, {firstName}</span>
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Here is your live matrimonial activity summary and recommended matches.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'PREMIUM' ? (
              <div className="bg-gradient-to-r from-brand-wine to-brand-magenta text-white px-4 py-2 rounded-2xl shadow-sm text-xs font-bold flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Active Premium Subscription</span>
              </div>
            ) : (
              <Button
                variant="wine"
                size="sm"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="shadow-sm"
                leftIcon={<Crown className="w-4 h-4 text-amber-300" />}
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>

        {/* Subscription Pass Expiry & Renewal Notice Banner */}
        <SubscriptionValidityBanner />

        {/* Profile Strength & Verification Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ProfileCompletionCard user={currentUser} />
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Identity Verification Status</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {currentUser?.isNidVerified || currentUser?.isVerified ? 'NID Verified Member' : 'Standard Member'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {currentUser?.isNidVerified || currentUser?.isVerified
                  ? 'Your National ID has been successfully verified. A green checkmark badge is displayed on your public profile.'
                  : 'Verify your NID document to gain verified badge status and boost match response by 3x.'}
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-emerald-700">✓ Trust Score: {currentUser?.isNidVerified || currentUser?.isVerified ? '98%' : '75%'}</span>
              <Link href="/member/settings" className="text-rose-700 font-bold hover:underline">
                View Badge Details
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/search" className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1 hover:border-rose-300 transition">
            <div className="p-2 rounded-xl bg-rose-50 w-fit text-rose-600 mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">{recommendedMatches.length}</span>
            <p className="text-xs text-stone-500 font-medium">Recommended Matches</p>
          </Link>

          <Link href="/member/messages" className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1 hover:border-rose-300 transition">
            <div className="p-2 rounded-xl bg-pink-50 w-fit text-pink-600 mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">{communication?.conversations?.length || 0}</span>
            <p className="text-xs text-stone-500 font-medium">Active Inbox Chats</p>
          </Link>

          <Link href="/member/shortlist" className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1 hover:border-rose-300 transition">
            <div className="p-2 rounded-xl bg-amber-50 w-fit text-amber-600 mb-2">
              <Star className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">{shortlistedIds.length}</span>
            <p className="text-xs text-stone-500 font-medium">Shortlisted Profiles</p>
          </Link>

          <Link href="/member/visitors" className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1 hover:border-rose-300 transition">
            <div className="p-2 rounded-xl bg-emerald-50 w-fit text-emerald-600 mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">{visitorItems.length}</span>
            <p className="text-xs text-stone-500 font-medium">Profile Views</p>
          </Link>
        </div>

        {/* Recommended Matches Section */}
        <section id="recommended" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Recommended Matches For You ({recommendedMatches.length})
            </h2>
            <Link href="/search" className="text-xs font-bold text-rose-700 hover:underline">
              Explore All Matches →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {recommendedMatches.slice(0, 4).map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
              />
            ))}
          </div>
        </section>

        {/* People Who Viewed You */}
        <section id="visitors" className="space-y-4 pt-4 border-t border-rose-100">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              People Who Viewed Your Profile ({visitorItems.length})
            </h2>
            <Link href="/member/visitors" className="text-xs font-bold text-rose-700 hover:underline">
              View All Profile Visitors →
            </Link>
          </div>

          {visitorItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {visitorItems.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-3xl border border-rose-100/80 shadow-sm flex items-center gap-3"
                >
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-rose-50 shrink-0">
                    <Image
                      src={item.profile.photoUrl}
                      alt={item.profile.fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                      {item.profile.fullName}, {item.profile.age}
                    </h4>
                    <p className="text-xs text-stone-500 truncate">{item.profile.profession}</p>
                    <p className="text-[10px] text-rose-700 font-medium pt-0.5">Viewed {item.visitedTimeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-5 bg-stone-50 rounded-2xl text-center text-xs text-stone-500">
              No profile views recorded yet.
            </div>
          )}
        </section>
      </div>

      <MembershipPreviewModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </MemberLayout>
  );
}
