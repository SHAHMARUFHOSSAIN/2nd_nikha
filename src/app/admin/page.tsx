'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAdmin } from '@/lib/admin-context';
import { MOCK_PROFILES } from '@/data/mock-data';
import { MOCK_INTERESTS, MOCK_MATCHES } from '@/data/connection-data';
import { MOCK_PAYMENTS } from '@/data/subscription-data';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  UserCheck,
  Heart,
  MessageSquare,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  CreditCard,
  Crown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  Activity,
  BarChart2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { verificationQueue, moderationReports, refundRequests, auditLogs } = useAdmin();

  // Calculate live dynamic metrics from mock datasets
  const totalMembersCount = MOCK_PROFILES.length + 1420;
  const newMembersTodayCount = 14;
  const verifiedMembersCount = MOCK_PROFILES.filter((p) => p.isVerified).length + 890;
  const pendingVerificationCount = verificationQueue.filter((v) => v.status === 'PENDING').length;
  const premiumMembersCount = MOCK_PROFILES.filter((p) => p.membershipTier === 'Premium').length + 420;

  const totalInterestsSent = MOCK_INTERESTS.length + 3840;
  const activeMatchesCount = MOCK_MATCHES.length + 620;

  const totalRevenueAmount = 1499 * 420 + 3999 * 180;
  const revenueThisMonth = 1499 * 84;
  const successfulPaymentsCount = MOCK_PAYMENTS.filter((p) => p.status === 'PAID').length + 580;

  const chartData = [
    { month: 'Jan', revenue: 45, members: 30 },
    { month: 'Feb', revenue: 60, members: 45 },
    { month: 'Mar', revenue: 75, members: 55 },
    { month: 'Apr', revenue: 90, members: 70 },
    { month: 'May', revenue: 110, members: 85 },
    { month: 'Jun', revenue: 130, members: 95 },
    { month: 'Jul', revenue: 155, members: 110 },
    { month: 'Aug', revenue: 180, members: 130 },
  ];

  const maxRevenue = 200;
  const maxMembers = 150;

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & KPI Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-extrabold text-2xl text-white tracking-tight">
              SaaS Admin Overview & Analytics
            </h1>
            <span className="bg-pink-950 text-pink-300 border border-pink-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
              Production V2.0
            </span>
          </div>
          <p className="text-xs text-stone-300">
            Real-time analytics for 2nd Chance matrimonial operations, SSLCommerz transactions, and profile verifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/members/verification">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-800 text-xs font-bold hover:bg-purple-900 transition-all shadow-md">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Pending Verifications ({pendingVerificationCount})</span>
            </button>
          </Link>

          <Link href="/admin/moderation/reports">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950 text-red-200 border border-red-800 text-xs font-bold hover:bg-red-900 transition-all shadow-md">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>New Reports ({moderationReports.filter((r) => r.status === 'NEW').length})</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 4 Core Metric KPI Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Revenue KPI */}
        <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-stone-300 text-xs font-bold">
            <span>Total Platform Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-sans font-extrabold text-2xl text-white block">
              {formatCurrency(totalRevenueAmount)}
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{formatCurrency(revenueThisMonth)} this month</span>
            </span>
          </div>
          <div className="pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300 font-medium">
            <span>Successful Payments</span>
            <span className="font-bold text-white">{successfulPaymentsCount}</span>
          </div>
        </div>

        {/* Members KPI */}
        <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-stone-300 text-xs font-bold">
            <span>Registered Members</span>
            <div className="p-2 rounded-xl bg-pink-950 text-pink-400 border border-pink-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-sans font-extrabold text-2xl text-white block">
              {totalMembersCount.toLocaleString()}
            </span>
            <span className="text-xs text-pink-400 font-bold flex items-center gap-1 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{newMembersTodayCount} joined today</span>
            </span>
          </div>
          <div className="pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300 font-medium">
            <span>NID Verified</span>
            <span className="font-bold text-amber-400">{verifiedMembersCount}</span>
          </div>
        </div>

        {/* Premium KPI */}
        <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-stone-300 text-xs font-bold">
            <span>Premium Subscribers</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-sans font-extrabold text-2xl text-white block">
              {premiumMembersCount.toLocaleString()}
            </span>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1 mt-1">
              <Crown className="w-3.5 h-3.5" />
              <span>৳1,499/month Subscription</span>
            </span>
          </div>
          <div className="pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300 font-medium">
            <span>Active Matches</span>
            <span className="font-bold text-pink-400">{activeMatchesCount}</span>
          </div>
        </div>

        {/* Connections KPI */}
        <div className="bg-stone-900 p-5 rounded-3xl border border-stone-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-stone-300 text-xs font-bold">
            <span>Interests Sent</span>
            <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="font-sans font-extrabold text-2xl text-white block">
              {totalInterestsSent.toLocaleString()}
            </span>
            <span className="text-xs text-purple-400 font-bold flex items-center gap-1 mt-1">
              <Activity className="w-3.5 h-3.5" />
              <span>88% Match Conversion</span>
            </span>
          </div>
          <div className="pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs text-stone-300 font-medium">
            <span>Pending Approvals</span>
            <span className="font-bold text-purple-300">{pendingVerificationCount}</span>
          </div>
        </div>

      </div>

      {/* SVG Analytics Charts Section with Scaled Bounded Heights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue & Growth Chart Container */}
        <div className="lg:col-span-8 bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-pink-400" />
                <span>Monthly Revenue & Member Growth Trends</span>
              </h3>
              <p className="text-xs text-stone-300">
                Visual analysis of new member registrations and subscription revenue.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-stone-300 bg-stone-950 px-3 py-1 rounded-full border border-stone-800">
              2026 Q1 - Q3
            </span>
          </div>

          {/* Scaled Chart Bar Box with Bounded Heights */}
          <div className="h-56 flex items-end justify-between gap-3 pt-4 px-2 pb-2 border-b border-stone-800 overflow-hidden">
            {chartData.map((d, i) => {
              const revPercent = Math.min((d.revenue / maxRevenue) * 100, 92);
              const memPercent = Math.min((d.members / maxMembers) * 100, 85);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full overflow-hidden">
                    <div
                      style={{ height: `${revPercent}%` }}
                      className="w-1/2 bg-gradient-to-t from-pink-700 to-rose-500 rounded-t-md group-hover:brightness-125 transition-all shadow-md"
                      title={`Revenue: ৳${d.revenue * 1000}`}
                    />
                    <div
                      style={{ height: `${memPercent}%` }}
                      className="w-1/2 bg-gradient-to-t from-purple-800 to-emerald-400 rounded-t-md group-hover:brightness-125 transition-all"
                      title={`Members: ${d.members * 10}`}
                    />
                  </div>
                  <span className="text-[10px] text-stone-300 font-mono font-bold">{d.month}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-600 inline-block" />
              <span className="text-stone-200">Revenue (৳ BDT)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-stone-200">New Members</span>
            </div>
          </div>
        </div>

        {/* Verification Queue Box */}
        <div className="lg:col-span-4 bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-sans font-bold text-base text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Verification Queue</span>
              </h3>
              <span className="text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-full">
                {pendingVerificationCount} Pending
              </span>
            </div>

            <div className="space-y-3 pt-3">
              {verificationQueue.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-800 border border-stone-700 shrink-0">
                      <Image
                        src={item.profile.photoUrl}
                        alt={item.profile.fullName}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-sans font-bold text-xs text-white truncate">
                        {item.profile.fullName}
                      </h4>
                      <p className="text-[10px] text-pink-300 font-mono truncate">
                        NID: {item.nidNumber}
                      </p>
                    </div>
                  </div>

                  <Link href="/admin/members/verification">
                    <button className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-[10px] font-bold transition-all shrink-0 shadow-md">
                      Review
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <Link href="/admin/members/verification" className="block pt-2">
            <button className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-stone-700 shadow-md">
              <span>View Full NID Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

      </div>

      {/* Audit Logs & Security Activity Stream */}
      <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div>
            <h3 className="font-sans font-bold text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>Real-Time Audit Trail & Activity Feed</span>
            </h3>
            <p className="text-xs text-stone-300">
              Append-only security log tracking all administrative actions and security events.
            </p>
          </div>

          <Link href="/admin/audit-logs">
            <button className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1">
              <span>View All Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-3 bg-stone-950 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-800 shrink-0">
                  {log.action}
                </span>
                <span className="font-bold text-white">{log.target}</span>
                <span className="text-stone-300 hidden lg:inline">• {log.description}</span>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-stone-400 shrink-0 font-mono">
                <span>By {log.adminName}</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
