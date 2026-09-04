'use client';

import React, { useState } from 'react';
import { ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSafetyCmsPage() {
  const [safetyNoticeText, setSafetyNoticeText] = useState(
    'Never send money or financial wire transfers to anyone you meet online. Always meet in public places with family involvement.'
  );
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = () => {
    setNotice('Safety Center advice updated successfully.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Safety Center CMS & Guidelines</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Update matrimonial safety tips, scam awareness warnings, and meeting safety rules.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4 shadow-xl">
        <h3 className="font-serif font-bold text-lg text-white">Platform Safety Banner Notice</h3>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-300">Global Safety Guidance Text:</label>
          <textarea
            rows={4}
            value={safetyNoticeText}
            onChange={(e) => setSafetyNoticeText(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
          />
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Safety Guidance</span>
        </button>
      </div>
    </div>
  );
}
