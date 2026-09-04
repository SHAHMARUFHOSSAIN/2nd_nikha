'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/lib/admin-context';
import { FileText, Edit, CheckCircle2 } from 'lucide-react';
import { CmsPage } from '@/types/admin';

export default function AdminCmsPagesPage() {
  const { cmsPages, saveCmsPage } = useAdmin();
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      saveCmsPage(editingPage);
      setNotice(`CMS Page "${editingPage.title}" updated successfully.`);
      setEditingPage(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            <span>Static Pages CMS</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Edit titles, slugs, body content, and SEO metadata for static platform pages.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 bg-emerald-950 border border-emerald-800 text-emerald-200 rounded-2xl text-xs flex items-center justify-between font-medium">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-white underline">Dismiss</button>
        </div>
      )}

      <div className="bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
              <tr>
                <th className="p-4">Page Title</th>
                <th className="p-4">Slug</th>
                <th className="p-4">SEO Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {cmsPages.map((page) => (
                <tr key={page.id} className="hover:bg-stone-800/40 transition-colors">
                  <td className="p-4 font-serif font-bold text-white text-sm">{page.title}</td>
                  <td className="p-4 font-mono text-purple-400">/{page.slug}</td>
                  <td className="p-4 text-stone-300 truncate max-w-xs">{page.seoTitle}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {page.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-stone-400">{page.updatedAt}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setEditingPage(page)}
                      className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold transition-all flex items-center gap-1 ml-auto"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Content</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingPage && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSave} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl my-8">
            <h3 className="font-serif font-bold text-lg text-white">Edit Page: {editingPage.title}</h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-300">Title:</label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-stone-300">SEO Title:</label>
                <input
                  type="text"
                  value={editingPage.seoTitle}
                  onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-2.5 text-xs text-stone-200"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-stone-300">Body Content:</label>
              <textarea
                rows={6}
                value={editingPage.content}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3 text-xs text-stone-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingPage(null)} className="px-4 py-2 text-xs text-stone-400 font-bold">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs">
                Save Page Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
