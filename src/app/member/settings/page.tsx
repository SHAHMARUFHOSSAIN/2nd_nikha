'use client';

import React, { useState } from 'react';
import { MemberLayout } from '@/components/member/member-layout';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Shield, Eye, Lock, Bell, Ban, KeyRound } from 'lucide-react';

export default function MemberSettingsPage() {
  const [profileVisibility, setProfileVisibility] = useState('Visible to Registered Members');
  const [photoPrivacy, setPhotoPrivacy] = useState('Public');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            options={[
              'Public - Viewable by all verified members',
              'Premium Only - Visible to active Premium members',
              'Match Only - Visible after mutual interest acceptance',
              'Private - Locked until explicit permission',
            ]}
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
        <div className="pt-2">
          <Button variant="wine" size="lg" onClick={handleSaveSettings}>
            Save Preference Changes
          </Button>
        </div>
      </div>
    </MemberLayout>
  );
}
