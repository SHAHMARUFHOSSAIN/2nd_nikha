'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { ProfileCard } from '@/components/ui/profile-card';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useAdmin } from '@/lib/admin-context';
import { Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Filter, Sparkles, SlidersHorizontal, RotateCcw, ShieldCheck, Heart, User, MapPin, Briefcase, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';

export function FeaturedProfiles() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  let profilesList = MOCK_PROFILES;
  try {
    const admin = useAdmin();
    if (admin?.members && admin.members.length > 0) {
      profilesList = admin.members;
    }
  } catch (e) {}

  // Compact Global & Local Filter States
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [maritalStatusFilter, setMaritalStatusFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [religionFilter, setReligionFilter] = useState<string>('All');
  const [minAge, setMinAge] = useState<number>(20);
  const [maxAge, setMaxAge] = useState<number>(55);
  const [professionFilter, setProfessionFilter] = useState<string>('All');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [hasChildrenFilter, setHasChildrenFilter] = useState<string>('All');

  const countryOptions = [
    { label: 'All Countries (Global)', value: 'All' },
    { label: '🇧🇩 Bangladesh', value: 'Bangladesh' },
    { label: '🇮🇳 India (NRB / South Asia)', value: 'India' },
    { label: '🇵🇰 Pakistan (South Asia)', value: 'Pakistan' },
    { label: '🇺🇸 United States (Expat NRB)', value: 'United States' },
    { label: '🇬🇧 United Kingdom (Expat NRB)', value: 'United Kingdom' },
    { label: '🇦🇪 United Arab Emirates (UAE Expat)', value: 'UAE' },
    { label: '🇸🇦 Saudi Arabia (Expat)', value: 'Saudi Arabia' },
    { label: '🇨🇦 Canada (Expat NRB)', value: 'Canada' },
    { label: '🇲🇾 Malaysia (Expat NRB)', value: 'Malaysia' },
  ];

  const cityOptions = ['All', 'Dhaka', 'Chittagong', 'Sylhet', 'Boston', 'London', 'Dubai', 'Riyadh', 'Toronto', 'Kuala Lumpur'];
  const maritalOptions = ['All', 'Divorced', 'Widowed', 'Single Parent', 'Never Married'];
  const religionOptions = ['All', 'Islam', 'Hinduism', 'Christianity', 'Buddhism', 'Other'];
  const professionOptions = ['All', 'Software Engineer', 'Banker', 'Doctor', 'Teacher', 'Business Owner', 'Government Officer'];

  const resetFilters = () => {
    setCountryFilter('All');
    setGenderFilter('All');
    setMaritalStatusFilter('All');
    setCityFilter('All');
    setReligionFilter('All');
    setMinAge(20);
    setMaxAge(55);
    setProfessionFilter('All');
    setVerifiedOnly(false);
    setHasChildrenFilter('All');
  };

  // Dynamic Filtering Logic (Global Country + City + Marital + Verification)
  const filteredProfiles = profilesList.filter((p) => {
    if (countryFilter !== 'All' && p.country !== countryFilter) return false;
    if (genderFilter !== 'All' && p.gender !== genderFilter) return false;
    if (maritalStatusFilter !== 'All' && p.maritalStatus !== maritalStatusFilter) return false;
    if (cityFilter !== 'All' && p.city !== cityFilter && !p.location.toLowerCase().includes(cityFilter.toLowerCase())) return false;
    if (religionFilter !== 'All' && p.religion !== religionFilter) return false;
    if (p.age < minAge || p.age > maxAge) return false;
    if (professionFilter !== 'All' && !p.profession.toLowerCase().includes(professionFilter.toLowerCase())) return false;
    if (verifiedOnly && !p.isVerified) return false;
    if (hasChildrenFilter === 'No' && p.hasChildren) return false;
    if (hasChildrenFilter === 'Yes' && !p.hasChildren) return false;
    return true;
  });

  return (
    <section id="ai-match" className="py-8 sm:py-12 bg-white relative">
      <Container size="xl">
        <SectionHeading
          eyebrow="AI Match Engine"
          title="AI Match — Global & BD Smart Matrimonial Search"
          highlightWord="AI Match"
          align="center"
        />

        {/* Mobile Filter Trigger Bar */}
        <div className="lg:hidden mt-6 mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-stone-950 text-white rounded-2xl border border-pink-900/60 shadow-lg text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-pink-400" />
              <span>Filter AI Matches ({filteredProfiles.length})</span>
            </div>
            <div className="flex items-center gap-1.5 text-pink-400">
              <span className="text-[10px] font-mono uppercase">{isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
              {isMobileFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-4 lg:mt-8">
          
          {/* Left Filter Console (Mobile Collapsible / Desktop Sticky Sidebar) */}
          <aside className={`lg:col-span-3 bg-stone-950 p-4 sm:p-5 rounded-3xl text-white shadow-xl border border-pink-900/60 space-y-4 select-none lg:sticky lg:top-24 ${
            isMobileFilterOpen ? 'block mb-6' : 'hidden lg:block'
          }`}>
            
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-white leading-tight">AI Filters</h3>
                  <span className="text-[10px] text-pink-400 font-mono font-bold">
                    {filteredProfiles.length} Matches Found
                  </span>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-300 text-[10px] font-bold border border-stone-800 transition-all"
                title="Reset Filters"
              >
                <RotateCcw className="w-3 h-3 text-pink-400" />
                <span>Reset</span>
              </button>
            </div>

            {/* Form Fields List */}
            <div className="space-y-3 text-[11px] font-bold">
              
              {/* Country / Expat Residency Filter */}
              <div className="space-y-1">
                <label className="text-stone-300 flex items-center gap-1 text-[11px]">
                  <Globe className="w-3 h-3 text-pink-400" />
                  <span>Country / Expat NRB</span>
                </label>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
                >
                  {countryOptions.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* City / Location */}
              <div className="space-y-1 pt-2 border-t border-stone-800/80">
                <label className="text-stone-300 flex items-center gap-1 text-[11px]">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  <span>City / State</span>
                </label>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div className="space-y-1 pt-2 border-t border-stone-800/80">
                <label className="text-stone-300 flex items-center gap-1 text-[11px]">
                  <User className="w-3 h-3 text-pink-400" />
                  <span>Looking For</span>
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
                >
                  <option value="All">All Genders</option>
                  <option value="Female">Brides (Female)</option>
                  <option value="Male">Grooms (Male)</option>
                </select>
              </div>

              {/* Age Slider */}
              <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                <div className="flex justify-between text-stone-300 text-[11px]">
                  <span>Age:</span>
                  <span className="text-pink-400 font-mono font-bold">{minAge} — {maxAge} yrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="20"
                    max="65"
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer h-1.5"
                  />
                  <input
                    type="range"
                    min="20"
                    max="65"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* Marital Status */}
              <div className="space-y-1 pt-2 border-t border-stone-800/80">
                <label className="text-stone-300 flex items-center gap-1 text-[11px]">
                  <Heart className="w-3 h-3 text-pink-400" />
                  <span>Marital Status</span>
                </label>
                <select
                  value={maritalStatusFilter}
                  onChange={(e) => setMaritalStatusFilter(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
                >
                  {maritalOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Religion */}
              <div className="space-y-1 pt-2 border-t border-stone-800/80">
                <label className="text-stone-300 flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  <span>Religion</span>
                </label>
                <select
                  value={religionFilter}
                  onChange={(e) => setReligionFilter(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
                >
                  {religionOptions.map((rel) => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>

              {/* Profession */}
              <div className="space-y-1 pt-2 border-t border-stone-800/80">
                <label className="text-stone-300 flex items-center gap-1 text-[11px]">
                  <Briefcase className="w-3 h-3 text-pink-400" />
                  <span>Profession</span>
                </label>
                <select
                  value={professionFilter}
                  onChange={(e) => setProfessionFilter(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-pink-500 text-xs"
                >
                  {professionOptions.map((prof) => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </select>
              </div>

              {/* NID Verification Toggle */}
              <div className="pt-2 border-t border-stone-800/80">
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-full py-2.5 px-2.5 rounded-lg border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                    verifiedOnly
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-md'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{verifiedOnly ? '✓ NID Verified Only' : 'All Profiles'}</span>
                </button>
              </div>

            </div>

          </aside>

          {/* Right Main Column: Responsive Cards Grid (lg:col-span-9) */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Results Bar */}
            <div className="p-3 sm:p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs text-stone-700 font-bold">
              <span>{filteredProfiles.length} verified profile matches</span>
              <span className="text-pink-600 font-mono text-[11px]">Global & Expat Search</span>
            </div>

            {/* 3-Column Profile Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 px-4 bg-stone-50 rounded-3xl border border-stone-200 text-center space-y-3">
                  <Filter className="w-10 h-10 text-pink-500 mx-auto" />
                  <h4 className="font-serif font-bold text-lg text-stone-900">No Global Matches Found</h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    No profiles match your specific country/location filter combination. Try selecting "All Countries (Global)".
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-md transition-all inline-block"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

          </main>

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
