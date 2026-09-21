'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { BrandLogo } from '@/components/ui/brand-logo';
import { BRAND_NAME } from '@/lib/constants';
import { Heart, ShieldCheck, Mail, Phone, MapPin, Building2, Landmark, Sparkles } from 'lucide-react';

import { useAuth } from '@/lib/auth-context';
import { useAdmin } from '@/lib/admin-context';

export function Footer() {
  const pathname = usePathname();
  const { isLoggedIn, userRole } = useAuth();
  const isPaidMember = isLoggedIn && (userRole === 'PREMIUM' || userRole === 'ADMIN');
  const { settings, cmsBanners } = useAdmin();

  // Company/legal details are DB-backed (admin-editable). Never render made-up
  // values: each field only shows when a real value exists in the database.
  const company = settings?.company || {};
  const legalName = company?.legalName || BRAND_NAME;
  const registeredAddress = company?.registeredAddress || '';
  const tradeLicense = company?.tradeLicense || '';
  const managementDetails = company?.managementDetails || '';
  const supportEmail = company?.supportEmail || settings?.general?.supportEmail || '';
  const supportPhone = company?.supportPhone || '';

  // Payment/SSLCommerz banner: reuses the existing DB-backed CMS banner
  // infrastructure. Only the first active banner is shown; if none is
  // configured the banner area is hidden entirely.
  const paymentBanner =
    Array.isArray(cmsBanners) && cmsBanners.length > 0
      ? cmsBanners.find((b: any) => b?.status === 'ACTIVE')
      : undefined;

  // Hide public footer on landing gateway (when not a paid member), register (/register), login (/login), and Admin Portal
  if ((pathname === '/' && !isPaidMember) || pathname === '/register' || pathname === '/login' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <Container size="xl" className="space-y-12">

        {/* Payment / SSLCommerz banner — shows only when an active DB-backed banner is configured */}
        {paymentBanner && (
          <div className="rounded-2xl overflow-hidden border border-stone-700 bg-stone-800/60">
{paymentBanner.image ? (
            <a
              href={paymentBanner.ctaUrl || '#'}
              target={paymentBanner.ctaUrl ? '_blank' : undefined}
              rel={paymentBanner.ctaUrl ? 'noopener noreferrer' : undefined}
              className="block relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={paymentBanner.image}
                alt={paymentBanner.title || 'Payment banner'}
                className="w-full h-auto max-h-28 object-cover"
              />
              {(paymentBanner.title || paymentBanner.description) && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-950/70 via-stone-900/60 to-pink-950/70">
                  <div className="text-center px-4">
                    <p className="text-white font-serif font-bold text-sm sm:text-base">{paymentBanner.title}</p>
                    {paymentBanner.description && (
                      <p className="text-stone-300 text-[11px] mt-0.5">{paymentBanner.description}</p>
                    )}
                  </div>
                </div>
              )}
            </a>
          ) : (
            <div className="p-3 bg-gradient-to-r from-pink-950/80 via-stone-900 to-pink-950/80 text-center text-xs font-bold text-pink-100">
              {paymentBanner.title || 'Secured by SSLCommerz'}
            </div>
          )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
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
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Legal & Support</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/terms" className="hover:text-rose-400">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-rose-400">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-rose-400">Subscription &amp; Refund Policy</Link></li>
              <li><Link href="/contact" className="hover:text-rose-400">Contact Us</Link></li>
            </ul>
          </div>

          {/* Member Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-base">Member Portal</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link href="/login" className="hover:text-rose-400">Member Login</Link></li>
              <li><Link href="/checkout?plan=weekly" className="hover:text-rose-400">Register Profile</Link></li>
              <li><Link href="/member" className="hover:text-rose-400">Member Dashboard</Link></li>
              <li><Link href="/member/interests" className="hover:text-rose-400">Interests &amp; Matches</Link></li>
              <li><Link href="/member/subscription" className="hover:text-rose-400">Manage Subscription</Link></li>
            </ul>
          </div>

        </div>

        {/* Company & Legal Information (DB-backed; only renders real values) */}
        <div className="pt-8 border-t border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-rose-400" />
              <span>Company &amp; Legal</span>
            </h5>
            <p className="text-[11px] text-stone-400 leading-relaxed">{legalName}</p>
            {registeredAddress && (
              <p className="text-[11px] text-stone-400 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>{registeredAddress}</span>
              </p>
            )}
            {tradeLicense && (
              <p className="text-[11px] text-stone-400 leading-relaxed flex items-start gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>Trade License: {tradeLicense}</span>
              </p>
            )}
            {managementDetails && (
              <p className="text-[11px] text-stone-400 leading-relaxed flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                <span>{managementDetails}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-white">Support</h5>
            {supportEmail && (
              <a href={`mailto:${supportEmail}`} className="text-[11px] text-stone-400 hover:text-rose-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-500" />
                <span>{supportEmail}</span>
              </a>
            )}
            {supportPhone && (
              <a href={`tel:${supportPhone}`} className="text-[11px] text-stone-400 hover:text-rose-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-500" />
                <span>{supportPhone}</span>
              </a>
            )}
            {!supportEmail && !supportPhone && (
              <p className="text-[11px] text-stone-500">Contact details coming soon.</p>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 {legalName || BRAND_NAME}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-stone-300">Terms of Service</Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-stone-300">Refund Policy</Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-rose-400 text-stone-400">Admin Login</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
