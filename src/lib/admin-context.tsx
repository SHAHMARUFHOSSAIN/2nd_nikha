'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminUser,
  ModerationReport,
  VerificationQueueItem,
  RefundRequest,
  MembershipPlanAdmin,
  AdminNotification,
  CmsPage,
  CmsFaq,
  CmsArticle,
  CmsBanner,
  CmsMediaItem,
  AuditLog,
  HomepageSectionConfig,
} from '@/types/admin';
import { Profile } from '@/types';
import { MOCK_PROFILES } from '@/data/mock-data';
import { OFFICIAL_2ND_CHANCE_LOGO } from '@/lib/official-logo-data';
import {
  MOCK_ADMIN_USERS,
  MOCK_VERIFICATION_QUEUE,
  MOCK_MODERATION_REPORTS,
  MOCK_REFUND_REQUESTS,
  MOCK_MEMBERSHIP_PLANS_ADMIN,
  MOCK_CMS_PAGES,
  MOCK_CMS_FAQS,
  MOCK_CMS_ARTICLES,
  MOCK_CMS_BANNERS,
  MOCK_CMS_MEDIA,
  MOCK_HOMEPAGE_SECTIONS,
  MOCK_AUDIT_LOGS,
  MOCK_ADMIN_NOTIFICATIONS,
} from '@/data/admin-mock-data';

interface AdminContextType {
  members: Profile[];
  adminUsers: AdminUser[];
  verificationQueue: VerificationQueueItem[];
  moderationReports: ModerationReport[];
  refundRequests: RefundRequest[];
  membershipPlans: MembershipPlanAdmin[];
  cmsPages: CmsPage[];
  cmsFaqs: CmsFaq[];
  cmsArticles: CmsArticle[];
  cmsBanners: CmsBanner[];
  cmsMedia: CmsMediaItem[];
  homepageSections: HomepageSectionConfig[];
  adminNotifications: AdminNotification[];
  auditLogs: AuditLog[];
  settings: Record<string, any>;
  
  // Full CRUD Actions for Single Page Manager
  addMember: (member: any) => void;
  updateMember: (id: string, member: Partial<Profile>) => void;
  deleteMember: (id: string) => void;
  purgeDummyProfiles: () => void;
  
  approveVerification: (id: string, notes?: string) => void;
  rejectVerification: (id: string, reason: string) => void;
  requestVerificationChanges: (id: string, instructions: string) => void;
  deleteVerification: (id: string) => void;

  addModerationReport: (report: Omit<ModerationReport, 'id' | 'createdAt'>) => void;
  resolveReport: (reportId: string, actionTaken: string, notes: string) => void;
  dismissReport: (reportId: string) => void;
  deleteReport: (reportId: string) => void;
  
  approveRefund: (refundId: string) => void;
  rejectRefund: (refundId: string, reason: string) => void;
  
  addMembershipPlan: (plan: Omit<MembershipPlanAdmin, 'id'>) => void;
  updateMembershipPlanPrice: (planId: string, newPrice: number) => void;
  togglePlanStatus: (planId: string) => void;
  deleteMembershipPlan: (planId: string) => void;
  
  addAdminNotification: (notif: Omit<AdminNotification, 'id' | 'createdAt'>) => void;
  
  saveCmsPage: (page: CmsPage) => void;
  deleteCmsPage: (id: string) => void;
  saveCmsFaq: (faq: CmsFaq) => void;
  deleteCmsFaq: (id: string) => void;
  saveCmsArticle: (article: CmsArticle) => void;
  deleteCmsArticle: (id: string) => void;
  saveCmsBanner: (banner: CmsBanner) => void;
  deleteCmsBanner: (id: string) => void;
  toggleHomepageSection: (id: string) => void;
  
  addAdminUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateAdminUser: (id: string, user: Partial<AdminUser>) => void;
  toggleAdminUserStatus: (id: string) => void;
  deleteAdminUser: (id: string) => void;
  
  isLoaded: boolean;
  updateSettings: (category: string, values: Record<string, any>) => void;
  batchUpdateSettings: (allUpdates: Record<string, any>) => void;
  addAuditLog: (action: string, target: string, description: string) => void;
}

