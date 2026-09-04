'use client';

import React, { useState } from 'react';
import { MOCK_MATCHES } from '@/data/connection-data';
import { MOCK_PROFILES } from '@/data/mock-data';
import { Heart, Search, Shield, Sparkles } from 'lucide-react';

export default function AdminMatchesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const matches = MOCK_MATCHES;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-purple-400" />
            <span>Active Matches Inspector</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Monitor active mutual match connections, compatibility scores, and communication statuses.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Match ID</th>
                <th className="p-4">Candidate Partner</th>
                <th className="p-4">Compatibility</th>
                <th className="p-4">Matched Date</th>
                <th className="p-4">Match Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {matches.map((item) => (
                <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-mono text-purple-400 font-bold">{item.id}</td>
                  <td className="p-4 font-semibold text-white">
                    {item?.profile?.fullName || 'Candidate Partner'}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 bg-purple-950 text-purple-300 border border-purple-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      {item.compatibilityScore}% Score
                    </span>
                  </td>
                  <td className="p-4 font-mono text-stone-400">{item.matchedAt}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {item.status}
                    </span>
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
