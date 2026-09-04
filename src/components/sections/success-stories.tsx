import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { MOCK_SUCCESS_STORIES } from '@/data/mock-data';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Quote } from 'lucide-react';

export function SuccessStories() {
  return (
    <section id="stories" className="py-20 bg-gradient-to-b from-white via-rose-50/60 to-white relative">
      <Container size="xl">
        <SectionHeading
          eyebrow="Stories of Hope"
          title="Real Couples Who Found Their 2nd Chance"
          highlightWord="Found Their 2nd Chance"
          subtitle="Be inspired by real stories of couples who overcame divorce, widowhood, or single parenthood to discover lifelong joy."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_SUCCESS_STORIES.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl overflow-hidden border border-rose-100/90 shadow-sm shadow-pink-100/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative w-full h-56 bg-rose-50">
                <Image
                  src={story.photoUrl}
                  alt={story.coupleNames}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="font-serif font-bold text-lg">{story.coupleNames}</span>
                  <Badge variant="wine" size="sm" className="bg-white/90 text-brand-wine">
                    {story.marriageYear}
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 font-semibold">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{story.maritalHistory}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                    "{story.headline}"
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed line-clamp-4">
                    {story.storyText}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{story.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
