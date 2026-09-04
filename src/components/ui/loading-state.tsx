import React from 'react';

export function LoadingState({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-rose-100/80 rounded-3xl p-5 space-y-4 shadow-sm"
        >
          <div className="w-full h-56 bg-rose-100/60 rounded-2xl" />
          <div className="flex justify-between items-center">
            <div className="h-6 w-32 bg-stone-200 rounded-md" />
            <div className="h-5 w-16 bg-rose-100 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-stone-100 rounded" />
            <div className="h-4 w-3/4 bg-stone-100 rounded" />
          </div>
          <div className="pt-2 flex gap-2">
            <div className="h-10 w-full bg-stone-100 rounded-full" />
            <div className="h-10 w-full bg-rose-100/60 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
