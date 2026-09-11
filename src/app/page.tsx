'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { VisitorLandingGateway } from '@/components/sections/visitor-landing-gateway';
import { HeroSection } from '@/components/sections/hero-section';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { HomeFeaturedProfiles } from '@/components/sections/home-featured-profiles';
import { SuccessStories } from '@/components/sections/success-stories';
import { TrustSafety } from '@/components/sections/trust-safety';
import { MembershipPreview } from '@/components/sections/membership-preview';
import { FinalCta } from '@/components/sections/final-cta';

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

      {/* Why Choose 2nd Nikha */}
      <section id="about">
        <WhyChooseUs />
      </section>

      {/* Homepage Featured Matches */}
      <section id="search">
        <HomeFeaturedProfiles />
      </section>

      {/* Real Success Stories */}
      <section id="stories">
        <SuccessStories />
      </section>

      {/* Trust & Safety Features */}
      <TrustSafety />

      {/* Membership Comparison */}
      <section id="membership">
        <Suspense fallback={
          <div className="text-center py-12 text-xs font-bold text-stone-400">Loading membership passes...</div>
        }>
          <MembershipPreview />
        </Suspense>
      </section>

      {/* Final Warm Call to Action */}
      <section id="contact">
        <FinalCta />
      </section>
    </div>
  );
}
