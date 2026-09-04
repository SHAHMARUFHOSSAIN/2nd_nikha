'use client';

import React from 'react';
import Link from 'next/link';
import { MemberLayout } from '@/components/member/member-layout';
import { MOCK_PAYMENTS } from '@/data/subscription-data';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { History, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

export default function PaymentHistoryPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'SUCCESS':
        return <Badge variant="success">SUCCESS</Badge>;
      case 'PENDING':
        return <Badge variant="warning" className="font-bold">PENDING</Badge>;
      case 'FAILED':
        return <Badge variant="wine">FAILED</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline">CANCELLED</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary">REFUNDED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <MemberLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div>
            <Link
              href="/member/subscription"
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Subscription</span>
            </Link>
            <h1 className="text-3xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <History className="w-7 h-7 text-rose-500" />
              <span>Payment & Invoice History</span>
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Historical records of subscription and express interest activation payments.
            </p>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-stone-700">
                <th className="p-4 font-bold uppercase tracking-wider">Date & Time</th>
                <th className="p-4 font-bold uppercase tracking-wider">Transaction ID</th>
                <th className="p-4 font-bold uppercase tracking-wider">Purpose</th>
                <th className="p-4 font-bold uppercase tracking-wider">Amount</th>
                <th className="p-4 font-bold uppercase tracking-wider">Gateway</th>
                <th className="p-4 font-bold uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {MOCK_PAYMENTS.map((payment) => (
                <tr key={payment.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="p-4 font-medium">{payment.createdAt}</td>
                  <td className="p-4 font-mono font-semibold text-stone-900">
                    {payment.transactionId}
                  </td>
                  <td className="p-4 font-semibold text-stone-800">
                    {payment.purpose === 'interest' ? (
                      <span className="flex items-center gap-1 text-rose-700">
                        <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" /> Express Interest
                      </span>
                    ) : (
                      <span>Premium Subscription</span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-rose-800">
                    {formatCurrency(payment.amount, payment.currency)}
                  </td>
                  <td className="p-4 text-stone-600">{payment.gateway}</td>
                  <td className="p-4 text-center">{getStatusBadge(payment.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="space-y-3 md:hidden">
          {MOCK_PAYMENTS.map((payment) => (
            <div
              key={payment.id}
              className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-stone-900">
                  {payment.transactionId}
                </span>
                {getStatusBadge(payment.status)}
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>
                  {payment.purpose === 'interest' ? 'Express Interest Payment' : 'Premium Subscription'}
                </span>
                <strong className="text-rose-800 font-bold">
                  {formatCurrency(payment.amount, payment.currency)}
                </strong>
              </div>
              <p className="text-[11px] text-stone-400">Gateway: {payment.gateway} • {payment.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </MemberLayout>
  );
}
