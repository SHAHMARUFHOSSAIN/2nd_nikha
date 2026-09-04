import React from 'react';
import type { Metadata } from 'next';
import { FeaturedProfiles } from '@/components/sections/featured-profiles';
import { BRAND_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `AI Match — Smart Matrimonial Search | ${BRAND_NAME}`,
  description: 'AI Match search for verified profiles of divorced, widowed, and single parent singles in Bangladesh.',
};

export default function SearchPage() {
  return (
    <div className="min-h-screen py-6">
      <FeaturedProfiles />
    </div>
  );
}
