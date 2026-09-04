'use client';

import React from 'react';
import { SearchFilterOptions, Gender, MaritalStatus, Religion } from '@/types';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MARITAL_STATUS_OPTIONS, RELIGION_OPTIONS } from '@/lib/constants';
import { RotateCcw, Filter, Search, CheckCircle2 } from 'lucide-react';

export interface SearchFiltersProps {
  filters: SearchFilterOptions;
  onChange: (filters: SearchFilterOptions) => void;
  onReset: () => void;
  onApply?: () => void;
  totalCount?: number;
}

export function SearchFilters({
  filters,
  onChange,
  onReset,
  onApply,
  totalCount,
}: SearchFiltersProps) {
  const updateFilter = (key: keyof SearchFilterOptions, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-5 bg-white p-6 rounded-3xl border border-rose-100/90 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-rose-500" />
          <span>Search Preferences</span>
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Looking For Gender */}
        <Select
          label="Seeking Gender"
          options={['Female', 'Male']}
          value={filters.seekingGender || 'Female'}
          onChange={(e) => updateFilter('seekingGender', e.target.value as Gender)}
        />

        {/* Marital Status */}
        <Select
          label="Marital Status"
          options={['Any', ...MARITAL_STATUS_OPTIONS]}
          value={filters.maritalStatus || 'Any'}
          onChange={(e) => updateFilter('maritalStatus', e.target.value)}
        />

        {/* Religion */}
        <Select
          label="Religion Preference"
          options={['Any', ...RELIGION_OPTIONS]}
          value={filters.religion || 'Any'}
          onChange={(e) => updateFilter('religion', e.target.value)}
        />

        {/* Age Range */}
        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Min Age"
            options={['22', '25', '28', '30', '35', '40']}
            value={filters.minAge?.toString() || '22'}
            onChange={(e) => updateFilter('minAge', parseInt(e.target.value))}
          />
          <Select
            label="Max Age"
            options={['35', '40', '45', '50', '55', '65']}
            value={filters.maxAge?.toString() || '55'}
            onChange={(e) => updateFilter('maxAge', parseInt(e.target.value))}
          />
        </div>

        {/* Location */}
        <Select
          label="Location / City"
          options={['Any', 'Dhaka', 'Chittagong', 'Sylhet', 'Overseas / NRI']}
          value={filters.location || 'Any'}
          onChange={(e) => updateFilter('location', e.target.value)}
        />

        {/* Education Level */}
        <Select
          label="Education Level"
          options={[
            'Any',
            'Doctorate / Post Graduate',
            'Master degree',
            'Bachelor degree',
          ]}
          value={filters.education || 'Any'}
          onChange={(e) => updateFilter('education', e.target.value)}
        />

        {/* Children Status */}
        <Select
          label="Has Children"
          options={['Any', 'Yes', 'No']}
          value={filters.hasChildren || 'Any'}
          onChange={(e) => updateFilter('hasChildren', e.target.value)}
        />

        {/* Verified Toggle */}
        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700 select-none">
            <input
              type="checkbox"
              checked={filters.verifiedOnly || false}
              onChange={(e) => updateFilter('verifiedOnly', e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-400 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Profiles Only
            </span>
          </label>
        </div>
      </div>

      {/* Apply Button */}
      <div className="pt-3 border-t border-stone-100 space-y-2">
        <Button
          variant="wine"
          size="md"
          onClick={onApply}
          className="w-full justify-center shadow-md shadow-rose-900/20"
          leftIcon={<Search className="w-4 h-4" />}
        >
          Apply Filters ({totalCount ?? 0})
        </Button>
      </div>
    </div>
  );
}
