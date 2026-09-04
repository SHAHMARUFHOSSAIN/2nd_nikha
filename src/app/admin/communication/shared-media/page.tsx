'use client';

import React from 'react';
import { FileSpreadsheet, Lock, Shield } from 'lucide-react';

export default function AdminSharedMediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-purple-400" />
            <span>Shared Media Audit Queue</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Role-controlled privacy audit queue for reported or flagged private photo shares.
          </p>
        </div>
      </div>

      <div className="bg-stone-900 rounded-3xl p-8 border border-stone-800 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-lg text-white">Role-Controlled Privacy Protection</h3>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Private communication media between matched members is protected under privacy compliance rules. Audit logs will record any inspection.
        </p>
      </div>
    </div>
  );
}
