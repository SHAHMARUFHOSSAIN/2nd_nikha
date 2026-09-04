'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { ShieldAlert, CheckCircle2, AlertTriangle, Ban } from 'lucide-react';

export default function AdminReportedMessagesPage() {
  const { moderationReports, resolveReport, dismissReport } = useAdmin();
  const [notice, setNotice] = useState<string | null>(null);

  const messageReports = moderationReports.filter((r) => r.targetType === 'MESSAGE' || r.targetType === 'PROFILE');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <span>Reported Messages & Content</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review reported messages, inappropriate language, and harassment complaints.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Reporter</th>
                <th className="p-4">Reported Target</th>
                <th className="p-4">Category</th>
                <th className="p-4">Report Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {messageReports.map((r) => (
                <tr key={r.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-semibold text-white">{r.reporterName}</td>
                  <td className="p-4 font-semibold text-rose-300">{r.targetName}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-950 text-red-300 border border-red-800">
                      {r.reason}
                    </span>
                  </td>
                  <td className="p-4 text-stone-300 max-w-xs">{r.details}</td>
                  <td className="p-4 font-mono font-bold text-amber-400">{r.status}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          resolveReport(r.id, 'WARN_USER', 'Sent official warning notice to user.');
                          setNotice(`Report ${r.id} resolved with warning notice.`);
                        }}
                        className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-xl font-bold hover:bg-amber-900"
                      >
                        Warn User
                      </button>
                      <button
                        onClick={() => {
                          dismissReport(r.id);
                          setNotice(`Report ${r.id} dismissed.`);
                        }}
                        className="px-3 py-1 bg-stone-800 text-stone-300 border border-stone-700 rounded-xl font-bold hover:bg-stone-700"
                      >
                        Dismiss
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
