import React from 'react';
import { Check, Lock } from 'lucide-react';
import { MEMBERSHIP_CONFIG } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export function PlanComparisonTable() {
  const features = [
    { name: 'Create Verified Profile', free: true, premium: true },
    { name: 'Browse All Candidate Profiles', free: true, premium: true },
    { name: 'Advanced Search & Filters', free: true, premium: true },
    { name: 'Shortlist Favorite Profiles', free: true, premium: true },
    { name: 'Receive Express Interest Requests', free: true, premium: true },
    { name: 'View Compatibility Score & Reasons', free: true, premium: true },
    { name: 'Send Express Interest Requests', free: false, premium: true },
    { name: 'Direct Chat After Mutual Match', free: false, premium: true },
    { name: 'Access Private Photo Galleries', free: false, premium: true },
    { name: 'Verified WhatsApp & Phone Contact Sharing', free: false, premium: true },
  ];

  return (
    <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-pink-50/50 border-b border-pink-100 text-center">
        <h3 className="font-serif font-bold text-xl text-stone-900">
          Detailed Feature Comparison
        </h3>
        <p className="text-xs text-stone-600 mt-1">
          Transparent breakdown of Free vs Paid membership capabilities.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100 text-stone-700">
              <th className="p-4 font-bold uppercase tracking-wider">Feature</th>
              <th className="p-4 font-bold uppercase tracking-wider text-center w-36">Free Plan</th>
              <th className="p-4 font-bold uppercase tracking-wider text-center w-48 bg-pink-100/50 text-pink-900">
                Paid Plans ({formatCurrency(MEMBERSHIP_CONFIG.WEEKLY_BDT, 'BDT')}/wk / {formatCurrency(MEMBERSHIP_CONFIG.MONTHLY_BDT, 'BDT')}/mo)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-700">
            {features.map((feat, idx) => (
              <tr key={idx} className="hover:bg-pink-50/30 transition-colors">
                <td className="p-4 font-medium">{feat.name}</td>
                <td className="p-4 text-center">
                  {feat.free ? (
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                      <Check className="w-4 h-4 text-emerald-600" />
                      Included
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-stone-400 font-normal">
                      <Lock className="w-3.5 h-3.5" />
                      Locked
                    </span>
                  )}
                </td>
                <td className="p-4 text-center bg-pink-50/20 font-bold text-pink-800">
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Included
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
