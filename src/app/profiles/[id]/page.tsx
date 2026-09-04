'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { PhotoGallery } from '@/components/profile/photo-gallery';
import { ProfileActions } from '@/components/profile/profile-actions';
import { MOCK_PROFILES } from '@/data/mock-data';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  BookOpen,
  User,
  Home,
  Coffee,
  Sparkles,
} from 'lucide-react';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfileDetailPage({ params }: ProfilePageProps) {
  const profile = MOCK_PROFILES.find((p) => p.id === params.id) || MOCK_PROFILES[0];

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50/50 pt-6 sm:pt-10 pb-16">
      <Container size="lg" className="space-y-8">
        {/* Top Profile Header Card (Fixed Photo Top Alignment) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-lg space-y-6 mt-2">
          <div className="flex flex-col md:flex-row items-start gap-6 pb-6 border-b border-stone-100">
            {/* Main Avatar / Photo (Fixed top object position so face/head is never cut off) */}
            <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-3xl overflow-hidden bg-rose-50 border-4 border-rose-200 shadow-md shrink-0 mx-auto md:mx-0">
              <Image
                src={profile.photoUrl}
                alt={profile.fullName}
                fill
                className="object-cover object-top"
                priority
              />
            </div>

            <div className="flex-1 space-y-3 text-center md:text-left w-full">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="font-serif font-bold text-3xl text-stone-900">
                  {profile.fullName}, {profile.age}
                </h1>
                {profile.isVerified && <VerifiedBadge showLabel labelText="100% NID Verified" />}
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="wine" size="md">{profile.maritalStatus}</Badge>
                <Badge variant="outline" size="md">{profile.religion}</Badge>
                <Badge variant="outline" size="md">Height: {profile.height}</Badge>
                {profile.hasChildren && (
                  <Badge variant="secondary" size="md">
                    Single Parent ({profile.childrenCount || 1} child)
                  </Badge>
                )}
              </div>

              <div className="text-xs text-stone-600 space-y-1">
                <p className="flex items-center justify-center md:justify-start gap-1.5 font-medium">
                  <Briefcase className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{profile.profession} {profile.company ? `at ${profile.company}` : ''}</span>
                </p>
                <p className="flex items-center justify-center md:justify-start gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{profile.location}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <ProfileActions profileId={profile.id} fullName={profile.fullName} />
              </div>
            </div>
          </div>

          {/* Compatibility Breakdown Banner */}
          <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 p-5 rounded-2xl border border-rose-200/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 text-white font-serif font-bold text-xl flex items-center justify-center shadow-md shrink-0">
              {profile.matchPercentage}%
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-serif font-bold text-stone-900 text-base">
                Compatibility Match with {profile.fullName.split(' ')[0]}
              </h4>
              <p className="text-xs text-stone-600">
                {profile.matchReasons.map((r, i) => `✓ ${r}`).join(' • ')}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: ABOUT MYSELF */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-rose-100 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-600" />
            <span>About Myself</span>
          </h3>
          <p className="text-stone-700 text-sm leading-relaxed bg-stone-50/80 p-5 rounded-2xl border border-stone-100">
            "{profile.bio}"
          </p>
        </div>

        {/* SECTION 2: BASIC & PERSONAL DETAILS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-rose-100 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-rose-600" />
            <span>Basic & Personal Details</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Age</span>
              <strong className="text-stone-900 text-sm">{profile.age} Years</strong>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Marital Status</span>
              <strong className="text-stone-900 text-sm">{profile.maritalStatus}</strong>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Children</span>
              <strong className="text-stone-900 text-sm">
                {profile.hasChildren ? `1 Daughter (Living with Mother)` : 'None'}
              </strong>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Height</span>
              <strong className="text-stone-900 text-sm">{profile.height}</strong>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Religion</span>
              <strong className="text-stone-900 text-sm">{profile.religion}</strong>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Mother Tongue</span>
              <strong className="text-stone-900 text-sm">{profile.motherTongue || 'Bengali'}</strong>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Blood Group</span>
              <strong className="text-stone-900 text-sm">B+ Positive</strong>
            </div>
            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
              <span className="text-stone-500 font-bold uppercase block text-[10px]">Complexion</span>
              <strong className="text-stone-900 text-sm">Fair</strong>
            </div>
          </div>
        </div>

        {/* Photos Gallery View */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100/90 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-stone-900 border-b border-rose-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" />
            <span>Private Photos & Gallery</span>
          </h3>
          <PhotoGallery profile={profile} />
        </div>

      </Container>
    </div>
  );
}
