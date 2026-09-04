'use client';

import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export function SafetyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-3 px-4 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Safety First:</strong> Take your time getting to know each other. Never send money or share sensitive financial information.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-amber-700 hover:text-amber-950 rounded-full shrink-0"
        aria-label="Dismiss safety advice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
