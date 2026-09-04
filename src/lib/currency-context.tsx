'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CountryCurrency {
  code: string;
  name: string;
  flag: string;
  currency: 'BDT' | 'USD';
  symbol: string;
  rateToUSD: number; // Conversion multiplier from BDT to USD (e.g. 1 BDT = ~0.0083 USD or 120 BDT = 1 USD)
}

export const COUNTRY_CURRENCIES: CountryCurrency[] = [
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currency: 'BDT', symbol: '৳', rateToUSD: 1 },
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$', rateToUSD: 0.0083 },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', currency: 'USD', symbol: '$', rateToUSD: 0.0083 },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'USD', symbol: '$', rateToUSD: 0.0083 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'USD', symbol: '$', rateToUSD: 0.0083 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'USD', symbol: '$', rateToUSD: 0.0083 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', currency: 'USD', symbol: '$', rateToUSD: 0.0083 },
  { code: 'EU', name: 'Europe', flag: '🇪🇺', currency: 'USD', symbol: '$', rateToUSD: 0.0083 },
];

interface CurrencyContextType {
  selectedCountry: CountryCurrency;
  currency: 'BDT' | 'USD';
  setCountry: (countryCode: string) => void;
  toggleCurrency: () => void;
  formatAmount: (bdtAmount: number, usdAmount?: number) => string;
  getNumericAmount: (bdtAmount: number, usdAmount?: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType>({
  selectedCountry: COUNTRY_CURRENCIES[0],
  currency: 'BDT',
  setCountry: () => {},
  toggleCurrency: () => {},
  formatAmount: (bdt) => `৳${bdt}`,
  getNumericAmount: (bdt) => bdt,
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCurrency>(COUNTRY_CURRENCIES[0]);

  // Load user saved currency or default to BDT
  useEffect(() => {
    const saved = localStorage.getItem('user_country_currency');
    if (saved) {
      const found = COUNTRY_CURRENCIES.find((c) => c.code === saved);
      if (found) setSelectedCountry(found);
    }
  }, []);

  const setCountry = (countryCode: string) => {
    const found = COUNTRY_CURRENCIES.find((c) => c.code === countryCode);
    if (found) {
      setSelectedCountry(found);
      localStorage.setItem('user_country_currency', found.code);
    }
  };

  const toggleCurrency = () => {
    const next = selectedCountry.currency === 'BDT' ? COUNTRY_CURRENCIES[1] : COUNTRY_CURRENCIES[0];
    setSelectedCountry(next);
    localStorage.setItem('user_country_currency', next.code);
  };

  const formatAmount = (bdtAmount: number, usdAmount?: number): string => {
    if (selectedCountry.currency === 'BDT') {
      return `৳${bdtAmount.toLocaleString('en-BD')}`;
    }
    const val = usdAmount !== undefined ? usdAmount : Math.round(bdtAmount * selectedCountry.rateToUSD * 100) / 100;
    return `$${val.toFixed(2)}`;
  };

  const getNumericAmount = (bdtAmount: number, usdAmount?: number): number => {
    if (selectedCountry.currency === 'BDT') return bdtAmount;
    return usdAmount !== undefined ? usdAmount : Math.round(bdtAmount * selectedCountry.rateToUSD * 100) / 100;
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCountry,
        currency: selectedCountry.currency,
        setCountry,
        toggleCurrency,
        formatAmount,
        getNumericAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
