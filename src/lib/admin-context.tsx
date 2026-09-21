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
  addMember: (member: any) => Promise<{ success: boolean; error?: string }>;
  updateMember: (id: string, member: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  deleteMember: (id: string) => Promise<{ success: boolean; error?: string }>;
  purgeDummyProfiles: () => Promise<{ success: boolean; error?: string }>;
  
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
  saveCmsArticle: (article: CmsArticle) => Promise<{ success: boolean; error?: string }>;
  deleteCmsArticle: (id: string) => Promise<{ success: boolean; error?: string }>;
  saveCmsBanner: (banner: CmsBanner) => Promise<{ success: boolean; error?: string }>;
  deleteCmsBanner: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleHomepageSection: (id: string) => void;
  
  addAdminUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateAdminUser: (id: string, user: Partial<AdminUser>) => void;
  toggleAdminUserStatus: (id: string) => void;
  deleteAdminUser: (id: string) => void;
  
  isLoaded: boolean;
  updateSettings: (category: string, values: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  batchUpdateSettings: (allUpdates: Record<string, any>) => Promise<{ success: boolean; error?: string }>;
  addAuditLog: (action: string, target: string, description: string) => void;
}

const AdminContext = createContext<AdminContextType>({
  members: [],
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
  addMember: async () => ({ success: false }),
  updateMember: async () => ({ success: false }),
  deleteMember: async () => ({ success: false }),
  purgeDummyProfiles: async () => ({ success: false }),
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
  saveCmsArticle: async () => ({ success: false }),
  deleteCmsArticle: async () => ({ success: false }),
  saveCmsBanner: async () => ({ success: false }),
  deleteCmsBanner: async () => ({ success: false }),
  toggleHomepageSection: () => {},
  addAdminUser: () => {},
  updateAdminUser: () => {},
  toggleAdminUserStatus: () => {},
  deleteAdminUser: () => {},
  updateSettings: async () => ({ success: false }),
  batchUpdateSettings: async () => ({ success: false }),
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
  return copy;
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

function mergeWithMockProfiles(list: Profile[], _settings?: Record<string, any>): Profile[] {
  // Production member listing is database-only. Mock/demo profiles must never
  // be mixed into the real member directory — they are only used by clearly
  // labelled marketing/demo surfaces, never here.
  return Array.isArray(list) ? list.filter((item) => item && item.fullName) : [];
}

function mapArticleFromDb(a: any): CmsArticle {
  const publishedAt = a?.publishedAt ? new Date(a.publishedAt).toISOString().split('T')[0] : '';
  return {
    id: a?.id,
    title: a?.title || '',
    slug: a?.slug || '',
    content: a?.content || '',
    excerpt: a?.excerpt || '',
    category: a?.category || 'Marriage Advice',
    featuredImage: a?.coverImage || '',
    author: a?.author || 'Editorial Team',
    status: a?.isPublished === false ? 'DRAFT' : 'PUBLISHED',
    publishedAt,
    createdAt: publishedAt,
    updatedAt: publishedAt,
  };
}

function mapArticleToApi(a: CmsArticle) {
  return {
    id: a?.id && !a.id.startsWith('art-temp-') ? a.id : undefined,
    title: a?.title || '',
    slug: a?.slug || '',
    content: a?.content || '',
    excerpt: a?.excerpt || '',
    coverImage: a?.featuredImage || '',
    category: a?.category || 'Marriage Advice',
    author: a?.author || 'Editorial Team',
    isPublished: a?.status !== 'DRAFT',
  };
}

function mapBannerFromDb(b: any): CmsBanner {
  return {
    id: b?.id,
    title: b?.title || '',
    description: b?.subtitle || '',
    image: b?.imageUrl || '',
    ctaText: '',
    ctaUrl: b?.targetUrl || '',
    targetAudience: 'ALL',
    sortOrder: 0,
    status: b?.isActive === false ? 'INACTIVE' : 'ACTIVE',
  };
}

function mapBannerToApi(b: CmsBanner) {
  return {
    id: b?.id && !b.id.startsWith('banner-temp-') ? b.id : undefined,
    title: b?.title || '',
    subtitle: b?.description || '',
    imageUrl: b?.image || '',
    targetUrl: b?.ctaUrl || '',
    isActive: b?.status !== 'INACTIVE',
  };
}

export function AdminProvider({ children, initialSettings = {} }: { children: React.ReactNode; initialSettings?: Record<string, any> }) {
  const [members, setMembers] = useState<Profile[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [verificationQueue, setVerificationQueue] = useState<VerificationQueueItem[]>(MOCK_VERIFICATION_QUEUE);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>(MOCK_MODERATION_REPORTS);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(MOCK_REFUND_REQUESTS);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlanAdmin[]>(MOCK_MEMBERSHIP_PLANS_ADMIN);
  const [cmsPages, setCmsPages] = useState<CmsPage[]>(MOCK_CMS_PAGES);
  const [cmsFaqs, setCmsFaqs] = useState<CmsFaq[]>(MOCK_CMS_FAQS);
  const [cmsArticles, setCmsArticles] = useState<CmsArticle[]>([]);
  const [cmsBanners, setCmsBanners] = useState<CmsBanner[]>([]);
  const [cmsMedia, setCmsMedia] = useState<CmsMediaItem[]>(MOCK_CMS_MEDIA);
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(MOCK_HOMEPAGE_SECTIONS);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(MOCK_ADMIN_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize settings from the SSR-provided database settings. No browser
  // storage is consulted — the database is the single source of truth.
  const [settings, setSettings] = useState<Record<string, any>>(() =>
    ({ ...DEFAULT_SETTINGS, ...sanitizeSettings(initialSettings || {}) })
  );

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

  // Hydrate settings, members, articles and banners from MySQL. The database is
  // the single source of truth; localStorage is never consulted for these.
  useEffect(() => {
    async function fetchJson(url: string, timeoutMs = 8000) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const cacheBustedUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;
        const res = await fetch(cacheBustedUrl, {
          signal: controller.signal,
          cache: 'no-store',
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache' },
        });
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    async function loadAllDbData() {
      try {
        const [settingsRes, membersRes, articlesRes, bannersRes] = await Promise.all([
          fetchJson('/api/settings'),
          fetchJson('/api/members'),
          fetchJson('/api/articles'),
          fetchJson('/api/banners'),
        ]);

        if (settingsRes?.success && settingsRes?.settings) {
          setSettings((prev) => ({ ...prev, ...sanitizeSettings(settingsRes.settings) }));
        }
        if (membersRes?.success && Array.isArray(membersRes.members)) {
          setMembers(membersRes.members);
        }
        if (articlesRes?.success && Array.isArray(articlesRes.articles)) {
          setCmsArticles(articlesRes.articles.map(mapArticleFromDb));
        }
        if (bannersRes?.success && Array.isArray(bannersRes.banners)) {
          setCmsBanners(bannersRes.banners.map(mapBannerFromDb));
        }
      } catch (e) {
        console.warn('Could not load initial data from DB APIs:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadAllDbData();
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

  const refreshMembers = async () => {
    try {
      const res = await fetch('/api/members', { cache: 'no-store', credentials: 'include' });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success && Array.isArray(data.members)) {
        setMembers(data.members);
      }
    } catch {
      /* ignore refresh errors — the caller already reports save failures */
    }
  };

  const addMember = async (m: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(m),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      if (data.member) {
        setMembers((prev) => [data.member, ...prev.filter((x) => x.id !== data.member.id)]);
      } else {
        await refreshMembers();
      }
      addAuditLog('MEMBER_CREATED', m?.fullName || 'Member', 'Created new member profile');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const updateMember = async (id: string, data: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...data, id }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result?.success) {
        return { success: false, error: result?.error || `Server responded ${res.status}` };
      }
      if (result.member) {
        setMembers((prev) => prev.map((m) => (m.id === result.member.id ? { ...m, ...result.member } : m)));
      } else {
        await refreshMembers();
      }
      addAuditLog('MEMBER_UPDATED', `Profile ${id}`, 'Updated profile details');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const deleteMember = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      setMembers((prev) => prev.filter((m) => m.id !== id));
      addAuditLog('MEMBER_DELETED', `Profile ${id}`, 'Deleted member profile');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const purgeDummyProfiles = async (): Promise<{ success: boolean; error?: string }> => {
    // Demo/mock profiles are no longer stored in the member directory at all, so
    // this now simply records the admin preference and reloads the real data.
    const settingsResult = await updateSettings('general', { purgeDummy: true });
    await refreshMembers();
    addAuditLog('DUMMY_PROFILES_PURGED', 'Candidate Database', 'Confirmed member directory contains real database records only.');
    return settingsResult;
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

  const saveCmsArticle = async (article: CmsArticle): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mapArticleToApi(article)),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      const saved = data.article ? mapArticleFromDb(data.article) : article;
      setCmsArticles((prev) => {
        const idx = prev.findIndex((a) => a.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      addAuditLog('CMS_ARTICLE_SAVED', `Article ${article.title}`, 'Saved blog article');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const deleteCmsArticle = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      setCmsArticles((prev) => prev.filter((a) => a.id !== id));
      addAuditLog('CMS_ARTICLE_DELETED', `Article ${id}`, 'Deleted blog article');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const saveCmsBanner = async (banner: CmsBanner): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(mapBannerToApi(banner)),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      const saved = data.banner ? mapBannerFromDb(data.banner) : banner;
      setCmsBanners((prev) => {
        const idx = prev.findIndex((b) => b.id === saved.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = saved;
          return copy;
        }
        return [saved, ...prev];
      });
      addAuditLog('CMS_BANNER_SAVED', `Banner ${banner.title}`, 'Saved banner');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const deleteCmsBanner = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/banners?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      setCmsBanners((prev) => prev.filter((b) => b.id !== id));
      addAuditLog('CMS_BANNER_DELETED', `Banner ${id}`, 'Deleted banner');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
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

  const updateSettings = async (category: string, values: Record<string, any>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ category, values }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      setSettings((prev) => ({
        ...prev,
        [category]: { ...(prev[category] || {}), ...values },
        ...(data.settings || {}),
      }));
      addAuditLog('SETTINGS_UPDATED', `Settings Category ${category}`, 'Updated platform configuration');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
  };

  const batchUpdateSettings = async (allUpdates: Record<string, any>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ settings: allUpdates }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || `Server responded ${res.status}` };
      }
      setSettings((prev) => {
        const updated = { ...prev };
        for (const [key, val] of Object.entries(allUpdates)) {
          if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            updated[key] = { ...(prev[key] || {}), ...val };
          } else {
            updated[key] = val;
          }
        }
        return { ...updated, ...(data.settings || {}) };
      });
      addAuditLog('SETTINGS_BATCH_UPDATED', 'Platform Settings', 'Updated platform configuration in batch');
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Network error' };
    }
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
