import React from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { HomeFeaturedProfiles } from '@/components/sections/home-featured-profiles';
import { SuccessStories } from '@/components/sections/success-stories';
import { TrustSafety } from '@/components/sections/trust-safety';
import { MembershipPreview } from '@/components/sections/membership-preview';
import { FinalCta } from '@/components/sections/final-cta';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <HeroSection />

      {/* Why Choose 2nd Chance */}
      <section id="about">
        <WhyChooseUs />
      </section>

      {/* Homepage Featured Profiles Preview (9-12 Cards + See More Matches CTA) */}
      <section id="search">
        <HomeFeaturedProfiles />
      </section>

      {/* Real Success Stories */}
      <section id="stories">
        <SuccessStories />
      </section>

      {/* Trust & Safety Features */}
      <TrustSafety />

      {/* Transparent Membership Comparison */}
      <section id="membership">
        <MembershipPreview />
      </section>

      {/* Final Warm Call to Action */}
      <section id="contact">
        <FinalCta />
      </section>
    </div>
  );
}
