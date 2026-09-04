'use client';

import React from 'react';
import Image from 'next/image';
import { MOCK_PROFILES } from '@/data/mock-data';
import { Shield, Eye, CheckCircle2 } from 'lucide-react';

export default function AdminPhotoReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>Photo Reviews Moderation Queue</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review member uploaded gallery photos to enforce dignity and modesty guidelines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MOCK_PROFILES.map((p) => (
          <div key={p.id} className="bg-stone-900 rounded-3xl p-3 border border-stone-800 space-y-2 text-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
              <Image src={p.photoUrl} alt={p.fullName} fill className="object-cover object-top" />
            </div>
            <span className="font-serif font-bold text-xs text-white block truncate">{p.fullName}</span>
            <button className="w-full py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-[10px] font-bold">
              Approve Photo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
