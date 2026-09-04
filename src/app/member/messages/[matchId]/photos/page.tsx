'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MemberLayout } from '@/components/member/member-layout';
import { useConnection } from '@/lib/connection-context';
import { useCommunication } from '@/lib/communication-context';
import { ChatAccessGuard } from '@/components/communication/chat-access-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ImageIcon, ArrowLeft, Trash2, ShieldCheck, Lock } from 'lucide-react';
import { MOCK_PROFILES } from '@/data/mock-data';

interface SharedPhotosPageProps {
  params: {
    matchId: string;
  };
}

export default function SharedPhotosPage({ params }: SharedPhotosPageProps) {
  const { matches } = useConnection();
  const { sharedPhotos, deletePhoto } = useCommunication();

  const match = matches.find((m) => m.id === params.matchId || m.userTwoId === params.matchId);
  const matchedProfile = match ? match.profile : MOCK_PROFILES.find((p) => p.id === params.matchId);

  if (!matchedProfile) {
    notFound();
  }

  const activeMatch = match && match.status === 'ACTIVE';
  const photosList = sharedPhotos[match?.matchId || params.matchId] || [];

  return (
    <MemberLayout>
      <ChatAccessGuard
        profile={matchedProfile}
        isMutualMatch={!!activeMatch}
        matchStatus={match?.status}
      >
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
            <div>
              <Link
                href={`/member/messages/${match?.matchId || params.matchId}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Conversation</span>
              </Link>
              <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
                <ImageIcon className="w-7 h-7 text-rose-500" />
                <span>Shared Photos Gallery</span>
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Private photos shared between you and {matchedProfile.fullName}.
              </p>
            </div>
          </div>

          {photosList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {photosList.map((photo) => {
                const isOwnPhoto = photo.senderId === 'p-101';
                return (
                  <div
                    key={photo.id}
                    className="bg-white rounded-3xl overflow-hidden border border-rose-100/90 shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-[4/3] bg-rose-50">
                      <Image src={photo.url} alt="Shared Photo" fill className="object-cover" />
                    </div>

                    <div className="p-4 flex items-center justify-between text-xs text-stone-600 border-t border-stone-100">
                      <div>
                        <span className="font-semibold text-stone-900 block">
                          {isOwnPhoto ? 'Shared by You' : `Shared by ${matchedProfile.fullName.split(' ')[0]}`}
                        </span>
                        <span className="text-[10px] text-stone-400">{photo.createdAt}</span>
                      </div>

                      {isOwnPhoto && (
                        <button
                          onClick={() => deletePhoto(match?.matchId || params.matchId, photo.id)}
                          className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete My Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<ImageIcon className="w-12 h-12 text-rose-400" />}
              title="No Shared Photos Yet"
              description={`You and ${matchedProfile.fullName.split(' ')[0]} haven't shared any private photos in this chat yet.`}
              actionLabel="Return to Conversation"
              onAction={() => router.push(`/member/messages/${match?.matchId || params.matchId}`)}
            />
          )}
        </div>
      </ChatAccessGuard>
    </MemberLayout>
  );
}
