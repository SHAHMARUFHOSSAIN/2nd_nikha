'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MemberLayout } from '@/components/member/member-layout';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Shield,
  Eye,
  Lock,
  Bell,
  Ban,
  KeyRound,
  LogOut,
  Trash2,
  AlertTriangle,
  UserX,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const PHOTO_PRIVACY_OPTIONS = [
  'Public - Viewable by all verified members',
  'Premium Only - Visible to active Premium members',
  'Match Only - Visible after mutual interest acceptance',
  'Private - Locked until explicit permission',
];

const PRIVACY_TO_CODE: Record<string, string> = {
  'Public - Viewable by all verified members': 'PUBLIC',
  'Premium Only - Visible to active Premium members': 'PREMIUM',
  'Match Only - Visible after mutual interest acceptance': 'MATCH',
  'Private - Locked until explicit permission': 'PRIVATE',
};

const CODE_TO_PRIVACY: Record<string, string> = {
  PUBLIC: 'Public - Viewable by all verified members',
  PREMIUM: 'Premium Only - Visible to active Premium members',
  MATCH: 'Match Only - Visible after mutual interest acceptance',
  PRIVATE: 'Private - Locked until explicit permission',
};

export default function MemberSettingsPage() {
  const router = useRouter();
  const { logout, currentUser, refreshSession } = useAuth();

  const [profileVisibility, setProfileVisibility] = useState('Visible to Registered Members');
  const [photoPrivacy, setPhotoPrivacy] = useState(
    CODE_TO_PRIVACY[currentUser?.photoPrivacy || 'PUBLIC'] || PHOTO_PRIVACY_OPTIONS[0]
  );
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveSettings = async () => {
    setSaveError('');
    try {
      const res = await fetch('/api/profile/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ photoPrivacy: PRIVACY_TO_CODE[photoPrivacy] || 'PUBLIC' }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Failed to save settings');
      }
      await refreshSession();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to save settings');
    }
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
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Account & Privacy Settings
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Manage your account security, profile visibility, photo privacy filters, and notifications.
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Profile Visibility */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Eye className="w-5 h-5 text-rose-500" />
            <span>Profile Visibility Controls</span>
          </h3>

          <Select
            label="Who can view your profile?"
            options={[
              'Visible to Everyone (Public)',
              'Visible to Registered Members Only',
              'Hidden / Private Mode',
            ]}
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
          />
        </div>

        {/* Photo Privacy */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-rose-500" />
            <span>Photo Privacy Filters</span>
          </h3>

          <Select
            label="Photo Protection Mode"
            options={PHOTO_PRIVACY_OPTIONS}
            value={photoPrivacy}
            onChange={(e) => setPhotoPrivacy(e.target.value)}
          />
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500" />
            <span>Notification Preferences</span>
          </h3>

          <div className="space-y-3 text-xs text-stone-700">
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-stone-50">
              <span>Email alerts when a match expresses interest</span>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-stone-50">
              <span>SMS notification for mutual connection acceptances</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-rose-600 rounded" />
            </label>
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-stone-50">
              <span>Weekly digest of recommended compatible matches</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-rose-600 rounded" />
            </label>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-white rounded-3xl p-6 border border-rose-100/90 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Ban className="w-5 h-5 text-stone-500" />
            <span>Blocked Profiles</span>
          </h3>
          <p className="text-xs text-stone-500">
            You currently have no blocked profiles.
          </p>
        </div>

        {/* Save Settings */}
        <div className="pt-2 flex items-center justify-between">
          <Button variant="wine" size="lg" onClick={handleSaveSettings}>
            Save Preference Changes
          </Button>
        </div>

        {/* Account Management & Danger Zone */}
        <div className="bg-white rounded-3xl p-6 border border-red-200/80 shadow-sm space-y-4 pt-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            <span>Account Management & Danger Zone</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/80">
            <div>
              <p className="font-bold text-sm text-stone-900">Log Out of Account</p>
              <p className="text-xs text-stone-500">
                End your active login session securely on this device.
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
                Delete Account Permanently
              </p>
              <p className="text-xs text-red-700/80">
                Erase your account profile, photos, saved preferences, and chat history.
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
                  Are you sure you want to delete your profile? All of your saved information, uploaded photos, matches, and message logs will be permanently erased.
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

