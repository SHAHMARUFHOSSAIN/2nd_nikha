import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'wine' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center font-medium rounded-full transition-colors leading-none select-none';

  const variants = {
    default: 'bg-pink-100 text-pink-800 border border-pink-200/80 font-bold',
    secondary: 'bg-pink-50 text-pink-700 border border-pink-200/60 font-semibold',
    wine: 'bg-pink-900/10 text-pink-900 border border-pink-800/20 font-bold',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold',
    outline: 'bg-white text-stone-700 border border-stone-200 font-medium',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-[11px]',
    md: 'px-3 py-1.5 text-xs',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
