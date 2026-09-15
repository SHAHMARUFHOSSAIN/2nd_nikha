'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">💔</div>
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Something went wrong
        </h1>
        <p className="text-sm text-stone-500">
          An unexpected error interrupted this page. Our team has been notified.
        </p>
        <Button variant="wine" size="lg" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}