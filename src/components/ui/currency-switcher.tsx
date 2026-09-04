'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, COUNTRY_CURRENCIES } from '@/lib/currency-context';
import { ChevronDown, Globe } from 'lucide-react';

export function CurrencySwitcher({ variant = 'navbar' }: { variant?: 'navbar' | 'pricing' | 'footer' }) {
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs ${
          variant === 'pricing'
            ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-400 shadow-md'
            : 'bg-stone-50 hover:bg-pink-50 text-stone-800 border-stone-200 hover:border-pink-300'
        }`}
        title="Switch Currency & Country"
      >
        <span className="text-sm">{selectedCountry.flag}</span>
        <span>{selectedCountry.currency} ({selectedCountry.symbol})</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-pink-200 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-1.5 border-b border-stone-100 flex items-center justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            <span>Select Region / Currency</span>
            <Globe className="w-3 h-3 text-pink-600" />
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {COUNTRY_CURRENCIES.map((country) => {
              const isSelected = selectedCountry.code === country.code;
              return (
                <button
                  key={country.code}
                  onClick={() => {
                    setCountry(country.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-pink-50 text-pink-800 font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-pink-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-pink-600">
                    {country.currency} {country.symbol}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-3 pt-2 border-t border-stone-100 text-[10px] text-stone-400 leading-tight">
            * SSLCommerz processes BDT (Local) & USD (International Visa/Mastercard).
          </div>
        </div>
      )}
    </div>
  );
}
