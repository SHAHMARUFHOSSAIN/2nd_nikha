'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { Badge } from './badge';
import { Button } from './button';
import { VerifiedBadge } from './verified-badge';
import { MapPin, Briefcase, GraduationCap, Sparkles, MessageSquare, Clock } from 'lucide-react';
import { ProfileDetailModal } from '@/components/profile/profile-detail-modal';
import { useCommunication } from '@/lib/communication-context';
import { useConnection } from '@/lib/connection-context';
import { useAuth } from '@/lib/auth-context';

export interface ProfileCardProps {
  profile: Profile;
  onOpenUpgradeModal?: () => void;
}

export function ProfileCard({ profile, onOpenUpgradeModal }: ProfileCardProps) {
  const router = useRouter();
  const communication = useCommunication();
  const { sendInterestRequest, getInterestStatus, isMatched } = useConnection();
  const { currentUser } = useAuth();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isOwnProfile =
    currentUser !== null &&
    (currentUser.id === profile.id ||
      (currentUser.email && profile.email && currentUser.email.toLowerCase() === profile.email.toLowerCase()));

  const interestStatus = getInterestStatus(profile.id);
  const matched = isMatched(profile.id);

  const getMaritalBadgeVariant = (status: Profile['maritalStatus']) => {
    switch (status) {
      case 'Divorced':
        return 'secondary';
      case 'Widowed':
        return 'wine';
      case 'Single Parent':
        return 'default';
      default:
        return 'outline';
    }
  };

  const handleExpressInterest = async () => {
    if (isOwnProfile) {
      router.push('/member/dashboard');
      return;
    }

    if (communication?.startConversationWithProfile) {
      const targetMatchId = communication.startConversationWithProfile(profile);
      router.push(`/member/messages?matchId=${targetMatchId}`);
    } else {
      router.push('/member/messages');
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl sm:rounded-3xl border border-pink-100/90 overflow-hidden shadow-xs hover:shadow-card-hover hover:border-pink-300 transition-all duration-300 flex flex-col h-full">
        {/* Photo Container */}
        <div className="relative w-full h-44 sm:h-64 overflow-hidden bg-pink-50">
          <Image
            src={profile.photoUrl}
            alt={profile.fullName}
            fill
            className="object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/10 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between gap-1">
            <Badge variant={getMaritalBadgeVariant(profile.maritalStatus)} className="text-[9px] sm:text-xs px-2 py-0.5">
              {profile.maritalStatus}
            </Badge>
            {profile.isVerified && <VerifiedBadge showLabel labelText="Verified" className="scale-95 sm:scale-100" />}
          </div>

          {/* Country Tag */}
          <div className="absolute top-10 sm:top-12 left-2 sm:left-3 flex items-center gap-1 bg-stone-950/80 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-white text-[9px] sm:text-[10px] font-bold border border-stone-700 shadow-md">
            <span>{profile.countryFlag || '🇧🇩'}</span>
            <span className="truncate max-w-[80px] sm:max-w-none">{profile.country || 'Bangladesh'}</span>
          </div>

          {/* Bottom Card Image Overlay */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white flex items-end justify-between">
            <div>
              <h3 className="font-serif font-bold text-xs sm:text-lg text-white group-hover:text-pink-200 transition-colors leading-tight">
                {profile.fullName.split(' ')[0]}, {profile.age}
              </h3>
              <p className="text-[10px] sm:text-xs text-stone-200 flex items-center gap-1 truncate max-w-[110px] sm:max-w-none">
                <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400 shrink-0" />
                <span className="truncate">{profile.location}</span>
              </p>
            </div>

            {/* AI Match Percentage Badge */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-0.5 sm:gap-1 shrink-0">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
              <span>{profile.matchPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
          <div className="space-y-1.5 sm:space-y-2">
            {/* Quick Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-[11px] sm:text-xs text-stone-600">
              <div className="flex items-center gap-1 font-medium truncate">
                <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-600 shrink-0" />
                <span className="truncate">{profile.education}</span>
              </div>
              <div className="flex items-center gap-1 font-medium truncate">
                <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-600 shrink-0" />
                <span className="truncate">{profile.profession}</span>
              </div>
            </div>

            {/* Residency Tag */}
            {profile.residencyStatus && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-50 text-pink-900 border border-pink-200 text-[9px] sm:text-[10px] font-bold">
                <span className="truncate">🌍 {profile.residencyStatus}</span>
              </div>
            )}

            {/* Bio snippet */}
            <p className="text-[11px] sm:text-xs text-stone-600 line-clamp-2 italic pt-0.5 leading-snug">
              "{profile.bio}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col xs:flex-row items-center gap-1.5 sm:gap-2 border-t border-stone-100">
            <Button
              variant="wine"
              size="sm"
              className="w-full sm:flex-1 rounded-xl sm:rounded-2xl shadow-xs text-[11px] sm:text-xs py-1.5 sm:py-2 px-2 justify-center font-bold"
              leftIcon={<Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
              onClick={() => setIsDetailOpen(true)}
            >
              View Profile
            </Button>

            {isOwnProfile ? (
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:flex-1 rounded-xl sm:rounded-2xl bg-stone-100 text-stone-600 border border-stone-200 text-[11px] sm:text-xs py-1.5 sm:py-2 px-2 justify-center font-bold"
                onClick={() => router.push('/member/dashboard')}
              >
                Your Profile
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:flex-1 rounded-xl sm:rounded-2xl border-pink-200 hover:border-pink-400 text-pink-800 font-bold text-[11px] sm:text-xs py-1.5 sm:py-2 px-2 justify-center hover:bg-pink-50"
                leftIcon={<MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-pink-600" />}
                onClick={handleExpressInterest}
              >
                Message
              </Button>
            )}
          </div>
        </div>
      </div>

      <ProfileDetailModal
        profile={profile}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
    </>
  );
}
