'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useConnection } from '@/lib/connection-context';
import { MOCK_INTERESTS } from '@/data/connection-data';
import { Heart, Search, Filter, ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminInterestsPage() {
  const { interests } = useConnection();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const allInterests = Array.isArray(interests) && interests.length > 0 ? interests : MOCK_INTERESTS;

  const filteredInterests = allInterests.filter((item) => {
    const senderName = item?.senderProfile?.fullName || 'Sender Candidate';
    const receiverName = item?.receiverProfile?.fullName || 'Recipient Candidate';
    const matchesSearch =
      senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receiverName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <span>Interests Management</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Track sent interest requests, payment statuses, and acceptance metrics.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search sender or recipient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-stone-950 border border-stone-800 rounded-2xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACCEPTED">ACCEPTED</option>
          <option value="SENT">SENT</option>
          <option value="PENDING">PENDING</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Sender Candidate</th>
                <th className="p-4">Recipient Candidate</th>
                <th className="p-4">Interest Status</th>
                <th className="p-4">Payment & Gateway</th>
                <th className="p-4">Sent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {filteredInterests.map((item) => (
                <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-semibold text-white">
                    {item?.senderProfile?.fullName || 'Sender Candidate'}
                  </td>
                  <td className="p-4 font-semibold text-white">
                    {item?.receiverProfile?.fullName || 'Recipient Candidate'}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-emerald-400 font-mono font-bold">৳1,499 BDT</span>
                    <span className="text-[10px] text-stone-500 block">SSLCommerz / Gateway</span>
                  </td>
                  <td className="p-4 font-mono text-stone-400">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
