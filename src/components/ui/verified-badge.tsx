import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VerifiedBadgeProps {
  showLabel?: boolean;
  labelText?: string;
  variant?: 'shield' | 'circle';
  className?: string;
}

export function VerifiedBadge({
  showLabel = false,
  labelText = 'Verified Member',
  variant = 'shield',
  className,
}: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70',
        className
      )}
      title="Identity & Background Verified by 2nd Chance"
    >
      {variant === 'shield' ? (
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      ) : (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      )}
      {showLabel && <span>{labelText}</span>}
    </span>
  );
}
