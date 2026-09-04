'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Layout, HelpCircle, ShieldCheck, Newspaper, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function AdminCmsHubPage() {
  const cmsModules = [
    { title: 'Static Pages', desc: 'About Us, Terms, Privacy Policy pages', href: '/admin/cms/pages', icon: FileText, count: '6 Pages' },
    { title: 'Homepage Editor', desc: 'Section ordering, toggles & CTA links', href: '/admin/cms/homepage', icon: Layout, count: '5 Sections' },
    { title: 'FAQ Management', desc: 'Question & answer categories', href: '/admin/cms/faq', icon: HelpCircle, count: '12 FAQs' },
    { title: 'Safety Center CMS', desc: 'Safety tips & fraud awareness guides', href: '/admin/cms/safety', icon: ShieldCheck, count: 'Editable' },
    { title: 'Blog & Articles', desc: 'Matrimonial advice articles & SEO', href: '/admin/cms/articles', icon: Newspaper, count: '4 Articles' },
    { title: 'Banners & Promotions', desc: 'Homepage & promotional banner ads', href: '/admin/cms/banners', icon: ImageIcon, count: '3 Banners' },
    { title: 'Public Media Library', desc: 'CMS images & marketing assets', href: '/admin/cms/media', icon: ImageIcon, count: '24 Files' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            <span>Content Management System (CMS) Suite</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage public website content, homepage sections, FAQs, safety advice, and SEO metadata.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cmsModules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.href} href={m.href}>
              <div className="bg-stone-900 p-6 rounded-3xl border border-stone-800 hover:border-purple-700 transition-all space-y-3 shadow-md group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-stone-950 text-stone-400 border border-stone-800">
                    {m.count}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{m.desc}</p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-400 group-hover:text-purple-300">
                  <span>Manage Content</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
