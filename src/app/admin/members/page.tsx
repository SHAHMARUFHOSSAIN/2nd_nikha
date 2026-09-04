'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/lib/admin-context';
import { MOCK_PROFILES } from '@/data/mock-data';
import { Profile, VerificationStatus, MembershipTier } from '@/types';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Ban,
  Shield,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Plus,
  Crown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminMembersDirectoryPage() {
  const { addAuditLog } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [membershipFilter, setMembershipFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  const [membersList, setMembersList] = useState<Profile[]>(MOCK_PROFILES);
  const [notice, setNotice] = useState<string | null>(null);

  // Filtered members list
  const filteredMembers = membersList.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.profession.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVerif =
      verificationFilter === 'ALL' ||
      (verificationFilter === 'VERIFIED' && member.isVerified) ||
      (verificationFilter === 'UNVERIFIED' && !member.isVerified);

    const matchesTier =
      membershipFilter === 'ALL' || member.membershipTier === membershipFilter;

    const matchesLocation =
      locationFilter === 'ALL' || member.city.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesVerif && matchesTier && matchesLocation;
  });

  const handleVerifyMember = (id: string, name: string) => {
    setMembersList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isVerified: true } : m))
    );
    addAuditLog('MEMBER_VERIFIED', `Profile ${name} (${id})`, 'Verified NID document manually');
    setNotice(`Member ${name} has been verified successfully.`);
  };

  const handleSuspendMember = (id: string, name: string) => {
    addAuditLog('MEMBER_SUSPENDED', `Profile ${name} (${id})`, 'Suspended account due to admin review');
    setNotice(`Member ${name} has been suspended.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Members Directory</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage, verify, edit, and moderate registered matrimonial member profiles.
          </p>
        </div>

        <Link href="/admin/members/verification">
          <button className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-purple-100 text-xs font-bold transition-all flex items-center gap-2 border border-purple-700">
            <UserCheck className="w-4 h-4" />
            <span>Go to NID Verification Queue</span>
          </button>
        </Link>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950/90 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search name, city, job..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
            />
          </div>

          {/* Verification Status Filter */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-2xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
          >
            <option value="ALL">Verification: All</option>
            <option value="VERIFIED">Verified NID Only</option>
            <option value="UNVERIFIED">Unverified Only</option>
          </select>

          {/* Membership Tier Filter */}
          <select
            value={membershipFilter}
            onChange={(e) => setMembershipFilter(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-2xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
          >
            <option value="ALL">Membership: All Tiers</option>
            <option value="Premium">👑 Premium Members</option>
            <option value="Free">Free Members</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-stone-950 border border-stone-800 rounded-2xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
          >
            <option value="ALL">Location: All Cities</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Rajshahi">Rajshahi</option>
          </select>

        </div>
      </div>

      {/* Members Directory Data Table */}
      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Member Profile</th>
                <th className="p-4">Demographics</th>
                <th className="p-4">Verification</th>
                <th className="p-4">Membership</th>
                <th className="p-4">Joined & Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-stone-800/40 transition-colors">
                  
                  {/* Member Photo & Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-stone-800 border border-stone-700 shrink-0">
                        <Image
                          src={member.photoUrl}
                          alt={member.fullName}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <Link href={`/admin/members/${member.id}`} className="font-serif font-bold text-white hover:text-rose-400 transition-colors text-sm block">
                          {member.fullName}
                        </Link>
                        <span className="text-[10px] text-stone-400 font-mono block">ID: {member.id}</span>
                      </div>
                    </div>
                  </td>

                  {/* Demographics */}
                  <td className="p-4">
                    <span className="block font-medium text-stone-200">{member.age} yrs • {member.gender}</span>
                    <span className="text-[11px] text-stone-400 block">{member.maritalStatus} • {member.location}</span>
                  </td>

                  {/* Verification Status */}
                  <td className="p-4">
                    {member.isVerified ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Verified NID
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Unverified
                      </span>
                    )}
                  </td>

                  {/* Membership Tier */}
                  <td className="p-4">
                    {member.membershipTier === 'Premium' ? (
                      <span className="inline-flex items-center gap-1 bg-amber-950 text-amber-300 border border-amber-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        👑 Premium Pass
                      </span>
                    ) : (
                      <span className="text-stone-400 font-medium">Free Member</span>
                    )}
                  </td>

                  {/* Joined Date */}
                  <td className="p-4">
                    <span className="block font-mono text-[11px] text-stone-300">{member.createdAt}</span>
                    <span className="text-[10px] text-stone-500 block">Active {member.lastActive || 'Today'}</span>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/members/${member.id}`}>
                        <button className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-all" title="View Full Profile">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>

                      {!member.isVerified && (
                        <button
                          onClick={() => handleVerifyMember(member.id, member.fullName)}
                          className="p-2 rounded-xl bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 transition-all"
                          title="Verify NID Identity"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                        </button>
                      )}

                      <button
                        onClick={() => handleSuspendMember(member.id, member.fullName)}
                        className="p-2 rounded-xl bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-900/50 transition-all"
                        title="Suspend Account"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
