import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlightWord?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  highlightWord,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const alignMap = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={cn('flex flex-col max-w-3xl mb-10', alignMap[align], className)}>
      {eyebrow && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-rose-700 bg-rose-100/80 border border-rose-200/60 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
        {highlightWord && title.includes(highlightWord) ? (
          <>
            {title.split(highlightWord)[0]}
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-brand-wine bg-clip-text text-transparent">
              {highlightWord}
            </span>
            {title.split(highlightWord)[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-base md:text-lg text-stone-600 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
