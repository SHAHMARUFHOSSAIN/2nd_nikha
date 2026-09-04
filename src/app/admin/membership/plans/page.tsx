'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Crown, DollarSign, Edit, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminMembershipPlansPage() {
  const { membershipPlans, updateMembershipPlanPrice, togglePlanStatus } = useAdmin();
  
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number>(1499);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleOpenEdit = (planId: string, currentPrice: number) => {
    setEditingPlanId(planId);
    setNewPriceInput(currentPrice);
    setShowConfirmModal(true);
  };

  const handleConfirmPriceChange = () => {
    if (editingPlanId) {
      updateMembershipPlanPrice(editingPlanId, newPriceInput);
      setNotice(`Membership plan pricing updated to ${formatCurrency(newPriceInput)}.`);
      setShowConfirmModal(false);
      setEditingPlanId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-400" />
            <span>Membership Plans & Centralized Pricing</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage membership pass pricing, feature sets, and active plan availability.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {membershipPlans.map((plan) => (
          <div key={plan.id} className="bg-stone-900 rounded-3xl p-6 border border-stone-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-white">{plan.name}</h3>
                <span className="text-xs text-stone-400 font-mono">{plan.billingPeriod} Billing</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {plan.status}
              </span>
            </div>

            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-mono block">Current Production Rate</span>
                <span className="font-serif font-bold text-2xl text-emerald-400">{formatCurrency(plan.price)}</span>
              </div>
              <button
                onClick={() => handleOpenEdit(plan.id, plan.price)}
                className="px-3.5 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Price</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block uppercase">Features Included:</span>
              <ul className="space-y-1 text-xs text-stone-300">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif font-bold text-lg text-white">Confirm Production Price Change</h3>
            </div>
            <p className="text-xs text-stone-400">
              Changing production membership pricing will affect future checkout transactions and subscriptions.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-300">New Price (BDT):</label>
              <input
                type="number"
                value={newPriceInput}
                onChange={(e) => setNewPriceInput(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 text-xs font-bold text-stone-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={handleConfirmPriceChange}
                className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md"
              >
                Confirm Price Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
