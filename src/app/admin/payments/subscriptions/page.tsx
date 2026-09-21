'use client';

import React, { useEffect, useState } from 'react';
import { Crown, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Sub {
  id: string;
  planName: string;
  status: string;
  amount: number;
  currency: string;
  startedAt: string;
  expiresAt: string;
  paymentMethod: string;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/subscriptions', { credentials: 'include', cache: 'no-store' });
        const json = await res.json().catch(() => null);
        if (json?.success) setSubscriptions(json.subscriptions || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span>Active & Historic Subscriptions</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Directory of active, pending, and expired member membership passes, loaded from the database.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500 mx-auto" />
            <p className="text-xs mt-2">Loading subscriptions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
                <tr>
                  <th className="p-4">Subscription ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Started At</th>
                  <th className="p-4">Expires At</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-300">
                {subscriptions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-500">
                      No subscriptions found.
                    </td>
                  </tr>
                )}
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-4 font-mono text-purple-400 font-bold">{sub.id}</td>
                    <td className="p-4 font-mono font-bold text-white">{formatCurrency(sub.amount, sub.currency)}</td>
                    <td className="p-4 font-mono text-stone-400">{sub.startedAt}</td>
                    <td className="p-4 font-mono text-stone-400">{sub.expiresAt}</td>
                    <td className="p-4 font-semibold text-stone-300">{sub.paymentMethod}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-stone-800 text-stone-400 border border-stone-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}