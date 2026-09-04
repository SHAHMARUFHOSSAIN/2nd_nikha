'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { BrandLogo } from '@/components/ui/brand-logo';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { Heart, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide public footer inside Admin Portal
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <Container size="xl" className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & About Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block bg-white p-2 rounded-2xl">
              <BrandLogo size="md" />
            </Link>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Dedicated, trustworthy matrimonial platform designed specifically for divorced, widowed, single parents, and mature singles seeking a genuine second chance at marriage.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Profiles & Privacy Security</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Quick Links</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/" className="hover:text-rose-400">Home</Link></li>
              <li><Link href="/about" className="hover:text-rose-400">About Us</Link></li>
              <li><Link href="/search" className="hover:text-rose-400">Search Matches</Link></li>
              <li><Link href="/membership" className="hover:text-rose-400">Membership Plans</Link></li>
              <li><Link href="/success-stories" className="hover:text-rose-400">Success Stories</Link></li>
            </ul>
          </div>

          {/* Member Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Member Portal</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/login" className="hover:text-rose-400">Member Login</Link></li>
              <li><Link href="/register" className="hover:text-rose-400">Register Profile</Link></li>
              <li><Link href="/member" className="hover:text-rose-400">Member Dashboard</Link></li>
              <li><Link href="/member/interests" className="hover:text-rose-400">Interests & Matches</Link></li>
              <li><Link href="/member/subscription" className="hover:text-rose-400">Manage Subscription</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Contact Support</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Gulshan 2, Dhaka, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500 shrink-0" />
                <span>+880 1700-000000</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0" />
                <span>support@2ndchance.com</span>
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 {BRAND_NAME}. All rights reserved. {BRAND_TAGLINE}</p>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-stone-300">Terms of Service</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-rose-400 text-stone-400">Admin Login</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
