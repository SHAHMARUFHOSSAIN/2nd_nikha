'use client';

import React from 'react';
import { MOCK_PROFILES } from '@/data/mock-data';
import { Shield, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminProfileReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>Profile Reviews Moderation Queue</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manual content quality inspection queue for newly updated bio and partner preference descriptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PROFILES.slice(0, 4).map((p) => (
          <div key={p.id} className="bg-stone-900 rounded-3xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-white text-sm">{p.fullName}</h3>
              <span className="text-[10px] font-mono text-stone-400">{p.location}</span>
            </div>
            <p className="text-xs text-stone-300 bg-stone-950 p-3 rounded-2xl border border-stone-800 italic">
              "{p.bio}"
            </p>
            <div className="flex justify-end gap-2">
              <Link href={`/admin/members/${p.id}`}>
                <button className="px-3 py-1 bg-stone-800 text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-700">
                  Inspect Profile
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
