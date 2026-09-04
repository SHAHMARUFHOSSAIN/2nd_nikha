'use client';

import React, { useState } from 'react';
import { MemberLayout } from '@/components/member/member-layout';
import { ProfileCompletionCard } from '@/components/member/profile-completion-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { MOCK_PROFILES } from '@/data/mock-data';
import { Heart, Edit, Save, CheckCircle2, Lock, ShieldCheck, Upload } from 'lucide-react';
import Image from 'next/image';

export default function MemberProfilePage() {
  const profile = MOCK_PROFILES[0]; // Anika Rahman
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl);
  const [bio, setBio] = useState(profile.bio);
  const [profession, setProfession] = useState(profile.profession);
  const [education, setEducation] = useState(profile.education);
  const [city, setCity] = useState(profile.city);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          setSavedNotice(true);
          setTimeout(() => setSavedNotice(false), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <MemberLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">
              My Profile & Attributes
            </h1>
            <p className="text-xs text-stone-600">
              Manage your personal information, public bio, photos, and partner expectations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <Button
                variant="wine"
                size="sm"
                onClick={handleSave}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                leftIcon={<Edit className="w-4 h-4 text-rose-500" />}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {savedNotice && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* Profile Strength Widget */}
        <ProfileCompletionCard percentage={78} />

        {/* Live Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-32 h-32 rounded-3xl overflow-hidden bg-rose-50 border-2 border-rose-200 shrink-0 shadow-md group cursor-pointer"
            title="Click to upload profile photo from your device"
          >
            <Image
              src={photoUrl}
              alt={profile.fullName}
              fill
              className="object-cover object-top"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[11px] font-bold gap-1">
              <Upload className="w-6 h-6" />
              <span>Upload Photo</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                {profile.fullName}, {profile.age}
              </h2>
              <VerifiedBadge showLabel labelText="NID Verified" />
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="wine">{profile.maritalStatus}</Badge>
              <Badge variant="outline">{profile.religion}</Badge>
              <Badge variant="outline">{profile.height}</Badge>
            </div>

            <p className="text-xs text-stone-600">
              {profile.profession} • {profile.education}
            </p>
          </div>
        </div>

        {/* Editable About Me Bio */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2">
            Public Bio / About Myself
          </h3>

          {isEditing ? (
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-rose-400"
            />
          ) : (
            <p className="text-stone-700 text-sm leading-relaxed bg-rose-50/30 p-4 rounded-2xl border border-rose-100/60">
              "{bio}"
            </p>
          )}
        </div>

        {/* Basic Details Form */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2">
            Career & Education Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Profession"
              value={profession}
              disabled={!isEditing}
              onChange={(e) => setProfession(e.target.value)}
            />
            <Input
              label="Highest Qualification"
              value={education}
              disabled={!isEditing}
              onChange={(e) => setEducation(e.target.value)}
            />
            <Input
              label="City Location"
              value={city}
              disabled={!isEditing}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              label="Monthly Income"
              value={profile.income || '৳1,80,000 / month'}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
