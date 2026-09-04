'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProfileCard } from '@/components/ui/profile-card';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useAdmin } from '@/lib/admin-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';

export function HomeFeaturedProfiles() {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  let profilesList = MOCK_PROFILES;
  try {
    const admin = useAdmin();
    if (admin?.members && admin.members.length > 0) {
      profilesList = admin.members;
    }
  } catch (e) {}

  const categories = ['All', 'Divorced', 'Widowed', 'Single Parent', 'Never Married'];

  // Filter 9-12 featured profiles for homepage preview
  const filteredProfiles = (selectedStatus === 'All'
    ? profilesList
    : profilesList.filter((p) => p.maritalStatus === selectedStatus)
  ).slice(0, 9);

  return (
    <section id="featured-profiles" className="py-20 bg-white relative">
      <Container size="xl">
        <SectionHeading
          eyebrow="Featured Remarriage Candidates"
          title="Verified Profiles Ready For Genuine Compatibility"
          highlightWord="Verified Profiles"
          subtitle="Explore 9 to 12 curated profiles of divorced, widowed, and single parent singles across Bangladesh. Click 'See All AI Matches' for custom filters."
          align="center"
        />

        {/* Category Pill Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedStatus(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                selectedStatus === cat
                  ? 'bg-gradient-to-r from-pink-500 via-pink-600 to-rose-600 text-white shadow-md shadow-pink-200'
                  : 'bg-stone-50 text-stone-600 hover:bg-pink-50 hover:text-pink-700 border border-stone-200/80'
              }`}
            >
              {cat === 'All' ? 'All Featured Profiles' : cat}
            </button>
          ))}
        </div>

        {/* 3-Column Profile Cards Grid (9 to 12 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
            />
          ))}
        </div>

        {/* See More Matches CTA Button */}
        <div className="mt-12 text-center">
          <Link href="/search">
            <Button
              variant="primary"
              size="lg"
              className="px-8 py-4 text-sm shadow-xl shadow-pink-200/80 hover:scale-105 transition-all"
              rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
            >
              See All AI Matches & Advanced Filters (1,420+)
            </Button>
          </Link>
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
