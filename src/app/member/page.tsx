'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MemberLayout } from '@/components/member/member-layout';
import { ProfileCompletionCard } from '@/components/member/profile-completion-card';
import { ProfileCard } from '@/components/ui/profile-card';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';
import {
  Sparkles,
  Heart,
  Users,
  Eye,
  ShieldCheck,
  Crown,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';
import Image from 'next/image';

export default function MemberDashboardPage() {
  const { userRole, currentUser: authUser } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const currentUser = authUser || MOCK_PROFILES[0];
  const firstName = currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Member';

  // Mock Received Interests State
  const [receivedInterests, setReceivedInterests] = useState([
    {
      id: 'int-1',
      profile: MOCK_PROFILES[1], // Tanvir Ahmed
      date: '2 hours ago',
      status: 'pending',
    },
    {
      id: 'int-2',
      profile: MOCK_PROFILES[3], // Mahmudul Hasan
      date: '1 day ago',
      status: 'pending',
    },
  ]);

  const handleInterestResponse = (id: string, action: 'accept' | 'reject') => {
    setReceivedInterests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action === 'accept' ? 'accepted' : 'rejected' } : item
      )
    );
  };

  const recommendedMatches = MOCK_PROFILES.slice(1, 4);
  const visitors = MOCK_PROFILES.slice(3, 6);

  return (
    <MemberLayout>
      <div className="space-y-8">
        {/* Welcome Header & Status Cards */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <span>Welcome back, {firstName}</span>
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              Here is your daily matrimonial activity summary and recommended matches.
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

        {/* Profile Strength & Verification Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ProfileCompletionCard percentage={78} />
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Identity Verification Status</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                NID Verified Member
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your National ID has been successfully verified. A green checkmark badge is displayed on your public profile.
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-emerald-700">✓ Trust Score: 98%</span>
              <Link href="/member/settings" className="text-rose-700 font-bold hover:underline">
                View Badge Details
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1">
            <div className="p-2 rounded-xl bg-rose-50 w-fit text-rose-600 mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">24</span>
            <p className="text-xs text-stone-500 font-medium">Recommended Matches</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1">
            <div className="p-2 rounded-xl bg-pink-50 w-fit text-pink-600 mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">8</span>
            <p className="text-xs text-stone-500 font-medium">Received Interests</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1">
            <div className="p-2 rounded-xl bg-amber-50 w-fit text-amber-600 mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">12</span>
            <p className="text-xs text-stone-500 font-medium">Sent Interests</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-sm space-y-1">
            <div className="p-2 rounded-xl bg-emerald-50 w-fit text-emerald-600 mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <span className="text-3xl font-serif font-bold text-stone-900">31</span>
            <p className="text-xs text-stone-500 font-medium">Profile Visitors</p>
          </div>
        </div>

        {/* Received Interests Section */}
        <section id="interests" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Recent Received Interests ({receivedInterests.length})
            </h2>
            <Link href="/member/notifications" className="text-xs font-bold text-rose-700 hover:underline">
              View All Alerts →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {receivedInterests.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-rose-100/90 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-rose-50 shrink-0">
                    <Image
                      src={item.profile.photoUrl}
                      alt={item.profile.fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">
                      {item.profile.fullName}, {item.profile.age}
                    </h4>
                    <p className="text-xs text-stone-500">
                      {item.profile.profession} • {item.profile.city}
                    </p>
                    <span className="text-[11px] text-rose-700 font-semibold inline-block pt-0.5">
                      {item.profile.matchPercentage}% Compatibility Match
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-1 text-right">
                  {item.status === 'pending' ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <Button
                        variant="wine"
                        size="sm"
                        className="text-xs px-3"
                        onClick={() => handleInterestResponse(item.id, 'accept')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-3"
                        onClick={() => handleInterestResponse(item.id, 'reject')}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : item.status === 'accepted' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mutual Match!
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium">Declined</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Matches Section */}
        <section id="recommended" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-stone-900">
              Recommended Matches For You
            </h2>
            <Link href="/search" className="text-xs font-bold text-rose-700 hover:underline">
              Explore All Matches →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedMatches.map((profile) => (
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
          <h2 className="font-serif font-bold text-2xl text-stone-900">
            People Who Viewed Your Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {visitors.map((visitor) => (
              <div
                key={visitor.id}
                className="bg-white p-4 rounded-3xl border border-rose-100/80 shadow-sm flex items-center gap-3"
              >
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-rose-50 shrink-0">
                  <Image
                    src={visitor.photoUrl}
                    alt={visitor.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                    {visitor.fullName}, {visitor.age}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">{visitor.profession}</p>
                  <p className="text-[10px] text-rose-700 font-medium pt-0.5">Viewed 1 day ago</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <MembershipPreviewModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </MemberLayout>
  );
}
