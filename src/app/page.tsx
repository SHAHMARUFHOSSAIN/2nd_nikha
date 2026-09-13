'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { VisitorLandingGateway } from '@/components/sections/visitor-landing-gateway';
import { HeroSection } from '@/components/sections/hero-section';
import { HomeFeaturedProfiles } from '@/components/sections/home-featured-profiles';

export default function HomePage() {
  const { isLoggedIn, userRole } = useAuth();
  const isPaidMember = isLoggedIn && (userRole === 'PREMIUM' || userRole === 'ADMIN');

  if (!isPaidMember) {
    return (
      <div className="w-full min-h-screen">
        <VisitorLandingGateway />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Enterprise Hero Section with Admin CMS */}
      <HeroSection />

      {/* Randomly Shuffled Abundant Member Profiles (No Filters) */}
      <section id="profiles">
        <HomeFeaturedProfiles />
      </section>
    </div>
  );
}
