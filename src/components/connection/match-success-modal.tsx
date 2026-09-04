'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useConnection } from '@/lib/connection-context';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { MOCK_PROFILES } from '@/data/mock-data';

export function MatchSuccessModal() {
  const router = useRouter();
  const { activeMatchModal, closeMatchModal } = useConnection();

  if (!activeMatchModal) return null;

  const currentUser = MOCK_PROFILES[0]; // Anika Rahman
  const matchedUser = activeMatchModal.profile;

  const handleStartChat = () => {
    closeMatchModal();
    router.push(`/member/messages/${activeMatchModal.id}`);
  };

  return (
    <Modal isOpen={!!activeMatchModal} onClose={closeMatchModal} maxWidth="md">
      <div className="text-center space-y-6 py-2">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-md">
          <Sparkles className="w-4 h-4 fill-white" />
          <span>It's a Mutual Match! ❤️</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-3xl font-serif font-extrabold text-stone-900">
            You & {matchedUser.fullName.split(' ')[0]} Connected!
          </h2>
          <p className="text-xs text-stone-600 max-w-xs mx-auto">
            You both expressed interest in getting to know each other. Direct messaging, photo access, and contact details are now unlocked.
          </p>
        </div>

        {/* Dual Avatars Circle */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-rose-50">
            <Image
              src={currentUser.photoUrl}
              alt={currentUser.fullName}
              fill
              className="object-cover"
            />
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-brand-wine text-white flex items-center justify-center shadow-lg shrink-0 animate-pulse">
            <Heart className="w-5 h-5 fill-white" />
          </div>

          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-rose-50">
            <Image
              src={matchedUser.photoUrl}
              alt={matchedUser.fullName}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Compatibility Score Banner */}
        <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-xs font-bold text-rose-800 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>{activeMatchModal.compatibilityScore}% Compatibility Match</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            variant="wine"
            size="lg"
            onClick={handleStartChat}
            className="w-full justify-center shadow-lg shadow-rose-900/20"
            leftIcon={<MessageSquare className="w-5 h-5 text-white" />}
          >
            Start Conversation Now
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={closeMatchModal}
            className="w-full justify-center text-stone-500 hover:text-stone-800"
          >
            Continue Exploring
          </Button>
        </div>
      </div>
    </Modal>
  );
}
