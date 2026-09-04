import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  labelText?: string;
  variant?: 'shield' | 'circle';
  className?: string;
}

export function VerifiedBadge({
  size = 'md',
  showLabel = false,
  labelText = 'Verified Member',
  variant = 'shield',
  className,
}: VerifiedBadgeProps) {
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70',
        className
      )}
      title="Identity & Background Verified by 2nd Nikah"
    >
      {variant === 'shield' ? (
        <ShieldCheck className={cn(iconSizes[size], 'text-emerald-600 shrink-0')} />
      ) : (
        <CheckCircle2 className={cn(iconSizes[size], 'text-emerald-600 shrink-0')} />
      )}
      {showLabel && <span>{labelText}</span>}
    </span>
  );
}
