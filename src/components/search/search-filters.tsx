'use client';

import React from 'react';
import { SearchFilterOptions, Gender, MaritalStatus, Religion } from '@/types';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MARITAL_STATUS_OPTIONS, RELIGION_OPTIONS, ALL_PROFESSION_OPTIONS, DEFAULT_COUNTRY_OPTIONS, COUNTRY_CITY_MAP, getCitiesForCountry } from '@/lib/constants';
import { RotateCcw, Filter, Search, CheckCircle2, Globe, MapPin } from 'lucide-react';

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

  const selectedCountry = filters.country || 'Any';
  const availableCitiesList = React.useMemo(() => {
    return getCitiesForCountry(selectedCountry);
  }, [selectedCountry]);

  const availableCities = React.useMemo(() => {
    return ['Any', ...availableCitiesList];
  }, [availableCitiesList]);

  const maritalStatusOptions = React.useMemo(() => {
    if (filters.seekingGender === 'Male') {
      return ['Any', 'Divorced', 'Widowed', 'Single Parent', 'Never Married', 'Married'];
    }
    return ['Any', 'Divorced', 'Widowed', 'Single Parent', 'Never Married'];
  }, [filters.seekingGender]);

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
          onChange={(e) => {
            const newGender = e.target.value as Gender;
            const updatedMarital = (newGender === 'Female' && filters.maritalStatus === 'Married') ? 'Any' : filters.maritalStatus;
            onChange({ ...filters, seekingGender: newGender, maritalStatus: updatedMarital });
          }}
        />

        {/* Marital Status */}
        <Select
          label="Marital Status"
          options={maritalStatusOptions}
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
            options={['18', '21', '25', '28', '30', '35', '40', '45', '50', '55', '60', '65']}
            value={filters.minAge?.toString() || '18'}
            onChange={(e) => updateFilter('minAge', parseInt(e.target.value))}
          />
          <Select
            label="Max Age"
            options={['25', '30', '35', '40', '45', '50', '55', '60', '65']}
            value={filters.maxAge?.toString() || '65'}
            onChange={(e) => updateFilter('maxAge', parseInt(e.target.value))}
          />
        </div>

        {/* Country Select */}
        <Select
          label="Country / Region"
          options={['Any', ...DEFAULT_COUNTRY_OPTIONS.map((c) => c.value)]}
          value={filters.country || 'Any'}
          onChange={(e) => {
            const newCountry = e.target.value;
            onChange({ ...filters, country: newCountry, city: 'Any', location: 'Any' });
          }}
        />

        {/* Dynamic City Select & Quick Chips */}
        <div className="space-y-2">
          <Select
            label={selectedCountry !== 'Any' && selectedCountry !== 'All' ? `City Filter (${selectedCountry})` : 'Select City'}
            options={availableCities}
            value={filters.city || 'Any'}
            onChange={(e) => {
              const rawCity = e.target.value;
              const cleanCity = rawCity.replace(/\s*\([^)]*\)/g, '').trim();
              onChange({ ...filters, city: cleanCity, location: cleanCity });
            }}
          />

          {/* Quick Select City Chips if Country is Selected */}
          {selectedCountry && selectedCountry !== 'Any' && selectedCountry !== 'All' && availableCitiesList.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Popular Cities in {selectedCountry}:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, city: 'Any', location: 'Any' })}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    !filters.city || filters.city === 'Any'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All Cities
                </button>
                {availableCitiesList.map((cityName) => {
                  const cleanName = cityName.replace(/\s*\([^)]*\)/g, '').trim();
                  const isSelected = filters.city?.toLowerCase() === cleanName.toLowerCase();
                  return (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => onChange({ ...filters, city: cleanName, location: cleanName })}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-rose-50 text-rose-900 border border-rose-200/80 hover:bg-rose-100'
                      }`}
                    >
                      {cityName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

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

        {/* Profession Filter */}
        <Select
          label="Profession Preference"
          options={['Any', ...ALL_PROFESSION_OPTIONS]}
          value={filters.profession || 'Any'}
          onChange={(e) => updateFilter('profession', e.target.value)}
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
