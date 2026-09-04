'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Layout, Eye, EyeOff, CheckCircle2, MoveUp, MoveDown } from 'lucide-react';

export default function AdminHomepageCmsPage() {
  const { homepageSections, toggleHomepageSection } = useAdmin();
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Layout className="w-6 h-6 text-purple-400" />
            <span>Homepage Section Editor</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Toggle, reorder, and edit section titles across the public homepage while preserving brand styling.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      <div className="space-y-4">
        {homepageSections.map((section, i) => (
          <div
            key={section.id}
            className="bg-stone-900 rounded-3xl p-5 border border-stone-800 flex items-center justify-between gap-4 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-stone-950 border border-stone-800 text-stone-400 font-mono text-xs flex items-center justify-center font-bold">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-serif font-bold text-white text-base">{section.name}</h3>
                <p className="text-xs text-purple-300 font-medium">Title: "{section.title}"</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  toggleHomepageSection(section.id);
                  setNotice(`Section "${section.name}" visibility updated.`);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  section.enabled
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                {section.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{section.enabled ? 'Section Enabled' : 'Section Hidden'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
