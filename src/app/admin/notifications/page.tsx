'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Bell, Send, CheckCircle2, Users, Crown, ShieldCheck } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { adminNotifications, addAdminNotification } = useAdmin();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'ALL' | 'PREMIUM' | 'VERIFIED'>('ALL');
  const [type, setType] = useState<'ANNOUNCEMENT' | 'SAFETY' | 'PROMOTION' | 'SYSTEM'>('ANNOUNCEMENT');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addAdminNotification({
      title,
      message,
      type,
      audience,
      status: 'SENT',
    });

    setNotice(`Notification broadcasted to ${audience} members successfully.`);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-purple-400" />
            <span>Admin Notifications & Broadcast Center</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Create, target, and broadcast system notifications to members.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      {/* Broadcast Form & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Composer Form */}
        <div className="lg:col-span-5 bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4 shadow-xl">
          <h3 className="font-serif font-bold text-lg text-white">Create Broadcast Notification</h3>

          <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-stone-300">Notification Title:</label>
              <input
                type="text"
                placeholder="e.g. Platform Safety Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">Target Audience:</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200 focus:outline-none"
                >
                  <option value="ALL">All Members</option>
                  <option value="PREMIUM">Premium Members</option>
                  <option value="VERIFIED">Verified Members</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-300">Category Type:</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200 focus:outline-none"
                >
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                  <option value="SAFETY">SAFETY</option>
                  <option value="PROMOTION">PROMOTION</option>
                  <option value="SYSTEM">SYSTEM</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-300">Message Content:</label>
              <textarea
                rows={4}
                placeholder="Enter notification message text..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200 focus:outline-none focus:border-rose-600"
              />
            </div>

            <button
              type="submit"
              disabled={!title.trim() || !message.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-800 to-rose-900 hover:from-purple-700 hover:to-rose-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notification</span>
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="lg:col-span-7 bg-stone-900 p-6 rounded-3xl border border-stone-800 space-y-4">
          <h3 className="font-serif font-bold text-lg text-white">Broadcast History</h3>

          <div className="space-y-3">
            {adminNotifications.map((notif) => (
              <div key={notif.id} className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-white">{notif.title}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    {notif.audience}
                  </span>
                </div>
                <p className="text-xs text-stone-300">{notif.message}</p>
                <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pt-1">
                  <span>Type: {notif.type}</span>
                  <span>{notif.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
