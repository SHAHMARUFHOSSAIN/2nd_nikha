'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, COUNTRY_CURRENCIES } from '@/lib/currency-context';
import { ChevronDown, ChevronUp, Globe, Check } from 'lucide-react';

interface CurrencySwitcherProps {
  variant?: 'navbar' | 'pricing' | 'footer';
  dropPosition?: 'up' | 'down';
}

export function CurrencySwitcher({
  variant = 'navbar',
  dropPosition = 'down',
}: CurrencySwitcherProps) {
  const { selectedCountry, setCountry } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses =
    dropPosition === 'up'
      ? 'bottom-full mb-2.5 slide-in-from-bottom-2'
      : 'top-full mt-2.5 slide-in-from-top-2';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all border shadow-sm ${
          variant === 'pricing'
            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-400 shadow-md hover:from-pink-600 hover:to-rose-700'
            : 'bg-white/95 hover:bg-rose-50 text-stone-800 border-rose-200 hover:border-pink-300 shadow-xs'
        }`}
        title="Switch Currency & Country"
      >
        <span className="text-sm">{selectedCountry.flag}</span>
        <span className="font-semibold">{selectedCountry.currency} ({selectedCountry.symbol})</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-rose-600" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 w-60 bg-white/95 backdrop-blur-xl rounded-2xl border border-rose-200 shadow-2xl py-2 z-[999] animate-in fade-in ${positionClasses}`}
        >
          <div className="px-3.5 py-2 border-b border-rose-100 flex items-center justify-between text-[10px] font-extrabold text-stone-500 uppercase tracking-wider">
            <span>Select Region & Currency</span>
            <Globe className="w-3.5 h-3.5 text-rose-600" />
          </div>

          <div className="max-h-64 overflow-y-auto py-1 divide-y divide-stone-50">
            {COUNTRY_CURRENCIES.map((country) => {
              const isSelected = selectedCountry.code === country.code;
              return (
                <button
                  key={country.code}
                  onClick={() => {
                    setCountry(country.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-pink-50/90 text-rose-900 font-bold'
                      : 'text-stone-700 hover:bg-rose-50/60 hover:text-rose-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{country.flag}</span>
                    <span className="truncate max-w-[110px]">{country.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold text-rose-600">
                      {country.currency} {country.symbol}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3.5 pt-2 border-t border-rose-100 text-[10px] text-stone-400 leading-tight">
            * Direct settlement for BDT (Local) & USD (International Payments).
          </div>
        </div>
      )}
    </div>
  );
}