const AdminContext = createContext<AdminContextType>({
  members: MOCK_PROFILES,
  adminUsers: MOCK_ADMIN_USERS,
  verificationQueue: MOCK_VERIFICATION_QUEUE,
  moderationReports: MOCK_MODERATION_REPORTS,
  refundRequests: MOCK_REFUND_REQUESTS,
  membershipPlans: MOCK_MEMBERSHIP_PLANS_ADMIN,
  cmsPages: MOCK_CMS_PAGES,
  cmsFaqs: MOCK_CMS_FAQS,
  cmsArticles: MOCK_CMS_ARTICLES,
  cmsBanners: MOCK_CMS_BANNERS,
  cmsMedia: MOCK_CMS_MEDIA,
  homepageSections: MOCK_HOMEPAGE_SECTIONS,
  adminNotifications: MOCK_ADMIN_NOTIFICATIONS,
  auditLogs: MOCK_AUDIT_LOGS,
  isLoaded: false,
  settings: {
    general: { siteName: '2nd Nikha Matrimonial', supportEmail: 'support@2ndnikah.com' },
    payment: { activeGateway: 'SSLCOMMERZ', currency: 'BDT', sslCommerzMode: 'LIVE' },
    branding: {
      logoUrl: OFFICIAL_2ND_CHANCE_LOGO,
      faviconUrl: '/favicon.ico',
      heroTitle: 'Every heart deserves a 2nd Chance',
      heroSubtitle: 'A trusted matrimonial sanctuary designed for divorced, widowed, single parents, and mature singles seeking a genuine, lifelong companion.',
      heroImageUrl: '',
    },
  },
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
  purgeDummyProfiles: () => {},
  approveVerification: () => {},
  rejectVerification: () => {},
  requestVerificationChanges: () => {},
  deleteVerification: () => {},
  addModerationReport: () => {},
  resolveReport: () => {},
  dismissReport: () => {},
  deleteReport: () => {},
  approveRefund: () => {},
  rejectRefund: () => {},
  addMembershipPlan: () => {},
  updateMembershipPlanPrice: () => {},
  togglePlanStatus: () => {},
  deleteMembershipPlan: () => {},
  addAdminNotification: () => {},
  saveCmsPage: () => {},
  deleteCmsPage: () => {},
  saveCmsFaq: () => {},
  deleteCmsFaq: () => {},
  saveCmsArticle: () => {},
  deleteCmsArticle: () => {},
  saveCmsBanner: () => {},
  deleteCmsBanner: () => {},
  toggleHomepageSection: () => {},
  addAdminUser: () => {},
  updateAdminUser: () => {},
  toggleAdminUserStatus: () => {},
  deleteAdminUser: () => {},
  updateSettings: () => {},
  batchUpdateSettings: () => {},
  addAuditLog: () => {},
});

const DEFAULT_SETTINGS = {
  general: { siteName: '2nd Nikha Matrimonial', supportEmail: 'support@2ndnikah.com' },
  payment: { activeGateway: 'SSLCOMMERZ', currency: 'BDT', sslCommerzMode: 'LIVE' },
  branding: {
    logoUrl: OFFICIAL_2ND_CHANCE_LOGO,
    faviconUrl: '/favicon.ico',
    heroTitle: 'Every heart deserves a 2nd Chance',
    heroSubtitle: 'Designed specifically for divorced, widowed, single parents, and mature singles in Bangladesh & global NRB expats.',
    heroImageUrl: '',
  },
};

const SETTINGS_META_KEY = '_settingsUpdatedAt';

function savedAtOf(value: unknown): number {
  if (value && typeof value === 'object' && typeof (value as any)[SETTINGS_META_KEY] === 'number') {
    return (value as any)[SETTINGS_META_KEY] as number;
  }
  return 0;
}

function mergeSettingsByFreshness(local: Record<string, any>, remote: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...(local || {}) };
  const localTs = savedAtOf(local);
  const remoteTs = savedAtOf(remote);

  if (remoteTs > localTs) {
    // Remote (DB/other source) is newer: remote wins, local fills gaps.
    const merged: Record<string, any> = { ...(remote || {}) };
    for (const [key, value] of Object.entries(local || {})) {
      if (key === SETTINGS_META_KEY) continue;
      if (merged[key] === undefined && value !== undefined) merged[key] = value;
    }
    return merged;
  }

  // Local/session is newer (or tied): local wins, remote fills gaps.
  for (const [key, value] of Object.entries(remote || {})) {
    if (key === SETTINGS_META_KEY) continue;
    if (out[key] === undefined && value !== undefined) out[key] = value;
  }
  return out;
}

