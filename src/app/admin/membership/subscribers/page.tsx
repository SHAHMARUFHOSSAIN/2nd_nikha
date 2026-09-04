'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_PROFILES } from '@/data/mock-data';
import { Crown, CheckCircle2 } from 'lucide-react';

export default function AdminSubscribersPage() {
  const premiumProfiles = MOCK_PROFILES.filter((p) => p.membershipTier === 'Premium');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span>Premium Subscribers Directory</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Directory of active premium pass holders with active subscription access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {premiumProfiles.map((profile) => (
          <div key={profile.id} className="bg-stone-900 rounded-3xl p-5 border border-stone-800 flex items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-stone-950 border border-stone-700 shrink-0">
                <Image src={profile.photoUrl} alt={profile.fullName} fill className="object-cover object-top" />
              </div>
              <div>
                <Link href={`/admin/members/${profile.id}`} className="font-serif font-bold text-white text-sm hover:text-rose-400">
                  {profile.fullName}
                </Link>
                <span className="text-[10px] text-stone-400 block">{profile.profession} • {profile.location}</span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 shrink-0">
              👑 Active Premium
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
