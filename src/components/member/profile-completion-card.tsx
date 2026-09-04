import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export interface ProfileCompletionCardProps {
  percentage?: number;
}

export function ProfileCompletionCard({ percentage = 78 }: ProfileCompletionCardProps) {
  const steps = [
    { label: 'Basic Information', completed: true },
    { label: 'Education & Career', completed: true },
    { label: 'About Me Bio', completed: true },
    { label: 'Add Additional Photos', completed: false },
    { label: 'Complete Partner Preferences', completed: false },
    { label: 'Verify National Identity (NID)', completed: false },
  ];

  return (
    <div className="bg-gradient-to-br from-rose-50/90 via-white to-pink-50/50 rounded-3xl p-6 border border-rose-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Profile Strength
          </span>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Profile {percentage}% Complete
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-800 font-bold font-serif flex items-center justify-center border border-rose-200 text-sm">
          {percentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200/80 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-rose-500 to-brand-wine h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
        {steps.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {item.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-stone-400 shrink-0" />
            )}
            <span className={item.completed ? 'text-stone-800 font-medium' : 'text-stone-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
        <p className="text-xs text-stone-500">Profiles over 90% complete get 3x more interest!</p>
        <Link href="/member/profile">
          <Button
            variant="wine"
            size="sm"
            className="text-xs shadow-sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Complete Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
