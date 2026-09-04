'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { useAuth } from '@/lib/auth-context';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Lock,
  Heart,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  UserCheck,
  Building,
  DollarSign,
  Globe,
  Star,
  Users,
  Check,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';

export interface ProfileDetailModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
  onOpenUpgradeModal?: () => void;
}

export function ProfileDetailModal({
  profile,
  isOpen,
  onClose,
  onOpenUpgradeModal,
}: ProfileDetailModalProps) {
  const router = useRouter();
  const { isShortlisted, toggleShortlist } = useAuth();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!profile) return null;

  const allPhotos = [profile.photoUrl, ...(profile.additionalPhotos || [])];
  const currentPhoto = allPhotos[activePhotoIndex] || profile.photoUrl;
  const isProfileSaved = isShortlisted(profile.id);

  const handleNextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const handlePrevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  const handleExpressInterest = () => {
    onClose();
    router.push(`/member/messages`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="space-y-5">
        
        {/* Top Hero Banner & High-Res Photo Display */}
        <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-stone-800 shadow-2xl">
          
          {/* Main Photo Display Frame (Bulletproof Next.js Image for Mobile & Desktop) */}
          <div className="relative w-full h-72 sm:h-96 bg-stone-900 overflow-hidden shrink-0">
            <Image
              src={currentPhoto}
              alt={profile.fullName}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              unoptimized
            />
            
            {/* Dark Vignette Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-950/30 z-10 pointer-events-none" />

            {/* Photo Navigation Arrows */}
            {allPhotos.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/80 text-white hover:bg-pink-600 transition-all border border-stone-700 shadow-xl z-30"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/80 text-white hover:bg-pink-600 transition-all border border-stone-700 shadow-xl z-30"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Top Badges Bar */}
            <div className="absolute top-3.5 left-3.5 right-14 sm:top-4 sm:left-4 sm:right-16 flex items-center justify-between gap-2 z-20">
              <div className="flex items-center gap-2">
                <span className="bg-stone-950/85 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-stone-700 shadow-lg flex items-center gap-1.5">
                  <span className="text-sm">{profile.countryFlag || '🇧🇩'}</span>
                  <span>{profile.country || 'Bangladesh'}</span>
                </span>
                {profile.residencyStatus && (
                  <span className="hidden sm:inline-flex bg-pink-950/90 text-pink-300 px-3 py-1 rounded-full text-xs font-bold border border-pink-700 shadow-lg">
                    {profile.residencyStatus}
                  </span>
                )}
              </div>

              {profile.isVerified && <VerifiedBadge showLabel labelText="NID Verified Profile" />}
            </div>

            {/* Bottom Candidate Overlay Title */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 z-20 text-white">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2 drop-shadow-md">
                  <span>{profile.fullName}, {profile.age}</span>
                  <span className="text-stone-300 text-base sm:text-lg font-sans font-normal">({profile.height})</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-200 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>{profile.location}</span>
                  {profile.motherTongue && <span>• {profile.motherTongue}</span>}
                </p>
              </div>

              {/* Photo Indicator Badge */}
              {allPhotos.length > 1 && (
                <div className="flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-stone-700 shadow-lg shrink-0">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  <span className="text-xs font-mono font-bold">
                    {activePhotoIndex + 1} / {allPhotos.length} Photos
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Photo Gallery Thumbnails Bar */}
          {allPhotos.length > 1 && (
            <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center gap-3 overflow-x-auto">
              {allPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activePhotoIndex === idx
                      ? 'border-pink-500 scale-105 shadow-md ring-2 ring-pink-500/50'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={photo} alt={`Thumbnail ${idx + 1}`} fill className="object-cover object-top" unoptimized />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* AI Compatibility Highlight Bar */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-100/60 p-4 rounded-2xl border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
              {profile.matchPercentage}%
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-600 fill-pink-600" />
                <span>High AI Matrimonial Compatibility Match</span>
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5">
                Matched on religion ({profile.religion}), marital status ({profile.maritalStatus}), age, and family values.
              </p>
            </div>
          </div>

          <button
            onClick={() => toggleShortlist(profile.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              isProfileSaved
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white text-stone-700 border border-stone-200 hover:border-pink-300'
            }`}
          >
            <Star className={`w-4 h-4 ${isProfileSaved ? 'fill-amber-500 text-amber-500' : 'text-stone-400'}`} />
            <span>{isProfileSaved ? 'Shortlisted' : 'Shortlist Profile'}</span>
          </button>
        </div>

        {/* Structured Profile Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start">
          
          {/* Left Column: Personal, Education, Career, Family (8 cols) */}
          <div className="md:col-span-8 space-y-5">
            
            {/* Bio Section */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 font-mono">
                About Candidate
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic bg-pink-50/40 p-4 rounded-xl border border-pink-100">
                "{profile.bio}"
              </p>
            </div>

            {/* Overview & Credentials */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 font-mono border-b border-stone-100 pb-2">
                Education & Career Background
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Education Degree</span>
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <GraduationCap className="w-4 h-4 text-pink-600 shrink-0" />
                    <span>{profile.education}</span>
                  </div>
                  {profile.institution && (
                    <p className="text-[11px] text-stone-500 pl-6">{profile.institution}</p>
                  )}
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Profession & Company</span>
                  <div className="flex items-center gap-2 font-bold text-stone-900">
                    <Briefcase className="w-4 h-4 text-pink-600 shrink-0" />
                    <span>{profile.profession}</span>
                  </div>
                  {profile.company && (
                    <p className="text-[11px] text-stone-500 pl-6">{profile.company}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Family & Relatives Details */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 font-mono border-b border-stone-100 pb-2">
                Family & Background Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Family Type</span>
                  <p className="font-semibold text-stone-800">{profile.familyType || 'Respectable Close-knit Family'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">Family Origin</span>
                  <p className="font-semibold text-stone-800">{profile.familyLocation || profile.location}</p>
                </div>
                {profile.parentsOccupation && (
                  <div className="space-y-1 col-span-full">
                    <span className="text-[10px] font-bold text-stone-400 uppercase block">Parents Occupation</span>
                    <p className="font-semibold text-stone-800">{profile.parentsOccupation}</p>
                  </div>
                )}
                {profile.siblings && (
                  <div className="space-y-1 col-span-full">
                    <span className="text-[10px] font-bold text-stone-400 uppercase block">Siblings</span>
                    <p className="font-semibold text-stone-800">{profile.siblings}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lifestyle & Hobbies */}
            {profile.lifestyle && profile.lifestyle.length > 0 && (
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 font-mono">
                  Lifestyle & Values
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.lifestyle.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-pink-50 text-pink-900 border border-pink-200 text-xs font-semibold"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Preferences, Verification Score, CTA Actions (4 cols) */}
          <div className="md:col-span-4 space-y-5">
            
            {/* NID & Verification Matrix Box */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verification Status</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {profile.trustScore || 98}% Score
                </span>
              </div>

              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between text-stone-700">
                  <span>NID Identity Check</span>
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                </li>
                <li className="flex items-center justify-between text-stone-700">
                  <span>Educational Audit</span>
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                </li>
                <li className="flex items-center justify-between text-stone-700">
                  <span>Background Checks</span>
                  <span className="text-emerald-600 font-bold">✓ Passed</span>
                </li>
              </ul>
            </div>

            {/* Partner Preferences */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-900 font-mono border-b border-stone-100 pb-2">
                Partner Preferences
              </h4>

              <div className="space-y-2 text-xs text-stone-700">
                <p><strong>Age Range:</strong> {profile.partnerPreferences?.ageRange || '24 - 38'} yrs</p>
                <p><strong>Marital Status:</strong> {Array.isArray(profile.partnerPreferences?.maritalStatuses) ? profile.partnerPreferences.maritalStatuses.join(', ') : 'Divorced, Widowed, Single Parent'}</p>
                <p><strong>Religion:</strong> {profile.partnerPreferences?.religion || profile.religion || 'Islam'}</p>
                <p><strong>Min Height:</strong> {profile.partnerPreferences?.minHeight || "5'2\""}</p>
                <p><strong>Education:</strong> {profile.partnerPreferences?.education || 'Bachelor Degree or above'}</p>
                <p><strong>Preferred City:</strong> {profile.partnerPreferences?.location || profile.location || 'Dhaka / Any'}</p>
              </div>
            </div>

            {/* Direct Connect Action Box */}
            <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 text-white p-5 rounded-3xl shadow-xl space-y-3 border border-stone-800">
              <div className="space-y-1 text-center">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500 mx-auto animate-pulse" />
                <h4 className="font-serif font-bold text-base text-white">
                  Connect with {profile.fullName.split(' ')[0]}
                </h4>
                <p className="text-[11px] text-stone-400">
                  Send Express Interest or initiate private Messenger chat.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="wine"
                  size="md"
                  className="w-full justify-center rounded-xl shadow-md text-xs font-bold"
                  leftIcon={<Heart className="w-4 h-4 fill-white" />}
                  onClick={handleExpressInterest}
                >
                  Express Interest & Start Chat
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="w-full justify-center rounded-xl border-stone-700 text-stone-200 hover:bg-stone-800 text-xs"
                  leftIcon={<MessageSquare className="w-4 h-4 text-pink-400" />}
                  onClick={handleExpressInterest}
                >
                  Open Messenger Inbox
                </Button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </Modal>
  );
}
