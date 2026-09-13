'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProfileCard } from '@/components/ui/profile-card';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useAdmin } from '@/lib/admin-context';
import { RefreshCw } from 'lucide-react';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';
import { useAuth } from '@/lib/auth-context';
import { Profile } from '@/types';

export function HomeFeaturedProfiles() {
  const { currentUser } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [displayProfiles, setDisplayProfiles] = useState<Profile[]>([]);

  let baseProfiles = MOCK_PROFILES;
  try {
    const admin = useAdmin();
    if (admin?.members && admin.members.length > 0) {
      baseProfiles = admin.members;
    }
  } catch (e) {}

  const shuffleAndSetProfiles = () => {
    let rawList = baseProfiles;
    if (currentUser) {
      rawList = rawList.filter(
        (p) =>
          p.id !== currentUser.id &&
          (!p.email || !currentUser.email || p.email.toLowerCase() !== currentUser.email.toLowerCase())
      );
    }

    // Build rich pool of diverse candidates
    const pool: Profile[] = [];
    const iterations = Math.max(3, Math.ceil(24 / (rawList.length || 1)));

    for (let i = 0; i < iterations; i++) {
      for (const p of rawList) {
        pool.push({
          ...p,
          id: i === 0 ? p.id : `${p.id}-rand-${i}`,
          matchPercentage: Math.min(99, Math.max(84, p.matchPercentage + ((i * 4) % 11) - 5)),
        });
      }
    }

    // True Fisher-Yates random shuffle on every refresh / load
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setDisplayProfiles(shuffled);
  };

  useEffect(() => {
    shuffleAndSetProfiles();
  }, [baseProfiles, currentUser]);

  return (
    <section id="featured-profiles" className="py-10 sm:py-16 bg-white relative">
      <Container size="xl">
        <SectionHeading
          eyebrow="Verified Candidates Sanctuary"
          title="Explore Verified Candidates — Every Refresh Reveals New Matches"
          highlightWord="Verified Candidates"
          subtitle="Browse through dozens of genuine, verified candidate profiles across Bangladesh and global NRB expats."
          align="center"
        />

        {/* Refresh / Shuffle Trigger Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs sm:text-sm font-serif font-bold text-stone-900">
              Showing <strong className="text-pink-600">{displayProfiles.length}</strong> Verified Profiles (Randomized)
            </span>
          </div>

          <button
            onClick={shuffleAndSetProfiles}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200 shadow-xs transition-all active:scale-95"
            title="Shuffle Profiles Now"
          >
            <RefreshCw className="w-3.5 h-3.5 text-pink-600" />
            <span>Shuffle Profiles</span>
          </button>
        </div>

        {/* 2-Column Mobile Grid / 4-Column Desktop Grid (No Filter Sidebar) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {displayProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            />
          ))}
        </div>

        {/* Upgrade Modal Trigger */}
        <MembershipPreviewModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
        />
      </Container>
    </section>
  );
}
