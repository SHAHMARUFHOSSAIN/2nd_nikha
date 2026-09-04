'use client';

import React from 'react';
import { useCommunication } from '@/lib/communication-context';
import { MOCK_CONVERSATIONS } from '@/data/message-data';
import { MessageSquare, Shield, Clock } from 'lucide-react';

export default function AdminConversationsPage() {
  const communication = useCommunication();
  const conversations = communication?.conversations && Array.isArray(communication.conversations) && communication.conversations.length > 0
    ? communication.conversations
    : MOCK_CONVERSATIONS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-400" />
            <span>Conversations Directory</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Overview of active chat conversations between matched member pairs.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Match ID</th>
                <th className="p-4">Matched Candidate</th>
                <th className="p-4">Last Message Snippet</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {conversations.map((c) => (
                <tr key={c.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-mono text-purple-400 font-bold">{c.matchId}</td>
                  <td className="p-4 font-semibold text-white">
                    {c?.profile?.fullName || 'Candidate Member'}
                  </td>
                  <td className="p-4 text-stone-400 truncate max-w-xs">{c.lastMessage}</td>
                  <td className="p-4 font-mono text-stone-400">{c.lastMessageAt}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {c.status || 'ACTIVE'}
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
