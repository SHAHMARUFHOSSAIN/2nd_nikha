'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Search, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Txn {
  id: string;
  transactionId: string;
  gateway: string;
  amount: number;
  currency: string;
  purpose: string;
  status: string;
  paidAt: string;
  userId?: string;
  email?: string;
}

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/payments', { credentials: 'include', cache: 'no-store' });
        const json = await res.json().catch(() => null);
        if (json?.success) setPayments(json.payments || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const filteredTransactions = payments.filter((t) => {
    const matchesSearch = t.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Payment Transactions Log</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Transaction ledger for SSLCommerz and gateway checkouts, loaded from the database.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 p-4 rounded-3xl border border-stone-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search TXN ID..."
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
          <option value="PAID">PAID / SUCCESS</option>
          <option value="PENDING">PENDING</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center text-stone-400">
            <Loader2 className="w-6 h-6 animate-spin text-rose-500 mx-auto" />
            <p className="text-xs mt-2">Loading transactions...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
                <tr>
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-300">
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-4 font-mono text-emerald-400 font-bold">{t.transactionId}</td>
                    <td className="p-4 font-semibold text-white">{t.gateway}</td>
                    <td className="p-4 font-mono font-bold text-white">{formatCurrency(t.amount, t.currency)}</td>
                    <td className="p-4 uppercase font-mono text-[10px] text-stone-400">{t.purpose || 'subscription'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'PAID' || t.status === 'SUCCESS'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : t.status === 'FAILED'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-stone-400">{t.paidAt}</td>
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