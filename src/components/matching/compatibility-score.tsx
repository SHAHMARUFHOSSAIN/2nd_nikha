import React from 'react';
import { Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CompatibilityScoreProps {
  score: number;
  reasons?: string[];
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export function CompatibilityScore({
  score,
  reasons = [],
  size = 'md',
  showDetails = false,
  className,
}: CompatibilityScoreProps) {
  const getScoreColor = (val: number) => {
    if (val >= 90) return 'from-rose-500 to-pink-500 text-white';
    if (val >= 80) return 'from-pink-500 to-rose-400 text-white';
    return 'from-stone-700 to-stone-800 text-white';
  };

  const badgeSizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3.5 py-1 gap-1.5 font-bold',
    lg: 'text-base px-4 py-1.5 gap-2 font-extrabold',
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full bg-gradient-to-r shadow-md font-serif tracking-tight',
            getScoreColor(score),
            badgeSizes[size]
          )}
        >
          <Sparkles className="w-3.5 h-3.5 fill-current shrink-0" />
          <span>{score}% Compatibility Match</span>
        </span>
      </div>

      {showDetails && reasons.length > 0 && (
        <div className="bg-gradient-to-br from-rose-50/70 via-pink-50/40 to-white p-4 rounded-2xl border border-rose-100/90 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-rose-600" />
            Why You & Profile Match ({score}%):
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-rose-100/60 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
