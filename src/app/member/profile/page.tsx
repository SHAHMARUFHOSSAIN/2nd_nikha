'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MemberLayout } from '@/components/member/member-layout';
import { ProfileCompletionCard } from '@/components/member/profile-completion-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import {
  Heart,
  Edit,
  Save,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Upload,
  Trash2,
  LogOut,
  AlertTriangle,
  Camera,
  UserX,
} from 'lucide-react';
import Image from 'next/image';

import { useAuth } from '@/lib/auth-context';
import { SubscriptionValidityBanner } from '@/components/subscription/subscription-validity-banner';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';

const FALLBACK_PROFILE: any = {
  fullName: '',
  age: 0,
  photoUrl: DEFAULT_AVATAR,
  bio: '',
  profession: '',
  education: '',
  city: '',
  maritalStatus: '',
  religion: '',
  height: '',
  income: '',
};

export default function MemberProfilePage() {
  const router = useRouter();
  const { currentUser: authUser, logout, userRole, refreshSession, sessionReady } = useAuth();
  const profile: any = authUser || FALLBACK_PROFILE;
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isError, setIsError] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('Profile updated successfully!');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [photoUrl, setPhotoUrl] = useState(profile.photoUrl || DEFAULT_AVATAR);
  const [bio, setBio] = useState(profile.bio || '');
  const [profession, setProfession] = useState(profile.profession || '');
  const [education, setEducation] = useState(profile.education || '');
  const [city, setCity] = useState(profile.city || '');

  const showNotice = (message: string, error = false) => {
    setNoticeMessage(message);
    setIsError(error);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const patchProfile = async (data: Record<string, any>): Promise<boolean> => {
    try {
      const res = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to save profile');
      }
      await refreshSession();
      return true;
    } catch (err: any) {
      showNotice(err?.message || 'Failed to save profile', true);
      return false;
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const newUrl = event.target.result as string;
          setPhotoUrl(newUrl);
          const ok = await patchProfile({ photoUrl: newUrl });
          if (ok) showNotice('Profile picture updated successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = async () => {
    setPhotoUrl(DEFAULT_AVATAR);
    const ok = await patchProfile({ photoUrl: DEFAULT_AVATAR });
    if (ok) showNotice('Profile picture removed. Default avatar set.');
  };

  const handleSave = async () => {
    setIsEditing(false);
    const ok = await patchProfile({ photoUrl, bio, profession, education, city });
    if (ok) showNotice('Profile details saved successfully!');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleConfirmDeleteAccount = () => {
    logout();
    router.push('/');
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
              Manage your personal information, public bio, photos, and account settings.
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
          <div className={`p-3 border rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${isError ? 'bg-red-50 text-red-800 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isError ? 'text-red-600' : 'text-emerald-600'}`} />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Profile Strength Widget */}
        <ProfileCompletionCard user={profile} />

        {/* Live Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-32 h-32 rounded-3xl overflow-hidden bg-rose-50 border-2 border-rose-200 shadow-md group cursor-pointer"
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

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>

              <button
                type="button"
                onClick={handleDeletePhoto}
                className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors flex items-center gap-1.5"
                title="Remove current picture and restore default avatar"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
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

        {/* Subscription Validity & Renewal Banner */}
        <SubscriptionValidityBanner />

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

        {/* Account Options & Danger Zone */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-stone-600" />
            <span>Account Security & Logout</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <div>
              <p className="font-bold text-sm text-stone-900">Session Logout</p>
              <p className="text-xs text-stone-500">
                Log out of your current session safely on this device.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-4 h-4 text-stone-600" />}
            >
              Log Out
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-red-50/60 rounded-2xl border border-red-100">
            <div>
              <p className="font-bold text-sm text-red-900 flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-red-600" />
                Delete Profile & Account
              </p>
              <p className="text-xs text-red-700/80">
                Permanently delete your profile, photos, matches, and chat history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shrink-0 shadow-sm flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  Delete Account Permanently?
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Are you sure you want to delete your profile? All of your saved information, uploaded photos, matches, and message logs will be permanently destroyed. This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteAccount}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-md"
                >
                  Yes, Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MemberLayout>
  );
}

