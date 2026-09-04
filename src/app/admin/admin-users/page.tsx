'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { UserCog, Plus, Shield, CheckCircle2, Ban } from 'lucide-react';
import { AdminRole } from '@/types/admin';

export default function AdminUsersPage() {
  const { adminUsers, addAdminUser, toggleAdminUserStatus } = useAdmin();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('MODERATOR');
  const [notice, setNotice] = useState<string | null>(null);

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addAdminUser({
      name,
      email,
      role,
      permissions: ['members.view', 'moderation.view', 'moderation.resolve'],
      status: 'ACTIVE',
    });

    setNotice(`New Admin Account created for ${name} (${role}).`);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <UserCog className="w-6 h-6 text-purple-400" />
            <span>Admin Users & System Operators</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage administrative user accounts, assign roles, and activate or deactivate access.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Create Form */}
        <div className="lg:col-span-5 bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4 shadow-xl">
          <h3 className="font-serif font-bold text-lg text-white">Create New Admin User</h3>
          <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Full Name:</label>
              <input
                type="text"
                placeholder="Admin Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Admin Email:</label>
              <input
                type="email"
                placeholder="name@2ndchance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Assigned Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200"
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="SUPPORT">SUPPORT</option>
                <option value="FINANCE">FINANCE</option>
                <option value="CONTENT_MANAGER">CONTENT_MANAGER</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!name.trim() || !email.trim()}
              className="w-full py-2.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold shadow-md disabled:opacity-50"
            >
              Create Admin Account
            </button>
          </form>
        </div>

        {/* Admin List */}
        <div className="lg:col-span-7 bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
                <tr>
                  <th className="p-4">Admin Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80 text-stone-300">
                {adminUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="p-4">
                      <span className="font-serif font-bold text-white block">{u.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{u.email}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-purple-300">{u.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-stone-400">{u.lastLogin}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          toggleAdminUserStatus(u.id);
                          setNotice(`Admin ${u.name} status updated.`);
                        }}
                        className="px-3 py-1 bg-stone-800 text-stone-300 rounded-xl font-bold hover:bg-stone-700"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
