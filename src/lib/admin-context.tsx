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
  addMember: (member: Omit<Profile, 'id' | 'createdAt'>) => void;
  updateMember: (id: string, member: Partial<Profile>) => void;
  deleteMember: (id: string) => void;
  
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
    general: { siteName: '2nd Nikha Matrimonial', supportEmail: 'support@2ndnikha.com' },
    payment: { activeGateway: 'MOCK', currency: 'BDT', sslCommerzMode: 'SANDBOX' },
    branding: {
      logoUrl: OFFICIAL_2ND_CHANCE_LOGO,
      faviconUrl: '/favicon.ico',
      heroTitle: 'Every heart deserves a second Nikha',
      heroSubtitle: 'A trusted matrimonial sanctuary designed for divorced, widowed, single parents, and mature singles seeking a genuine, lifelong companion.',
      heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    },
  },
  addMember: () => {},
  updateMember: () => {},
  deleteMember: () => {},
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
  general: { siteName: '2nd Nikha Matrimonial', supportEmail: 'support@2ndnikha.com' },
  payment: { activeGateway: 'MOCK', currency: 'BDT', sslCommerzMode: 'SANDBOX' },
  branding: {
    logoUrl: OFFICIAL_2ND_CHANCE_LOGO,
    faviconUrl: '/favicon.ico',
    heroTitle: 'Every heart deserves a second Nikha',
    heroSubtitle: 'Designed specifically for divorced, widowed, single parents, and mature singles in Bangladesh & global NRB expats.',
    heroImageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
  },
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
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

  // Initialize settings with DEFAULT_SETTINGS to ensure server and initial client render match perfectly (prevents hydration mismatch)
  const [settings, setSettings] = useState<Record<string, any>>(DEFAULT_SETTINGS);

  // Dynamic Browser Favicon Updater
  useEffect(() => {
    if (typeof window !== 'undefined' && settings?.branding?.faviconUrl) {
      try {
        const faviconUrl = settings.branding.faviconUrl;
        const iconLinks = document.querySelectorAll("link[rel*='icon']");
        iconLinks.forEach((l) => l.parentNode?.removeChild(l));

        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        if (faviconUrl.startsWith('data:image/png')) newLink.type = 'image/png';
        else if (faviconUrl.startsWith('data:image/svg')) newLink.type = 'image/svg+xml';
        else if (faviconUrl.startsWith('data:image/x-icon') || faviconUrl.endsWith('.ico')) newLink.type = 'image/x-icon';
        newLink.href = faviconUrl;
        document.getElementsByTagName('head')[0].appendChild(newLink);
      } catch (e) {}
    }
  }, [settings?.branding?.faviconUrl]);

  // Hydrate settings, members, articles, banners safely on client after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('2ndchance_admin_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.branding && (!parsed.branding.logoUrl || parsed.branding.logoUrl === '/images/logo.png' || parsed.branding.logoUrl.startsWith('data:image/svg+xml;utf8'))) {
            parsed.branding.logoUrl = OFFICIAL_2ND_CHANCE_LOGO;
          }
          setSettings(parsed);
        }
        const savedMembers = localStorage.getItem('2ndchance_admin_members');
        if (savedMembers) {
          setMembers(JSON.parse(savedMembers));
        }
        const savedArticles = localStorage.getItem('2ndchance_admin_articles');
        if (savedArticles) setCmsArticles(JSON.parse(savedArticles));
        const savedBanners = localStorage.getItem('2ndchance_admin_banners');
        if (savedBanners) setCmsBanners(JSON.parse(savedBanners));
      } catch (e) {
        localStorage.removeItem('2ndchance_admin_settings');
        localStorage.removeItem('2ndchance_admin_members');
      }
    }

    // 2. Fetch fresh data from MySQL Database APIs with timeout to prevent page hanging
    async function fetchWithTimeout(url: string, timeoutMs: number = 800) {
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
        const [settingsRes, membersRes, articlesRes, bannersRes] = await Promise.all([
          fetchWithTimeout('/api/settings'),
          fetchWithTimeout('/api/members'),
          fetchWithTimeout('/api/articles'),
          fetchWithTimeout('/api/banners'),
        ]);

        if (settingsRes?.success && settingsRes?.settings && Object.keys(settingsRes.settings).length > 0) {
          setSettings((prev) => {
            const merged = { ...prev };
            for (const [k, v] of Object.entries(settingsRes.settings)) {
              if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
                merged[k] = { ...(prev[k] || {}), ...v };
              } else {
                merged[k] = v;
              }
            }
            if (typeof window !== 'undefined') {
              try { localStorage.setItem('2ndchance_admin_settings', JSON.stringify(merged)); } catch (e) {}
            }
            return merged;
          });
        }

        if (membersRes?.success && membersRes?.members && membersRes.members.length > 0) {
          setMembers(membersRes.members);
          if (typeof window !== 'undefined') {
            try { localStorage.setItem('2ndchance_admin_members', JSON.stringify(membersRes.members)); } catch (e) {}
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

  const addMember = (m: Omit<Profile, 'id' | 'createdAt'>) => {
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
    setSettings((prev) => {
      const updated = {
        ...prev,
        [category]: { ...(prev[category] || {}), ...values },
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
    setSettings((prev) => {
      const updated = { ...prev };
      for (const [key, val] of Object.entries(allUpdates)) {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          updated[key] = { ...(prev[key] || {}), ...val };
        } else {
          updated[key] = val;
        }
      }
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
