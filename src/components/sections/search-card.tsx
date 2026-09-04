'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { MARITAL_STATUS_OPTIONS, RELIGION_OPTIONS } from '@/lib/constants';
import { Search, Heart, Sparkles } from 'lucide-react';

export function SearchCard() {
  const [seekingGender, setSeekingGender] = useState('Female');
  const [maritalStatus, setMaritalStatus] = useState('Divorced');
  const [ageMin, setAgeMin] = useState('28');
  const [ageMax, setAgeMax] = useState('45');
  const [religion, setReligion] = useState('Islam');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchElement = document.getElementById('featured-profiles');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl border-2 border-rose-100 rounded-3xl p-6 shadow-2xl shadow-rose-200/50 relative overflow-hidden">
      {/* Decorative Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-brand-wine" />

      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-rose-100/80 text-rose-600">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-xl text-stone-900">
            Find Your 2nd Chance
          </h3>
          <p className="text-xs text-stone-500">Discover verified, like-minded matches</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        {/* I am looking for */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="I am looking for"
            options={['Female', 'Male']}
            value={seekingGender}
            onChange={(e) => setSeekingGender(e.target.value)}
          />
          <Select
            label="Marital Status"
            options={['Any', ...MARITAL_STATUS_OPTIONS]}
            value={maritalStatus}
            onChange={(e) => setMaritalStatus(e.target.value)}
          />
        </div>

        {/* Age Range */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Min Age"
            options={['22', '25', '28', '30', '35', '40', '45']}
            value={ageMin}
            onChange={(e) => setAgeMin(e.target.value)}
          />
          <Select
            label="Max Age"
            options={['35', '40', '45', '50', '55', '60', '65']}
            value={ageMax}
            onChange={(e) => setAgeMax(e.target.value)}
          />
        </div>

        {/* Religion */}
        <Select
          label="Religion"
          options={['Any', ...RELIGION_OPTIONS]}
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
        />

        {/* Search CTA */}
        <Button
          type="submit"
          variant="wine"
          size="lg"
          className="w-full mt-2 shadow-lg shadow-rose-900/20"
          leftIcon={<Search className="w-4 h-4" />}
        >
          Search Verified Profiles
        </Button>
      </form>

      <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between text-xs text-stone-500">
        <span className="flex items-center gap-1 text-emerald-700 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          10,000+ Active Members
        </span>
        <span className="text-stone-400">100% Privacy Protected</span>
      </div>
    </div>
  );
}
