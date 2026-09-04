import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { SuccessStories } from '@/components/sections/success-stories';
import { BRAND_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Real Success Stories | ${BRAND_NAME}`,
  description: 'Heartwarming real-world remarriage success stories from couples who found love and happiness on 2nd Chance.',
};

export default function StoriesPage() {
  return (
    <div className="min-h-screen py-12 space-y-12">
      <Container size="xl">
        <SectionHeading
          eyebrow="Heartwarming Testimonials"
          title="Inspiring Real Remarriage Success Stories"
          highlightWord="Success Stories"
          subtitle="Read how single parents, divorced, and widowed singles found mutual understanding, respect, and lasting matrimony."
          align="center"
        />
      </Container>

      <SuccessStories />
    </div>
  );
}
