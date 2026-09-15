import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-6xl">💑</div>
        <h1 className="text-4xl font-serif font-extrabold text-stone-900">404</h1>
        <p className="text-sm text-stone-500">
          This page has moved on, but your second chance is still waiting.
        </p>
        <Link href="/" className="inline-block">
          <Button variant="wine" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}