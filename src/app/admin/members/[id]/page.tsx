'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/admin-context';
import { MOCK_PROFILES } from '@/data/mock-data';
import { MOCK_INTERESTS, MOCK_MATCHES } from '@/data/connection-data';
import { MOCK_MESSAGES } from '@/data/message-data';
import {
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  Ban,
  Crown,
  Heart,
  MessageSquare,
  Activity,
  FileText,
  Lock,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
} from 'lucide-react';

interface AdminMemberDetailPageProps {
  params: {
    id: string;
  };
}

export default function AdminMemberDetailPage({ params }: AdminMemberDetailPageProps) {
  const router = useRouter();
  const { addAuditLog } = useAdmin();
  const [activeTab, setActiveTab] = useState<'profile' | 'photos' | 'verification' | 'membership' | 'interests' | 'matches' | 'messages' | 'activity'>('profile');

  const profile = MOCK_PROFILES.find((p) => p.id === params.id) || MOCK_PROFILES[0];
  const [member, setMember] = useState(profile);
  const [notice, setNotice] = useState<string | null>(null);

  if (!profile) {
    notFound();
  }

  const handleToggleVerification = () => {
    const updated = !member.isVerified;
    setMember((prev) => ({ ...prev, isVerified: updated }));
    addAuditLog('MEMBER_VERIFIED_TOGGLE', `Profile ${member.fullName}`, `Verification set to ${updated}`);
    setNotice(`Member NID verification set to ${updated ? 'VERIFIED' : 'UNVERIFIED'}.`);
  };

  const handleToggleSuspension = () => {
    addAuditLog('MEMBER_SUSPENDED', `Profile ${member.fullName}`, 'Account status toggled');
    setNotice(`Member ${member.fullName} status updated.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/members">
            <button className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded-xl text-stone-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="font-serif font-bold text-xl text-white flex items-center gap-2">
              <span>Member Profile Inspection</span>
              <span className="text-xs font-mono text-stone-400 font-normal">({member.id})</span>
            </h1>
            <p className="text-xs text-stone-400">
              Complete administrative inspection for member data, verification, and activity.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleVerification}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              member.isVerified
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-amber-950 text-amber-300 border-amber-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{member.isVerified ? 'Verified Profile' : 'Verify NID Now'}</span>
          </button>

          <button
            onClick={handleToggleSuspension}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-950/80 text-red-300 border border-red-800 hover:bg-red-900 transition-all flex items-center gap-1.5"
          >
            <Ban className="w-4 h-4" />
            <span>Suspend Member</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-purple-950 border border-purple-800 text-purple-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      {/* Member Hero Banner */}
      <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-stone-950 border-2 border-stone-700 shrink-0 shadow-md">
            <Image src={member.photoUrl} alt={member.fullName} fill className="object-cover object-top" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-2xl text-white">{member.fullName}</h2>
              {member.membershipTier === 'Premium' && (
                <span className="bg-amber-950 text-amber-300 border border-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  👑 Premium
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 flex items-center gap-2">
              <span>{member.age} yrs • {member.maritalStatus}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-300"><MapPin className="w-3.5 h-3.5 text-rose-400" /> {member.location}</span>
            </p>
            <p className="text-xs text-stone-400 flex items-center gap-2">
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-purple-400" /> {member.profession}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> {member.education}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-col gap-2 text-right">
          <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-left md:text-right">
            <span className="text-[10px] text-stone-500 uppercase font-mono block">Registered Date</span>
            <span className="text-xs font-bold text-stone-200">{member.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Detail Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 overflow-x-auto pb-2">
        {[
          { key: 'profile', label: 'Profile Details' },
          { key: 'photos', label: 'Photos Gallery' },
          { key: 'verification', label: 'NID Verification' },
          { key: 'membership', label: 'Membership' },
          { key: 'interests', label: 'Interests History' },
          { key: 'matches', label: 'Matches' },
          { key: 'activity', label: 'Activity Logs' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-purple-900 text-white border border-purple-700 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-900 p-6 rounded-3xl border border-stone-800 text-xs space-y-4 md:space-y-0">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-purple-300 border-b border-stone-800 pb-2">Personal Background</h3>
            <p className="text-stone-300 leading-relaxed"><strong className="text-stone-400">Bio:</strong> {member.bio}</p>
            <p><strong className="text-stone-400">Religion:</strong> {member.religion}</p>
            <p><strong className="text-stone-400">Height:</strong> {member.height}</p>
            <p><strong className="text-stone-400">Children:</strong> {member.hasChildren ? `${member.childrenCount || 1} child` : 'None'}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-purple-300 border-b border-stone-800 pb-2">Partner Preferences</h3>
            <p><strong className="text-stone-400">Age Range:</strong> {member.partnerPreferences.ageRange}</p>
            <p><strong className="text-stone-400">Marital Statuses:</strong> {member.partnerPreferences.maritalStatuses.join(', ')}</p>
            <p><strong className="text-stone-400">Preferred Education:</strong> {member.partnerPreferences.education}</p>
            <p><strong className="text-stone-400">Preferred Location:</strong> {member.partnerPreferences.location}</p>
          </div>
        </div>
      )}

      {activeTab === 'verification' && (
        <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4 text-xs">
          <h3 className="font-serif font-bold text-sm text-amber-300">Identity & NID Details</h3>
          <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
            <p><strong className="text-stone-400">NID Document Status:</strong> {member.isVerified ? 'APPROVED' : 'PENDING'}</p>
            <p><strong className="text-stone-400">National ID Number:</strong> 19942691234509</p>
            <p><strong className="text-stone-400">Background Checked:</strong> Yes</p>
          </div>
        </div>
      )}

    </div>
  );
}
