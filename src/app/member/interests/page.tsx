'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MemberLayout } from '@/components/member/member-layout';
import { useConnection } from '@/lib/connection-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { MatchSuccessModal } from '@/components/connection/match-success-modal';
import { Heart, Sparkles, CheckCircle2, XCircle, Clock, Ban } from 'lucide-react';
import { MOCK_PROFILES } from '@/data/mock-data';

export default function InterestsPage() {
  const router = useRouter();
  const { interests, acceptInterest, declineInterest, cancelInterest } = useConnection();
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'accepted' | 'rejected'>('received');

  const currentUser = MOCK_PROFILES[0]; // Anika Rahman ('p-101')

  const receivedInterests = interests.filter(
    (i) => i.receiverId === currentUser.id && i.status === 'PENDING'
  );

  const sentInterests = interests.filter(
    (i) => i.senderId === currentUser.id && i.status === 'PENDING'
  );

  const acceptedInterests = interests.filter(
    (i) =>
      (i.senderId === currentUser.id || i.receiverId === currentUser.id) &&
      i.status === 'ACCEPTED'
  );

  const rejectedInterests = interests.filter(
    (i) =>
      (i.senderId === currentUser.id || i.receiverId === currentUser.id) &&
      (i.status === 'REJECTED' || i.status === 'CANCELLED')
  );

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
              <span>Interests & Requests</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Manage express interest requests sent and received from potential matches.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'received'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-rose-50'
            }`}
          >
            Received ({receivedInterests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'sent'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-rose-50'
            }`}
          >
            Sent ({sentInterests.length})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'accepted'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-rose-50'
            }`}
          >
            Accepted ({acceptedInterests.length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'rejected'
                ? 'bg-stone-800 text-white shadow-md'
                : 'bg-stone-100 text-stone-700 hover:bg-rose-50'
            }`}
          >
            Declined ({rejectedInterests.length})
          </button>
        </div>

        {/* Tab Content: Received */}
        {activeTab === 'received' && (
          <div className="space-y-4">
            {receivedInterests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {receivedInterests.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-rose-50 shrink-0 border border-rose-200">
                        <Image
                          src={item.senderProfile.photoUrl}
                          alt={item.senderProfile.fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-lg text-stone-900 truncate">
                          {item.senderProfile.fullName}, {item.senderProfile.age}
                        </h3>
                        <p className="text-xs text-stone-500 truncate">
                          {item.senderProfile.profession} • {item.senderProfile.city}
                        </p>
                        <p className="text-[11px] text-rose-700 font-semibold pt-1">
                          ✨ {item.senderProfile.matchPercentage}% Compatibility Match
                        </p>
                      </div>
                    </div>

                    <div className="bg-rose-50/50 p-3 rounded-2xl border border-rose-100 text-xs text-stone-700 italic">
                      "{item.senderProfile.fullName.split(' ')[0]} is interested in getting to know you for marriage."
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <span className="text-[11px] text-stone-400">Sent {item.createdAt}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => declineInterest(item.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="wine"
                          size="sm"
                          className="text-xs"
                          onClick={() => acceptInterest(item.id)}
                        >
                          Accept Request
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Heart className="w-12 h-12 text-rose-400" />}
                title="No Pending Received Interests"
                description="No one has sent you an interest request yet. Keep your profile updated and complete verification to rank higher."
                actionLabel="Discover Matches"
                onAction={() => router.push('/search')}
              />
            )}
          </div>
        )}

        {/* Tab Content: Sent */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentInterests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sentInterests.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-rose-50 shrink-0 border border-rose-200">
                        <Image
                          src={item.receiverProfile.photoUrl}
                          alt={item.receiverProfile.fullName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-lg text-stone-900 truncate">
                          {item.receiverProfile.fullName}, {item.receiverProfile.age}
                        </h3>
                        <p className="text-xs text-stone-500 truncate">
                          {item.receiverProfile.profession} • {item.receiverProfile.city}
                        </p>
                        <Badge variant="warning" size="sm" className="mt-1">
                          Interest Pending
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="text-stone-400">Sent {item.createdAt}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-stone-500"
                        onClick={() => cancelInterest(item.id)}
                      >
                        Cancel Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Sparkles className="w-12 h-12 text-rose-400" />}
                title="No Pending Sent Interests"
                description="You haven't sent any interest requests. Browse verified candidates and express interest."
                actionLabel="Explore Profiles"
                onAction={() => router.push('/search')}
              />
            )}
          </div>
        )}

        {/* Tab Content: Accepted */}
        {activeTab === 'accepted' && (
          <div className="space-y-4">
            {acceptedInterests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {acceptedInterests.map((item) => {
                  const other =
                    item.senderId === currentUser.id
                      ? item.receiverProfile
                      : item.senderProfile;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-rose-50 shrink-0">
                          <Image
                            src={other.photoUrl}
                            alt={other.fullName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-stone-900 text-base">
                            {other.fullName}, {other.age}
                          </h4>
                          <p className="text-xs text-stone-500">{other.profession}</p>
                          <Badge variant="success" size="sm" className="mt-1">
                            Mutual Match ❤️
                          </Badge>
                        </div>
                      </div>

                      <Link href="/member/matches">
                        <Button variant="wine" size="sm" className="text-xs">
                          View Match
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No Accepted Interests Yet"
                description="When a member accepts your interest request, a mutual match is formed here."
              />
            )}
          </div>
        )}

        {/* Tab Content: Rejected */}
        {activeTab === 'rejected' && (
          <div className="space-y-4">
            {rejectedInterests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rejectedInterests.map((item) => {
                  const other =
                    item.senderId === currentUser.id
                      ? item.receiverProfile
                      : item.senderProfile;
                  return (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-stone-200 text-xs flex items-center justify-between text-stone-500"
                    >
                      <span>{other.fullName}</span>
                      <span className="font-semibold text-stone-700">Declined / Cancelled</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No Declined Interests"
                description="No declined or cancelled requests."
              />
            )}
          </div>
        )}
      </div>

      <MatchSuccessModal />
    </MemberLayout>
  );
}
