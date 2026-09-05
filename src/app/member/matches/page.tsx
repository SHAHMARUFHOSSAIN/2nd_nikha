'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MemberLayout } from '@/components/member/member-layout';
import { useConnection } from '@/lib/connection-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { CompatibilityScore } from '@/components/matching/compatibility-score';
import { EmptyState } from '@/components/ui/empty-state';
import { Sparkles, MessageSquare, MapPin, Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { MOCK_PROFILES } from '@/data/mock-data';

export default function MatchesPage() {
  const router = useRouter();
  const { matches } = useConnection();

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-rose-500" />
              <span>My Mutual Matches ({matches.length})</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Active connections formed through mutual interest acceptance. Private chat and verified contacts are unlocked.
            </p>
          </div>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => {
              const p = match?.profile || MOCK_PROFILES[0];
              return (
                <div
                  key={match.id}
                  className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Top Profile Banner */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-rose-50 shrink-0 border-2 border-rose-200 shadow-sm">
                        <Image
                          src={p.photoUrl}
                          alt={p.fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-xl text-stone-900 truncate">
                            {p.fullName}, {p.age}
                          </h3>
                          {p.isVerified && <VerifiedBadge showLabel labelText="Verified" />}
                        </div>

                        <div className="text-xs text-stone-600 space-y-0.5">
                          <p className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{p.location}</span>
                          </p>
                          <p className="flex items-center gap-1.5 truncate">
                            <Briefcase className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{p.profession}</span>
                          </p>
                        </div>

                        <div className="pt-1 flex items-center gap-2">
                          <Badge variant="wine" size="sm">{p.maritalStatus}</Badge>
                          <Badge variant="outline" size="sm">{p.religion}</Badge>
                        </div>
                      </div>
                    </div>

                  {/* Compatibility & Matched Date */}
                  <div className="bg-rose-50/60 p-3.5 rounded-2xl border border-rose-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        {match.compatibilityScore}% Match Compatibility
                      </span>
                      <span className="text-stone-400 font-normal text-[11px]">{match.matchedAt}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-700">
                      {(p.matchReasons || []).slice(0, 4).map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100">
                  <Link href={`/profiles/${p.id}`}>
                    <Button variant="outline" size="sm" className="w-full justify-center">
                      View Profile
                    </Button>
                  </Link>

                  <Link href={`/member/messages/${match.id}`}>
                    <Button
                      variant="wine"
                      size="sm"
                      className="w-full justify-center shadow-md shadow-rose-900/20"
                      leftIcon={<MessageSquare className="w-4 h-4 text-white" />}
                    >
                      Start Conversation
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <EmptyState
            icon={<Sparkles className="w-12 h-12 text-rose-400" />}
            title="No Active Matches Yet"
            description="Your next meaningful connection could be here. Express interest to compatible profiles to form mutual matches."
            actionLabel="Discover Matches"
            onAction={() => router.push('/search')}
          />
        )}
      </div>
    </MemberLayout>
  );
}