function normalizeBranding(branding: any): any {
  if (branding && typeof branding === 'object') {
    if (branding.heroImageUrl && branding.heroImageUrl.includes('unsplash.com')) {
      branding.heroImageUrl = '';
    }
    if (!branding.logoUrl || branding.logoUrl === '/images/logo.png' || branding.logoUrl.startsWith('data:image/svg+xml;utf8')) {
      branding.logoUrl = OFFICIAL_2ND_CHANCE_LOGO;
    }
  }
  return branding;
}

function sanitizeSettings(settings: Record<string, any>): Record<string, any> {
  const copy = { ...(settings || {}) };
  if (copy.branding) copy.branding = normalizeBranding({ ...copy.branding });
  copy.payment = {
    ...(copy.payment || {}),
    activeGateway: 'SSLCOMMERZ',
    currency: 'BDT',
    sslCommerzMode: 'LIVE',
    sslCommerzStoreId: 'ndnikah0live',
    paystationMerchantId: 'ndnikah0live',
    paystationMode: 'live',
  };
  return copy;
}

function readLocalSettings(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('2ndchance_admin_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        return sanitizeSettings(parsed);
      }
    }
  } catch (e) {
    try { localStorage.removeItem('2ndchance_admin_settings'); } catch {}
  }
  return {};
}

