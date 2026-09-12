'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { Badge } from './badge';
import { Button } from './button';
import { VerifiedBadge } from './verified-badge';
import { MapPin, Briefcase, GraduationCap, Heart, Users, Sparkles, Lock, Globe, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
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

    if (matched || interestStatus === 'ACCEPTED') {
      if (communication?.startConversationWithProfile) {
        const targetMatchId = communication.startConversationWithProfile(profile);
        router.push(`/member/messages?matchId=${targetMatchId}`);
      } else {
        router.push('/member/messages');
      }
      return;
    }

    if (interestStatus === 'SENT' || interestStatus === 'PAYMENT_PENDING') {
      setNotice(`Interest request already sent to ${profile.fullName}. Chat opens after acceptance.`);
      setTimeout(() => setNotice(null), 4000);
      return;
    }

    // Send Interest Request
    const res = await sendInterestRequest(profile);
    if (res.success && res.redirectUrl) {
      router.push(res.redirectUrl);
    } else {
      setNotice(`Interest request sent to ${profile.fullName}! Chat will open once accepted.`);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-3xl border border-pink-100/90 overflow-hidden shadow-sm shadow-pink-100/50 hover:shadow-card-hover hover:border-pink-300 transition-all duration-300 flex flex-col h-full">
        {/* Photo Container */}
        <div className="relative w-full h-64 overflow-hidden bg-pink-50">
          <Image
            src={profile.photoUrl}
            alt={profile.fullName}
            fill
            className="object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <Badge variant={getMaritalBadgeVariant(profile.maritalStatus)}>
              {profile.maritalStatus}
            </Badge>
            {profile.isVerified && <VerifiedBadge showLabel labelText="Verified" />}
          </div>

          {/* Country & Residency Tag */}
          <div className="absolute top-12 left-3 flex items-center gap-1.5 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold border border-stone-700 shadow-md">
            <span>{profile.countryFlag || '🇧🇩'}</span>
            <span>{profile.country || 'Bangladesh'}</span>
          </div>

          {/* Bottom Card Image Overlay */}
          <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-white group-hover:text-pink-200 transition-colors">
                {profile.fullName.split(' ')[0]}, {profile.age}
              </h3>
              <p className="text-xs text-stone-200 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
                <span>{profile.location}</span>
              </p>
            </div>

            {/* AI Match Percentage Badge */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>{profile.matchPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            {/* Notice Toast inside card if triggered */}
            {notice && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[11px] font-semibold animate-in fade-in flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{notice}</span>
              </div>
            )}

            {/* Quick Details */}
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-medium truncate">
                <GraduationCap className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span className="truncate">{profile.education}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium truncate">
                <Briefcase className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                <span className="truncate">{profile.profession}</span>
              </div>
            </div>

            {/* Residency Tag */}
            {profile.residencyStatus && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-900 border border-pink-200 text-[10px] font-bold">
                <span>🌍 {profile.residencyStatus}</span>
              </div>
            )}

            {/* Bio snippet */}
            <p className="text-xs text-stone-600 line-clamp-2 italic pt-1">
              "{profile.bio}"
            </p>

            {/* Why Match snippet */}
            {profile.matchReasons && profile.matchReasons.length > 0 && (
              <div className="mt-3.5 p-2.5 bg-pink-50/70 rounded-2xl border border-pink-100 space-y-1">
                <div className="text-[10px] uppercase font-bold text-pink-800 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  <span>AI Compatibility Highlights:</span>
                </div>
                <p className="text-[11px] text-stone-700 font-medium line-clamp-2 leading-tight">
                  {profile.matchReasons.slice(0, 2).join(' • ')}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-2xl border-stone-200 hover:border-pink-300 text-xs"
              onClick={() => setIsDetailOpen(true)}
            >
              View Full Profile
            </Button>

            {isOwnProfile ? (
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 rounded-2xl bg-stone-100 text-stone-600 border border-stone-200 text-xs justify-center font-bold"
                onClick={() => router.push('/member/dashboard')}
              >
                Your Profile
              </Button>
            ) : matched || interestStatus === 'ACCEPTED' ? (
              <Button
                variant="wine"
                size="sm"
                className="flex-1 rounded-2xl shadow-sm text-xs justify-center"
                leftIcon={<MessageSquare className="w-3.5 h-3.5 text-white" />}
                onClick={handleExpressInterest}
              >
                Chat Now
              </Button>
            ) : interestStatus === 'SENT' || interestStatus === 'PAYMENT_PENDING' ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-2xl border-amber-300 bg-amber-50/80 text-amber-900 text-xs justify-center font-semibold"
                leftIcon={<Clock className="w-3.5 h-3.5 text-amber-600" />}
                onClick={handleExpressInterest}
              >
                Request Pending
              </Button>
            ) : (
              <Button
                variant="wine"
                size="sm"
                className="flex-1 rounded-2xl shadow-sm text-xs justify-center"
                leftIcon={<Heart className="w-3.5 h-3.5 fill-white" />}
                onClick={handleExpressInterest}
              >
                Express Interest
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
