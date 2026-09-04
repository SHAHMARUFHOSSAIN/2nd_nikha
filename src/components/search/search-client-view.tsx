'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_PROFILES } from '@/data/mock-data';
import { SearchFilterOptions, Profile } from '@/types';
import { ProfileCard } from '@/components/ui/profile-card';
import { SearchFilters } from './search-filters';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { Container } from '@/components/layout/container';
import { Filter, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';

const initialFilters: SearchFilterOptions = {
  seekingGender: 'Female',
  maritalStatus: 'Any',
  minAge: 22,
  maxAge: 55,
  religion: 'Any',
  location: 'Any',
  education: 'Any',
  hasChildren: 'Any',
  verifiedOnly: false,
  sortBy: 'best_match',
};

export function SearchClientView() {
  const [filters, setFilters] = useState<SearchFilterOptions>(initialFilters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProfiles = useMemo(() => {
    return MOCK_PROFILES.filter((profile) => {
      // Seeking gender
      if (filters.seekingGender && profile.gender !== filters.seekingGender) return false;

      // Marital status
      if (
        filters.maritalStatus &&
        filters.maritalStatus !== 'Any' &&
        profile.maritalStatus !== filters.maritalStatus
      ) {
        return false;
      }

      // Religion
      if (
        filters.religion &&
        filters.religion !== 'Any' &&
        profile.religion !== filters.religion
      ) {
        return false;
      }

      // Age range
      if (filters.minAge && profile.age < filters.minAge) return false;
      if (filters.maxAge && profile.age > filters.maxAge) return false;

      // Location
      if (
        filters.location &&
        filters.location !== 'Any' &&
        !profile.location.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Children
      if (filters.hasChildren === 'Yes' && !profile.hasChildren) return false;
      if (filters.hasChildren === 'No' && profile.hasChildren) return false;

      // Verified
      if (filters.verifiedOnly && !profile.isVerified) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'compatibility') {
        return b.matchPercentage - a.matchPercentage;
      }
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.matchPercentage - a.matchPercentage;
    });
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <Container size="xl" className="py-8 md:py-12">
      {/* Top Header / Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-rose-100">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Discover Verified Matches
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Showing <strong className="text-stone-900">{filteredProfiles.length}</strong> verified profiles matching your criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Drawer Trigger */}
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-none justify-center"
            leftIcon={<SlidersHorizontal className="w-4 h-4 text-rose-500" />}
          >
            Filters
          </Button>

          {/* Sort Dropdown */}
          <div className="w-48">
            <Select
              options={[
                { value: 'best_match', label: 'Sort: Best Match' },
                { value: 'compatibility', label: 'Sort: Most Compatible' },
                { value: 'newest', label: 'Sort: Newest Profiles' },
                { value: 'recently_active', label: 'Sort: Recently Active' },
              ]}
              value={filters.sortBy || 'best_match'}
              onChange={(e) =>
                setFilters({ ...filters, sortBy: e.target.value as any })
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24">
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalCount={filteredProfiles.length}
            />
          </div>
        </aside>

        {/* Profile Results Grid */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No Profiles Found"
              description="No verified candidates match your exact filter criteria right now. Try expanding your age range or resetting specific filters."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto z-10 animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Filter Profiles
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              onApply={() => setIsMobileFilterOpen(false)}
              totalCount={filteredProfiles.length}
            />
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      <MembershipPreviewModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </Container>
  );
}
