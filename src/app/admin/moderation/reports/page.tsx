'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function AdminModerationReportsPage() {
  const { moderationReports, resolveReport, dismissReport } = useAdmin();
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <span>Moderation Center — User Reports</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review user-submitted reports for fake profiles, scams, harassment, and inappropriate behavior.
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
                <th className="p-4">Report ID</th>
                <th className="p-4">Reporter</th>
                <th className="p-4">Target Candidate</th>
                <th className="p-4">Category</th>
                <th className="p-4">Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {moderationReports.map((report) => (
                <tr key={report.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-mono text-purple-400 font-bold">{report.id}</td>
                  <td className="p-4 font-semibold text-white">{report.reporterName}</td>
                  <td className="p-4 font-semibold text-rose-300">{report.targetName}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-950 text-red-300 border border-red-800">
                      {report.reason}
                    </span>
                  </td>
                  <td className="p-4 text-stone-300 max-w-xs">{report.details}</td>
                  <td className="p-4 font-mono font-bold text-amber-400">{report.status}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          resolveReport(report.id, 'RESOLVED', 'Account reviewed and action taken.');
                          setNotice(`Report ${report.id} resolved successfully.`);
                        }}
                        className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl font-bold hover:bg-emerald-900"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => {
                          dismissReport(report.id);
                          setNotice(`Report ${report.id} dismissed.`);
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
