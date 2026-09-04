'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { CreditCard, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminRefundsPage() {
  const { refundRequests, approveRefund, rejectRefund } = useAdmin();
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <span>Refund Requests Queue</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review and process refund requests for duplicate or erroneous checkouts.
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
                <th className="p-4">Refund ID</th>
                <th className="p-4">TXN Reference</th>
                <th className="p-4">Member</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {refundRequests.map((ref) => (
                <tr key={ref.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-mono text-purple-400 font-bold">{ref.id}</td>
                  <td className="p-4 font-mono text-emerald-400 font-bold">{ref.transactionId}</td>
                  <td className="p-4 font-semibold text-white">{ref.userName}</td>
                  <td className="p-4 font-mono font-bold text-white">{formatCurrency(ref.amount)}</td>
                  <td className="p-4 text-stone-300 max-w-xs">{ref.reason}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ref.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : ref.status === 'REJECTED'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {ref.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            approveRefund(ref.id);
                            setNotice(`Refund ${ref.id} approved.`);
                          }}
                          className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl font-bold hover:bg-emerald-900"
                        >
                          Approve Refund
                        </button>
                        <button
                          onClick={() => {
                            rejectRefund(ref.id, 'Ineligible for refund per policy');
                            setNotice(`Refund ${ref.id} rejected.`);
                          }}
                          className="px-3 py-1 bg-red-950 text-red-300 border border-red-800 rounded-xl font-bold hover:bg-red-900"
                        >
                          Reject
                        </button>
                      </div>
                    )}
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
