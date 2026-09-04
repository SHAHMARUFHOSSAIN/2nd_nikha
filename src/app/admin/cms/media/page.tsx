'use client';

import React from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Image as ImageIcon, Upload, Copy, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminMediaCmsPage() {
  const { cmsMedia } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-purple-400" />
            <span>Public CMS Media Library</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Store and manage public marketing images and CMS assets. Completely isolated from private member profile media.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cmsMedia.map((m) => (
          <div key={m.id} className="bg-stone-900 rounded-3xl p-3 border border-stone-800 space-y-2">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
              <Image src={m.fileUrl} alt={m.fileName} fill className="object-cover" />
            </div>
            <span className="text-[11px] font-bold text-white block truncate">{m.fileName}</span>
            <span className="text-[10px] text-stone-500 font-mono block">{m.fileSize} • {m.uploadedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
