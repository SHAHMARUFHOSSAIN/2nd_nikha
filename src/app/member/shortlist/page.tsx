'use client';

import React from 'react';
import { MemberLayout } from '@/components/member/member-layout';
import { useAuth } from '@/lib/auth-context';
import { MOCK_PROFILES } from '@/data/mock-data';
import { ProfileCard } from '@/components/ui/profile-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Star, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MemberShortlistPage() {
  const router = useRouter();
  const { shortlistedIds } = useAuth();

  const shortlistedProfiles = MOCK_PROFILES.filter((p) =>
    shortlistedIds.includes(p.id)
  );

  return (
    <MemberLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
              <span>My Shortlisted Profiles</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Quick access to profiles you saved for serious consideration.
            </p>
          </div>

          <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            {shortlistedProfiles.length} Saved
          </span>
        </div>

        {shortlistedProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlistedProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Star className="w-12 h-12 text-amber-400" />}
            title="You Haven't Shortlisted Anyone Yet"
            description="Explore our verified candidates and bookmark profiles that match your family and lifestyle goals."
            actionLabel="Discover Compatible Matches"
            onAction={() => router.push('/search')}
          />
        )}
      </div>
    </MemberLayout>
  );
}
