import React from 'react';
import { HeartHandshake } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = <HeartHandshake className="w-12 h-12 text-rose-400" />,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/40 border border-rose-100 rounded-3xl max-w-md mx-auto my-6">
      <div className="p-4 bg-white rounded-full shadow-sm mb-4 border border-rose-100">
        {icon}
      </div>
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 mb-6 leading-relaxed">{description}</p>
      {actionLabel && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
