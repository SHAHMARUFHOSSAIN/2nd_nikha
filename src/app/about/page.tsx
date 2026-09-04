import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { TrustSafety } from '@/components/sections/trust-safety';
import { BRAND_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Us | ${BRAND_NAME}`,
  description: 'Learn about 2nd Nikah Matrimonial sanctuary, our mission, privacy safeguards, and dedicated matchmakers.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 space-y-12">
      <Container size="xl">
        <SectionHeading
          eyebrow="Our Sacred Mission"
          title="Empowering Dignified Second Chances in Marriage"
          highlightWord="Second Chances"
          subtitle="Built specifically for divorced, widowed, single parents, and mature singles seeking genuine compatibility, trust, and lifelong partnership."
          align="center"
        />
      </Container>

      <WhyChooseUs />
      <TrustSafety />
    </div>
  );
}
