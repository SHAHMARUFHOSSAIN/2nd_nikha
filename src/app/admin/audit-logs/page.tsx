'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { ClipboardList, Search, Shield, Filter } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const { auditLogs } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      log.adminName.toLowerCase().includes(term) ||
      log.target.toLowerCase().includes(term) ||
      log.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-purple-400" />
            <span>Append-Only Security Audit Trail</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Immutable log tracking all administrative actions, verifications, suspensions, pricing edits, and system changes.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search action, target, or admin name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-9 pr-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
          />
        </div>
      </div>

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Admin Operator</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Event Description</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 text-stone-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-sans font-semibold text-white">{log.adminName} ({log.adminRole})</td>
                  <td className="p-4 font-sans font-bold text-rose-300">{log.target}</td>
                  <td className="p-4 font-sans text-stone-300 max-w-xs">{log.description}</td>
                  <td className="p-4 text-stone-500">{log.ipAddress || '103.114.12.89'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
