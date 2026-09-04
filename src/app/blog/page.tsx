'use client';

import React from 'react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/ui/section-heading';
import { BRAND_NAME } from '@/lib/constants';
import { useAdmin } from '@/lib/admin-context';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const { cmsArticles } = useAdmin();

  return (
    <div className="min-h-screen py-12 space-y-12 bg-stone-50/50">
      <Container size="xl">
        <SectionHeading
          eyebrow="Matrimonial Insights & Guidance"
          title="Articles & Remarriage Advice Blog"
          highlightWord="Advice Blog"
          subtitle="Expert articles on navigating second marriages, co-parenting harmony, family acceptance, and matrimonial safety."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {cmsArticles.map((art) => (
            <article key={art.id} className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-pink-100 text-pink-800 border border-pink-200">
                  {art.category}
                </span>
                <h3 className="font-serif font-bold text-xl text-stone-900 leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-pink-500" />
                  <span>{art.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  <span>{art.publishedAt}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
