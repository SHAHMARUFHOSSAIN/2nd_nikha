'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Profile, PhotoPrivacy } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { Lock, Eye, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MembershipPreviewModal } from '@/components/sections/membership-preview-modal';

export interface PhotoGalleryProps {
  profile?: Profile;
  primaryPhoto?: string;
  additionalPhotos?: string[];
  photoPrivacy?: PhotoPrivacy;
  fullName?: string;
}

export function PhotoGallery({
  profile,
  primaryPhoto,
  additionalPhotos = [],
  photoPrivacy,
  fullName,
}: PhotoGalleryProps) {
  const { userRole } = useAuth();
  
  const activePrimary = profile?.photoUrl || primaryPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
  const activeAdditional = profile?.additionalPhotos || additionalPhotos;
  const activePrivacy = profile?.photoPrivacy || photoPrivacy || 'PUBLIC';
  const activeName = profile?.fullName || fullName || 'Member';

  const [selectedPhoto, setSelectedPhoto] = useState(activePrimary);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isLocked =
    activePrivacy === 'PRIVATE' ||
    (activePrivacy === 'PREMIUM_ONLY' && userRole !== 'PREMIUM') ||
    (activePrivacy === 'MATCH_ONLY' && userRole === 'GUEST');

  const allPhotos = [activePrimary, ...activeAdditional];

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-rose-50 border-2 border-rose-100 shadow-md">
        <Image
          src={selectedPhoto}
          alt={activeName}
          fill
          className={`object-cover transition-all duration-500 ${
            isLocked ? 'blur-xl scale-110 opacity-70' : 'blur-0 scale-100'
          }`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Lock Overlay for Private / Premium Photos */}
        {isLocked && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="font-serif font-bold text-lg text-white">
                Photo Gallery Protected
              </p>
              <p className="text-xs text-rose-100 leading-relaxed">
                {photoPrivacy === 'PRIVATE'
                  ? `${fullName.split(' ')[0]} has set their photo gallery to Private.`
                  : photoPrivacy === 'PREMIUM_ONLY'
                  ? 'Private photos are visible exclusively to active Premium members.'
                  : 'Photos unlocked upon mutual interest acceptance.'}
              </p>
            </div>

            {userRole !== 'PREMIUM' && (
              <Button
                variant="wine"
                size="sm"
                className="mt-2 text-xs"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                onClick={() => setIsUpgradeModalOpen(true)}
              >
                Upgrade to Unlock Photos
              </Button>
            )}
          </div>
        )}

        {/* Photo Privacy Badge Indicator */}
        <div className="absolute top-4 left-4">
          <Badge
            variant={isLocked ? 'wine' : 'success'}
            className="shadow-md backdrop-blur bg-white/90 text-stone-900"
          >
            {photoPrivacy === 'PUBLIC'
              ? 'Public Photos'
              : photoPrivacy === 'PREMIUM_ONLY'
              ? 'Premium Members Only'
              : photoPrivacy === 'PRIVATE'
              ? 'Private Gallery'
              : 'Match Only'}
          </Badge>
        </div>
      </div>

      {/* Additional Thumbnails */}
      {allPhotos.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {allPhotos.map((photo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPhoto(photo)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                selectedPhoto === photo
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : 'border-stone-200 hover:border-rose-300'
              }`}
            >
              <Image
                src={photo}
                alt={`Photo ${idx + 1}`}
                fill
                className={`object-cover ${isLocked ? 'blur-md' : ''}`}
              />
            </button>
          ))}
        </div>
      )}

      <MembershipPreviewModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