export function AdminProvider({ children, initialSettings = {} }: { children: React.ReactNode; initialSettings?: Record<string, any> }) {
  const [members, setMembers] = useState<Profile[]>(MOCK_PROFILES);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [verificationQueue, setVerificationQueue] = useState<VerificationQueueItem[]>(MOCK_VERIFICATION_QUEUE);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(MOCK_MODERATION_REPORTS);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(MOCK_REFUND_REQUESTS);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlanAdmin[]>(MOCK_MEMBERSHIP_PLANS_ADMIN);
  const [cmsPages, setCmsPages] = useState<CmsPage[]>(MOCK_CMS_PAGES);
  const [cmsFaqs, setCmsFaqs] = useState<CmsFaq[]>(MOCK_CMS_FAQS);
  const [cmsArticles, setCmsArticles] = useState<CmsArticle[]>(MOCK_CMS_ARTICLES);
  const [cmsBanners, setCmsBanners] = useState<CmsBanner[]>(MOCK_CMS_BANNERS);
  const [cmsMedia, setCmsMedia] = useState<CmsMediaItem[]>(MOCK_CMS_MEDIA);
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(MOCK_HOMEPAGE_SECTIONS);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(MOCK_ADMIN_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize settings synchronously: merge SSR-provided DB settings with the
  // latest browser localStorage so the very first client render already shows
  // admin-saved hero data (prevents the dummy-to-real flash and hydration mismatches).
  const [settings, setSettings] = useState<Record<string, any>>(() => {
    const base = { ...DEFAULT_SETTINGS, ...sanitizeSettings(initialSettings || {}) };
    const local = readLocalSettings();
    if (Object.keys(local).length > 0) {
      return mergeSettingsByFreshness(base, sanitizeSettings(local));
    }
    return base;
  });

  // Dynamic Browser Favicon Updater (React-safe DOM mutation)
  useEffect(() => {
    if (typeof window !== 'undefined' && settings?.branding?.faviconUrl) {
      try {
        const faviconUrl = settings.branding.faviconUrl;
        const existingLink = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
        if (existingLink) {
          existingLink.href = faviconUrl;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = faviconUrl;
          document.head.appendChild(newLink);
        }
      } catch (e) {}
    }
  }, [settings?.branding?.faviconUrl]);

function harvestRealCandidateProfiles(): Profile[] {
  const result: Profile[] = [];
  if (typeof window === 'undefined') return result;

  const isAlreadyIn = (id: string, email?: string) => {
    return result.some(
      (r) =>
        r.id === id ||
        (email && r.email && r.email.toLowerCase().trim() === email.toLowerCase().trim())
    );
  };

  // 1. Harvest from 2ndchance_registered_accounts
  try {
    const regRaw = localStorage.getItem('2ndchance_registered_accounts');
    if (regRaw) {
      const parsedReg = JSON.parse(regRaw);
      if (Array.isArray(parsedReg)) {
        for (const reg of parsedReg) {
          if (reg && reg.fullName && !isAlreadyIn(reg.id, reg.email)) {
            result.push({
              ...reg,
              photoUrl: reg.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
              isSubscriptionActive: true,
              membershipTier: 'Premium',
            });
          }
        }
      }
    }
  } catch (e) {}

  // 2. Harvest from 2ndchance_checkout_customer (e.g. Hamza Ali)
  try {
    const custRaw = localStorage.getItem('2ndchance_checkout_customer');
    if (custRaw) {
      const cust = JSON.parse(custRaw);
      if (cust && cust.fullName && !isAlreadyIn(`p-cust-${cust.email}`, cust.email)) {
        result.push({
          id: `p-real-${Date.now()}`,
          fullName: cust.fullName,
          email: cust.email || 'hamza.ali@2ndnikah.com',
          phone: cust.phone || '01712345678',
          age: 32,
          gender: 'Male',
          height: "5'9\"",
          maritalStatus: 'Divorced',
          religion: 'Islam',
          motherTongue: 'Bengali',
          location: 'Dhaka, Bangladesh',
          city: 'Dhaka',
          country: 'Bangladesh',
          countryFlag: '🇧🇩',
          education: 'Graduate Degree',
          profession: 'Corporate Service',
          bio: 'Registered verified candidate. Seeking a compatible life partner.',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
          photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600'],
          isVerified: true,
          isSubscriptionActive: true,
          membershipTier: 'Premium',
          createdAt: new Date().toISOString().split('T')[0],
        });
      }
    }
  } catch (e) {}

  // 3. Harvest from 2ndchance_admin_payments
  try {
    const payRaw = localStorage.getItem('2ndchance_admin_payments');
    if (payRaw) {
      const payments = JSON.parse(payRaw);
      if (Array.isArray(payments)) {
        for (const p of payments) {
          if (p && p.customerName && !isAlreadyIn(`p-pay-${p.customerEmail}`, p.customerEmail)) {
            result.push({
              id: p.id || `p-txn-${Date.now()}`,
              fullName: p.customerName,
              email: p.customerEmail || 'paid.member@2ndnikah.com',
              phone: p.customerPhone || '01700000000',
              age: 30,
              gender: 'Male',
              height: "5'8\"",
              maritalStatus: 'Divorced',
              religion: 'Islam',
              motherTongue: 'Bengali',
              location: 'Dhaka, Bangladesh',
              city: 'Dhaka',
              country: 'Bangladesh',
              countryFlag: '🇧🇩',
              education: 'Bachelor Degree',
              profession: 'Service / Business',
              bio: 'Active paid subscriber candidate.',
              photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
              photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600'],
              isVerified: true,
              isSubscriptionActive: true,
              membershipTier: 'Premium',
              createdAt: p.createdAt ? p.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            });
          }
        }
      }
    }
  } catch (e) {}

  // 4. Harvest logged-in user from localStorage 2ndchance_auth_user
  try {
    const authRaw = localStorage.getItem('2ndchance_auth_user');
    if (authRaw) {
      const authUser = JSON.parse(authRaw);
      if (authUser && authUser.fullName && !isAlreadyIn(authUser.id, authUser.email)) {
        result.push({
          ...authUser,
          photoUrl: authUser.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
          isSubscriptionActive: true,
          membershipTier: 'Premium',
        });
      }
    }
  } catch (e) {}

  return result;
}

export function isMockProfileId(id: string | undefined | null): boolean {
  if (!id) return false;
  const mockIds = ['p-101', 'p-102', 'p-103', 'p-104', 'p-105', 'p-106', 'p-107', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5'];
  if (mockIds.includes(id)) return true;
  if (id.startsWith('p-') && !id.startsWith('p-real-') && !id.startsWith('p-cust-') && !id.startsWith('p-txn-')) {
    const rawNum = id.replace('p-', '');
    const num = parseInt(rawNum, 10);
    if (!isNaN(num) && num < 10000) return true;
  }
  return false;
}

function mergeWithMockProfiles(list: Profile[]): Profile[] {
  const result: Profile[] = [];
  const isPurgeEnabled = typeof window !== 'undefined' && localStorage.getItem('2ndchance_purge_dummy_enabled') === 'true';

  // 1. Harvest real candidates (Hamza Ali, newly registered users, checkout customers)
  const realHarvested = harvestRealCandidateProfiles();
  for (const real of realHarvested) {
    if (!isMockProfileId(real.id) && !result.some((r) => r.id === real.id || (r.email && real.email && r.email.toLowerCase() === real.email.toLowerCase()))) {
      result.push(real);
    }
  }

  // 2. Add passed input list (DB / Admin saved members) excluding mock IDs if purged
  if (Array.isArray(list)) {
    for (const item of list) {
      if (!item || !item.fullName) continue;
      if (isPurgeEnabled && isMockProfileId(item.id)) continue;
      if (!result.some((r) => r.id === item.id || (r.email && item.email && r.email.toLowerCase() === item.email.toLowerCase()))) {
        result.push(item);
      }
    }
  }

  // 3. Fallback mock profiles ONLY if purge dummy is NOT enabled
  if (!isPurgeEnabled) {
    for (const mock of MOCK_PROFILES) {
      if (!result.some((m) => m.id === mock.id || (m.email && mock.email && m.email.toLowerCase() === mock.email.toLowerCase()))) {
        result.push(mock);
      }
    }
  }

  return result;
}

  // Hydrate settings, members, articles, banners safely on client after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMembers = localStorage.getItem('2ndchance_admin_members');
        const parsedSaved = savedMembers ? JSON.parse(savedMembers) : [];
        setMembers(mergeWithMockProfiles(parsedSaved));

        const savedArticles = localStorage.getItem('2ndchance_admin_articles');
        if (savedArticles) setCmsArticles(JSON.parse(savedArticles));
        const savedBanners = localStorage.getItem('2ndchance_admin_banners');
        if (savedBanners) setCmsBanners(JSON.parse(savedBanners));
      } catch (e) {
        setMembers(mergeWithMockProfiles([]));
      }
    }

    // 2. Fetch fresh data from MySQL Database APIs with timeout to prevent page hanging
    async function fetchWithTimeout(url: string, timeoutMs: number = 1000) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const cacheBustedUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;
        const res = await fetch(cacheBustedUrl, {
          signal: controller.signal,
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' },
        });
        clearTimeout(timeoutId);
        return await res.json();
      } catch (e) {
        clearTimeout(timeoutId);
        return null;
      }
    }

    async function loadAllDbData() {
      try {
        const isPurged = typeof window !== 'undefined' && localStorage.getItem('2ndchance_purge_dummy_enabled') === 'true';
        const membersUrl = isPurged ? '/api/members?purgeDummy=true' : '/api/members';

        const [settingsRes, membersRes, articlesRes, bannersRes] = await Promise.all([
          fetchWithTimeout('/api/settings'),
          fetchWithTimeout(membersUrl),
          fetchWithTimeout('/api/articles'),
          fetchWithTimeout('/api/banners'),
        ]);

        if (settingsRes?.success && settingsRes?.settings) {
          setSettings((prev) => {
            const remote = sanitizeSettings(settingsRes.settings);
            if (Object.keys(remote).length === 0) return prev;
            const merged = mergeSettingsByFreshness(prev, remote);
            if (typeof window !== 'undefined') {
              try { localStorage.setItem('2ndchance_admin_settings', JSON.stringify(merged)); } catch (e) {}
            }
            return merged;
          });
        }

        if (membersRes?.success && membersRes?.members) {
          const merged = mergeWithMockProfiles(membersRes.members);
          setMembers(merged);
          if (typeof window !== 'undefined') {
            try { localStorage.setItem('2ndchance_admin_members', JSON.stringify(merged)); } catch (e) {}
          }
        }

        if (articlesRes?.success && articlesRes?.articles && articlesRes.articles.length > 0) {
          setCmsArticles(articlesRes.articles);
        }

        if (bannersRes?.success && bannersRes?.banners && bannersRes.banners.length > 0) {
          setCmsBanners(bannersRes.banners);
        }
      } catch (e) {
        console.warn('Could not load initial data from DB APIs:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    const timerId = setTimeout(() => {
      loadAllDbData();
    }, 100);

    return () => clearTimeout(timerId);
  }, []);

  const addAuditLog = (action: string, target: string, description: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminId: 'admin-1',
      adminName: 'Super Admin',
      adminRole: 'SUPER_ADMIN',
      action,
      target,
      description,
      ipAddress: '103.114.12.89',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addMember = (m: any) => {
    const newMember: Profile = {
      ...m,
      id: `p-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => {
      const updated = [newMember, ...prev];
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('2ndchance_admin_members', JSON.stringify(updated)); } catch (e) {}
      }
      return updated;
    });
    try {
      fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      }).catch(() => {});
    } catch (e) {}
    addAuditLog('MEMBER_CREATED', newMember.fullName, `Created new member profile ${newMember.id}`);
  };

  const updateMember = (id: string, data: Partial<Profile>) => {
    let updatedMember: Profile | undefined;
    setMembers((prev) => {
      const updated = prev.map((m) => {
        if (m.id === id) {
          updatedMember = { ...m, ...data };
          return updatedMember;
        }
        return m;
      });
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('2ndchance_admin_members', JSON.stringify(updated)); } catch (e) {}
      }
      return updated;
    });
    if (updatedMember) {
      try {
        fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedMember),
        }).catch(() => {});
      } catch (e) {}
    }
    addAuditLog('MEMBER_UPDATED', `Profile ${id}`, `Updated profile details`);
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      if (typeof window !== 'undefined') {
        try { localStorage.setItem('2ndchance_admin_members', JSON.stringify(updated)); } catch (e) {}
      }
      return updated;
    });
    addAuditLog('MEMBER_DELETED', `Profile ${id}`, `Deleted member profile`);
  };

  const purgeDummyProfiles = () => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('2ndchance_purge_dummy_enabled', 'true'); } catch (e) {}
    }

    const realHarvested = harvestRealCandidateProfiles();

    setMembers((prev) => {
      const nonMockPrev = prev.filter((m) => !isMockProfileId(m.id));
      const combined: Profile[] = [];

      for (const real of realHarvested) {
        if (!isMockProfileId(real.id) && !combined.some((c) => c.id === real.id || (c.email && real.email && c.email.toLowerCase() === real.email.toLowerCase()))) {
          combined.push(real);
        }
      }

      for (const m of nonMockPrev) {
        if (!combined.some((c) => c.id === m.id || (c.email && m.email && c.email.toLowerCase() === m.email.toLowerCase()))) {
          combined.push(m);
        }
      }

      if (typeof window !== 'undefined') {
        try { localStorage.setItem('2ndchance_admin_members', JSON.stringify(combined)); } catch (e) {}
      }

      try {
        fetch('/api/members?purgeDummy=true', { method: 'DELETE' }).catch(() => {});
      } catch (e) {}

      return combined;
    });

    addAuditLog('DUMMY_PROFILES_PURGED', 'Candidate Database', 'Purged all dummy mock profiles. Only real candidate accounts remain.');
  };

  const approveVerification = (id: string, notes?: string) => {
    setVerificationQueue((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'VERIFIED', reviewNotes: notes } : v))
    );
    addAuditLog('VERIFICATION_APPROVED', `Request ${id}`, notes || 'NID Verified');
  };

  const rejectVerification = (id: string, reason: string) => {
    setVerificationQueue((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'REJECTED', reviewNotes: reason } : v))
    );
    addAuditLog('VERIFICATION_REJECTED', `Request ${id}`, `Reason: ${reason}`);
  };

  const requestVerificationChanges = (id: string, instructions: string) => {
    setVerificationQueue((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'CHANGES_REQUESTED', reviewNotes: instructions } : v))
    );
    addAuditLog('VERIFICATION_CHANGES_REQUESTED', `Request ${id}`, instructions);
  };

  const deleteVerification = (id: string) => {
    setVerificationQueue((prev) => prev.filter((v) => v.id !== id));
    addAuditLog('VERIFICATION_DELETED', `Request ${id}`, 'Deleted verification queue item');
  };

  const addModerationReport = (rep: Omit<ModerationReport, 'id' | 'createdAt'>) => {
    const newRep: ModerationReport = {
      ...rep,
      id: `rep-${Date.now()}`,
      createdAt: 'Just now',
    };
    setModerationReports((prev) => [newRep, ...prev]);
    addAuditLog('REPORT_CREATED', `Report ${newRep.id}`, `Target: ${newRep.targetName}`);
  };

  const resolveReport = (reportId: string, actionTaken: string, notes: string) => {
    setModerationReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: 'RESOLVED', resolutionNotes: `${actionTaken}: ${notes}` } : r
      )
    );
    addAuditLog('REPORT_RESOLVED', `Report ${reportId}`, `${actionTaken} — ${notes}`);
  };

  const dismissReport = (reportId: string) => {
    setModerationReports((prev) => prev.filter((r) => r.id !== reportId));
    addAuditLog('REPORT_DISMISSED', `Report ${reportId}`, 'Dismissed report');
  };

  const deleteReport = (reportId: string) => {
    setModerationReports((prev) => prev.filter((r) => r.id !== reportId));
    addAuditLog('REPORT_DELETED', `Report ${reportId}`, 'Deleted report');
  };

  const approveRefund = (refundId: string) => {
    setRefundRequests((prev) =>
      prev.map((r) => (r.id === refundId ? { ...r, status: 'APPROVED', processedAt: 'Today' } : r))
    );
    addAuditLog('REFUND_APPROVED', `Refund ${refundId}`, 'Approved refund payment');
  };

  const rejectRefund = (refundId: string, reason: string) => {
    setRefundRequests((prev) =>
      prev.map((r) => (r.id === refundId ? { ...r, status: 'REJECTED', processedAt: 'Today' } : r))
    );
    addAuditLog('REFUND_REJECTED', `Refund ${refundId}`, `Reason: ${reason}`);
  };

  const addMembershipPlan = (plan: Omit<MembershipPlanAdmin, 'id'>) => {
    const newPlan: MembershipPlanAdmin = {
      ...plan,
      id: `plan-${Date.now()}`,
    };
    setMembershipPlans((prev) => [...prev, newPlan]);
    addAuditLog('PLAN_CREATED', newPlan.name, `Created plan with price ৳${newPlan.price}`);
  };

  const updateMembershipPlanPrice = (planId: string, newPrice: number) => {
    setMembershipPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, price: newPrice } : p))
    );
    addAuditLog('PRICING_CHANGED', `Plan ${planId}`, `Updated price to ৳${newPrice} BDT`);
  };

  const togglePlanStatus = (planId: string) => {
    setMembershipPlans((prev) =>
      prev.map((p) =>
        p.id === planId ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : p
      )
    );
  };

  const deleteMembershipPlan = (planId: string) => {
    setMembershipPlans((prev) => prev.filter((p) => p.id !== planId));
    addAuditLog('PLAN_DELETED', `Plan ${planId}`, 'Deleted membership plan');
  };

  const addAdminNotification = (notif: Omit<AdminNotification, 'id' | 'createdAt'>) => {
    const newNotif: AdminNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(),
    };
    setAdminNotifications((prev) => [newNotif, ...prev]);
    addAuditLog('NOTIFICATION_BROADCAST', `Audience ${notif.audience}`, notif.title);
  };

  const saveCmsPage = (page: CmsPage) => {
    setCmsPages((prev) => {
      const idx = prev.findIndex((p) => p.id === page.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = page;
        return copy;
      }
      return [page, ...prev];
    });
    addAuditLog('CMS_PAGE_UPDATED', `Page ${page.slug}`, `Status: ${page.status}`);
  };

  const deleteCmsPage = (id: string) => {
    setCmsPages((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('CMS_PAGE_DELETED', `Page ${id}`, 'Deleted static CMS page');
  };

  const saveCmsFaq = (faq: CmsFaq) => {
    setCmsFaqs((prev) => {
      const idx = prev.findIndex((f) => f.id === faq.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = faq;
        return copy;
      }
      return [faq, ...prev];
    });
    addAuditLog('CMS_FAQ_SAVED', `FAQ ${faq.question}`, 'Saved FAQ record');
  };

  const deleteCmsFaq = (id: string) => {
    setCmsFaqs((prev) => prev.filter((f) => f.id !== id));
    addAuditLog('CMS_FAQ_DELETED', `FAQ ${id}`, 'Deleted FAQ record');
  };

  const saveCmsArticle = (article: CmsArticle) => {
    setCmsArticles((prev) => {
      const idx = prev.findIndex((a) => a.id === article.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = article;
        return copy;
      }
      return [article, ...prev];
    });
    try {
      fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      }).catch(() => {});
    } catch (e) {}
    addAuditLog('CMS_ARTICLE_SAVED', `Article ${article.title}`, 'Saved blog article');
  };

  const deleteCmsArticle = (id: string) => {
    setCmsArticles((prev) => prev.filter((a) => a.id !== id));
    try { fetch(`/api/articles?id=${id}`, { method: 'DELETE' }).catch(() => {}); } catch (e) {}
    addAuditLog('CMS_ARTICLE_DELETED', `Article ${id}`, 'Deleted blog article');
  };

  const saveCmsBanner = (banner: CmsBanner) => {
    setCmsBanners((prev) => {
      const idx = prev.findIndex((b) => b.id === banner.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = banner;
        return copy;
      }
      return [banner, ...prev];
    });
    try {
      fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      }).catch(() => {});
    } catch (e) {}
    addAuditLog('CMS_BANNER_SAVED', `Banner ${banner.title}`, 'Saved banner');
  };

  const deleteCmsBanner = (id: string) => {
    setCmsBanners((prev) => prev.filter((b) => b.id !== id));
    try { fetch(`/api/banners?id=${id}`, { method: 'DELETE' }).catch(() => {}); } catch (e) {}
    addAuditLog('CMS_BANNER_DELETED', `Banner ${id}`, 'Deleted banner');
  };

  const toggleHomepageSection = (id: string) => {
    setHomepageSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const addAdminUser = (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: AdminUser = {
      ...user,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };
    setAdminUsers((prev) => [...prev, newUser]);
    addAuditLog('ADMIN_USER_CREATED', `Admin ${newUser.email}`, `Role: ${newUser.role}`);
  };

  const updateAdminUser = (id: string, data: Partial<AdminUser>) => {
    setAdminUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    addAuditLog('ADMIN_USER_UPDATED', `Admin ${id}`, 'Updated admin details');
  };

  const toggleAdminUserStatus = (id: string) => {
    setAdminUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u
      )
    );
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog('ADMIN_USER_DELETED', `Admin ${id}`, 'Deleted admin user account');
  };

  const updateSettings = (category: string, values: Record<string, any>) => {
    const savedAt = Date.now();
    setSettings((prev) => {
      const updated = {
        ...prev,
        [category]: { ...(prev[category] || {}), ...values },
        [SETTINGS_META_KEY]: savedAt,
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('2ndchance_admin_settings', JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not persist admin settings to localStorage due to browser quota limits:', e);
        }
      }
      return updated;
    });

    // Save directly to MySQL Database (2ndchance_db) via Next.js API Route
    try {
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, values }),
      }).catch((err) => console.warn('DB settings save background error:', err));
    } catch (e) {}

    addAuditLog('SETTINGS_UPDATED', `Settings Category ${category}`, 'Updated platform configuration');
  };

  const batchUpdateSettings = (allUpdates: Record<string, any>) => {
    const savedAt = Date.now();
    setSettings((prev) => {
      const updated = { ...prev };
      for (const [key, val] of Object.entries(allUpdates)) {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          updated[key] = { ...(prev[key] || {}), ...val };
        } else {
          updated[key] = val;
        }
      }
      updated[SETTINGS_META_KEY] = savedAt;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('2ndchance_admin_settings', JSON.stringify(updated));
        } catch (e) {
          console.warn('Could not persist admin settings to localStorage:', e);
        }
      }
      return updated;
    });

    try {
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: allUpdates }),
      }).catch((err) => console.warn('DB batch settings save background error:', err));
    } catch (e) {}

    addAuditLog('SETTINGS_BATCH_UPDATED', 'Platform Settings', 'Updated platform configuration in batch');
  };

  return (
    <AdminContext.Provider
      value={{
        members,
        adminUsers,
        verificationQueue,
        moderationReports,
        refundRequests,
        membershipPlans,
        cmsPages,
        cmsFaqs,
        cmsArticles,
        cmsBanners,
        cmsMedia,
        homepageSections,
        adminNotifications,
        auditLogs,
        isLoaded,
        settings,
        addMember,
        updateMember,
        deleteMember,
        purgeDummyProfiles,
        approveVerification,
        rejectVerification,
        requestVerificationChanges,
        deleteVerification,
        addModerationReport,
        resolveReport,
        dismissReport,
        deleteReport,
        approveRefund,
        rejectRefund,
        addMembershipPlan,
        updateMembershipPlanPrice,
        togglePlanStatus,
        deleteMembershipPlan,
        addAdminNotification,
        saveCmsPage,
        deleteCmsPage,
        saveCmsFaq,
        deleteCmsFaq,
        saveCmsArticle,
        deleteCmsArticle,
        saveCmsBanner,
        deleteCmsBanner,
        toggleHomepageSection,
        addAdminUser,
        updateAdminUser,
        toggleAdminUserStatus,
        deleteAdminUser,
        updateSettings,
        batchUpdateSettings,
        addAuditLog,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
