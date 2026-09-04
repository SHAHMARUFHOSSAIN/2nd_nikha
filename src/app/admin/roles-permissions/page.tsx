'use client';

import React from 'react';
import { Shield, Check, Lock } from 'lucide-react';

export default function AdminRolesPermissionsPage() {
  const roles = [
    { role: 'SUPER_ADMIN', desc: 'Full unrestricted system controller access', count: 'Full (26 Permissions)' },
    { role: 'ADMIN', desc: 'System management, member curation & finance', count: '22 Permissions' },
    { role: 'MODERATOR', desc: 'Member NID verification, chat & profile moderation', count: '8 Permissions' },
    { role: 'SUPPORT', desc: 'Customer support, interest status & general inquiry', count: '5 Permissions' },
    { role: 'FINANCE', desc: 'SSLCommerz payment audits, transaction ledgers & refunds', count: '6 Permissions' },
    { role: 'CONTENT_MANAGER', desc: 'Static pages, articles, banners & homepage CMS', count: '7 Permissions' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>Roles & Permissions RBAC Matrix</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Configure granular role-based access control rules across system modules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((r) => (
          <div key={r.role} className="bg-stone-900 rounded-3xl p-6 border border-stone-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                {r.role}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">{r.count}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
