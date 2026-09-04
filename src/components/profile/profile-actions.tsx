'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useConnection } from '@/lib/connection-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';
import { SendInterestModal } from '@/components/connection/send-interest-modal';
import { ReportModal } from '@/components/connection/report-modal';
import { BlockModal } from '@/components/connection/block-modal';
import { Heart, Star, ShieldAlert, Ban, CheckCircle2, Lock, Sparkles, MessageSquare } from 'lucide-react';
import { MOCK_PROFILES } from '@/data/mock-data';
import { useRouter } from 'next/navigation';

export interface ProfileActionsProps {
  profileId: string;
  fullName: string;
}

export function ProfileActions({ profileId, fullName }: ProfileActionsProps) {
  const router = useRouter();
  const { userRole } = useAuth();
  const { getInterestStatus, isMatched, getMatchByProfileId, isShortlisted, toggleShortlist } = useAuth() as any;
  const connection = useConnection();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSendInterestModalOpen, setIsSendInterestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const profileObj = MOCK_PROFILES.find((p) => p.id === profileId) || MOCK_PROFILES[0];
  const interestStatus = connection.getInterestStatus(profileId);
  const matched = connection.isMatched(profileId);
  const existingMatch = connection.getMatchByProfileId(profileId);

  const handleSendInterestClick = () => {
    if (userRole === 'GUEST' || userRole === 'FREE') {
      setIsUpgradeModalOpen(true);
    } else {
      setIsSendInterestModalOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      {actionNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-stone-400 hover:text-stone-700 text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Actions Row */}
      <div className="flex flex-wrap items-center gap-3">
        {matched ? (
          <Button
            variant="wine"
            size="lg"
            onClick={() => router.push(`/member/messages/${existingMatch?.id || profileId}`)}
            className="flex-1 justify-center shadow-lg shadow-rose-900/20"
            leftIcon={<MessageSquare className="w-5 h-5 fill-white text-white" />}
          >
            Matched ❤️ — Start Chat
          </Button>
        ) : interestStatus === 'PENDING' ? (
          <Button
            variant="secondary"
            size="lg"
            disabled
            className="flex-1 justify-center bg-amber-50 text-amber-800 border-amber-200"
            leftIcon={<Sparkles className="w-4 h-4 text-amber-600" />}
          >
            Interest Pending Response
          </Button>
        ) : (
          <Button
            variant="wine"
            size="lg"
            onClick={handleSendInterestClick}
            className="flex-1 justify-center shadow-lg shadow-rose-900/20"
            leftIcon={
              userRole === 'PREMIUM' ? (
                <Heart className="w-5 h-5 fill-white text-white" />
              ) : (
                <Lock className="w-4 h-4 text-rose-200" />
              )
            }
          >
            {userRole === 'PREMIUM' ? 'Send Interest' : 'Send Interest (Premium)'}
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            toggleShortlist(profileId);
            setActionNotice(`${fullName.split(' ')[0]} shortlist status updated.`);
          }}
          leftIcon={<Star className="w-5 h-5 text-amber-500" />}
        >
          Shortlist
        </Button>
      </div>

      {/* Secondary Moderation Actions */}
      <div className="flex items-center justify-end gap-3 text-xs text-stone-500 pt-2 border-t border-stone-100">
        <button
          onClick={() => setIsReportModalOpen(true)}
          className="flex items-center gap-1 hover:text-stone-800 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-stone-400" />
          <span>Report Profile</span>
        </button>
        <span>•</span>
        <button
          onClick={() => setIsBlockModalOpen(true)}
          className="flex items-center gap-1 hover:text-red-600 transition-colors"
        >
          <Ban className="w-3.5 h-3.5 text-stone-400" />
          <span>Block Profile</span>
        </button>
      </div>

      {/* Modals */}
      <MembershipPreviewModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />

      <SendInterestModal
        isOpen={isSendInterestModalOpen}
        onClose={() => setIsSendInterestModalOpen(false)}
        targetProfile={profileObj}
        onSuccess={() => setActionNotice(`Interest sent to ${fullName.split(' ')[0]}!`)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetUserId={profileId}
        targetUserName={fullName}
      />

      <BlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        targetUserId={profileId}
        targetUserName={fullName}
        onSuccess={() => setActionNotice(`${fullName.split(' ')[0]} has been blocked.`)}
      />
    </div>
  );
}
