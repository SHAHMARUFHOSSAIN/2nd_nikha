'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { checkChatPermission } from '@/lib/connection-permissions';
import { Profile, MatchStatus } from '@/types';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';
import { Lock, Crown, ShieldAlert, Sparkles, LogIn, Heart, ArrowLeft } from 'lucide-react';
import { MOCK_PROFILES } from '@/data/mock-data';

export interface ChatAccessGuardProps {
  profile?: Profile;
  matchedProfileName?: string;
  matchId?: string;
  isMutualMatch: boolean;
  matchStatus?: MatchStatus;
  isBlocked?: boolean;
  children: React.ReactNode;
}

export function ChatAccessGuard({
  profile,
  matchedProfileName,
  isMutualMatch,
  matchStatus,
  isBlocked,
  children,
}: ChatAccessGuardProps) {
  const { userRole } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const check = checkChatPermission(userRole, isMutualMatch, matchStatus, isBlocked);

  const displayProfile = profile || MOCK_PROFILES[0];
  const nameToUse = matchedProfileName || displayProfile.fullName;

  if (!check.allowed) {
    const firstName = nameToUse.split(' ')[0];

    return (
      <div className="bg-stone-50/50 py-12 min-h-[70vh] flex items-center justify-center">
        <Container size="sm">
          <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-xl text-center space-y-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto bg-rose-50">
              <Image
                src={displayProfile.photoUrl}
                alt={nameToUse}
                fill
                className="object-cover blur-sm"
              />
              <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center text-white">
                <Lock className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-1 text-xs font-bold text-rose-800">
                <Sparkles className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                <span>{displayProfile.matchPercentage}% Compatibility Match</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                {check.reason === 'PREMIUM_REQUIRED'
                  ? 'Premium Membership Required'
                  : 'Conversation Locked'}
              </h2>
              <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                {check.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => (window.location.href = '/member/messages')}
                className="px-4 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Inbox</span>
              </button>

              {check.reason === 'PREMIUM_REQUIRED' && (
                <Button
                  variant="wine"
                  size="sm"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="rounded-full shadow-md px-6"
                  leftIcon={<Crown className="w-4 h-4 text-white" />}
                >
                  Upgrade to Premium
                </Button>
              )}
            </div>

            <MembershipPreviewModal
              isOpen={isUpgradeModalOpen}
              onClose={() => setIsUpgradeModalOpen(false)}
            />
          </div>
        </Container>
      </div>
    );
  }

  return <>{children}</>;
}
