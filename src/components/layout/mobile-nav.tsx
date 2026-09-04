'use client';

import React from 'react';
import Link from 'next/link';
import { NAV_ITEMS, BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between border-l border-rose-100 animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-100">
            <Link href="/" className="flex items-center gap-2" onClick={onClose}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-brand-wine flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-serif font-bold text-xl text-stone-900 tracking-tight">
                {BRAND_NAME}
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="px-4 py-3 rounded-xl text-stone-700 font-medium hover:text-rose-700 hover:bg-rose-50/70 transition-colors text-base"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-stone-100 space-y-3">
          <Button variant="outline" className="w-full justify-center" onClick={onClose}>
            Login
          </Button>
          <Button variant="wine" className="w-full justify-center" onClick={onClose}>
            Register Now
          </Button>

          <p className="text-center text-xs text-stone-600 pt-2 italic">
            "{BRAND_TAGLINE}"
          </p>
        </div>
      </div>
    </div>
  );
}
