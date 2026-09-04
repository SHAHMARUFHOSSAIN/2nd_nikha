'use client';

import React from 'react';
import { useAdmin } from '@/lib/admin-context';
import { Image as ImageIcon, Plus, Edit } from 'lucide-react';
import Image from 'next/image';

export default function AdminBannersCmsPage() {
  const { cmsBanners } = useAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-purple-400" />
            <span>Banners & Announcements CMS</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage promotional banners, verification callouts, and safety announcement sliders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cmsBanners.map((banner) => (
          <div key={banner.id} className="bg-stone-900 rounded-3xl p-5 border border-stone-800 space-y-3 shadow-xl">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-950 border border-stone-800">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-white text-base">{banner.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                {banner.status}
              </span>
            </div>
            <p className="text-xs text-stone-400">{banner.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
