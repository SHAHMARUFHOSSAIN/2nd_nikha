'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdmin } from '@/lib/admin-context';
import { VerificationQueueItem } from '@/types/admin';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Shield,
  Eye,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminVerificationQueuePage() {
  const {
    verificationQueue,
    approveVerification,
    rejectVerification,
    requestVerificationChanges,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | 'ALL'>('PENDING');
  const [selectedItem, setSelectedItem] = useState<VerificationQueueItem | null>(null);
  const [modalMode, setModalMode] = useState<'REJECT' | 'REQUEST_CHANGES' | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const filteredQueue = verificationQueue.filter((v) => {
    if (activeTab === 'ALL') return true;
    return v.status === activeTab;
  });

  const handleConfirmAction = () => {
    if (!selectedItem || !reasonInput.trim()) return;

    if (modalMode === 'REJECT') {
      rejectVerification(selectedItem.id, reasonInput);
      setNotice(`NID Verification for ${selectedItem.profile.fullName} REJECTED.`);
    } else if (modalMode === 'REQUEST_CHANGES') {
      requestVerificationChanges(selectedItem.id, reasonInput);
      setNotice(`Requested changes from ${selectedItem.profile.fullName}.`);
    }

    setModalMode(null);
    setSelectedItem(null);
    setReasonInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-400" />
            <span>NID Profile Verification Queue</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review national ID identity documents, match profile photos, and assign verified badges.
          </p>
        </div>

        <span className="bg-purple-950 text-purple-300 border border-purple-800 text-xs font-bold px-3 py-1 rounded-full">
          {verificationQueue.filter((v) => v.status === 'PENDING').length} Pending Requests
        </span>
      </div>

      {notice && (
        <div className="p-3.5 bg-purple-950 border border-purple-800 text-purple-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
        {[
          { key: 'PENDING', label: `Pending Queue (${verificationQueue.filter((v) => v.status === 'PENDING').length})` },
          { key: 'VERIFIED', label: 'Verified Profiles' },
          { key: 'REJECTED', label: 'Rejected Queue' },
          { key: 'ALL', label: 'All Records' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-purple-900 text-white border border-purple-700 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Queue Items List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQueue.length === 0 ? (
          <div className="bg-stone-900 rounded-3xl p-12 text-center text-stone-500 border border-stone-800">
            No verification requests found for this filter status.
          </div>
        ) : (
          filteredQueue.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900 rounded-3xl p-5 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Profile Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-950 border border-stone-700 shrink-0">
                  <Image
                    src={item.profile.photoUrl}
                    alt={item.profile.fullName}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-white text-base truncate">
                      {item.profile.fullName}
                    </h3>
                    <span className="text-xs text-stone-400 font-mono">({item.profile.age} yrs)</span>
                  </div>

                  <p className="text-xs text-stone-400 flex items-center gap-2">
                    <span>NID: <strong className="text-purple-300 font-mono">{item.nidNumber}</strong></span>
                    <span>•</span>
                    <span>Submitted: {item.submittedAt}</span>
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-950 text-stone-300 border border-stone-800">
                      {item.profile.location}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                      85% Profile Completeness
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    item.status === 'VERIFIED'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : item.status === 'REJECTED'
                      ? 'bg-red-950 text-red-300 border-red-800'
                      : item.status === 'CHANGES_REQUESTED'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-purple-950 text-purple-300 border-purple-800'
                  }`}
                >
                  {item.status}
                </span>

                {item.status === 'PENDING' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        approveVerification(item.id);
                        setNotice(`NID Verification for ${item.profile.fullName} APPROVED.`);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode('REQUEST_CHANGES');
                        setReasonInput('NID photo is blurry. Please re-upload clearer image.');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setModalMode('REJECT');
                        setReasonInput('NID document mismatch with profile information.');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-red-950 text-red-300 hover:bg-red-900 border border-red-800 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reason Input Modal */}
      {modalMode && selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-lg text-white">
              {modalMode === 'REJECT' ? 'Reject Verification Request' : 'Request Profile Changes'}
            </h3>
            <p className="text-xs text-stone-400">
              Provide a mandatory explanation that will be sent to {selectedItem.profile.fullName}.
            </p>

            <textarea
              rows={4}
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="Reason or instructions..."
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setModalMode(null);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 text-xs font-bold text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={!reasonInput.trim()}
                className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md disabled:opacity-50"
              >
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
