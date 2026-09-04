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
import { MOCK_PROFILES } from './mock-data';

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Super Admin',
    email: 'admin@2ndchance.com',
    role: 'SUPER_ADMIN',
    permissions: [
      'members.view',
      'members.edit',
      'members.verify',
      'members.suspend',
      'connections.view',
      'connections.manage',
      'communication.view',
      'communication.moderate',
      'moderation.view',
      'moderation.resolve',
      'payments.view',
      'payments.manage',
      'refunds.manage',
      'membership.view',
      'membership.manage',
      'cms.view',
      'cms.create',
      'cms.edit',
      'cms.publish',
      'cms.delete',
      'notifications.view',
      'notifications.send',
      'admins.view',
      'admins.manage',
      'settings.manage',
      'audit_logs.view',
    ],
    status: 'ACTIVE',
    lastLogin: 'Today, 10:45 AM',
    createdAt: '2026-01-01',
  },
  {
    id: 'admin-2',
    name: 'Tariq Hassan',
    email: 'tariq.moderation@2ndchance.com',
    role: 'MODERATOR',
    permissions: [
      'members.view',
      'members.verify',
      'communication.view',
      'communication.moderate',
      'moderation.view',
      'moderation.resolve',
      'audit_logs.view',
    ],
    status: 'ACTIVE',
    lastLogin: 'Yesterday, 04:20 PM',
    createdAt: '2026-02-15',
  },
  {
    id: 'admin-3',
    name: 'Sabrina Ahmed',
    email: 'sabrina.finance@2ndchance.com',
    role: 'FINANCE',
    permissions: ['payments.view', 'payments.manage', 'refunds.manage', 'membership.view', 'audit_logs.view'],
    status: 'ACTIVE',
    lastLogin: 'Today, 09:12 AM',
    createdAt: '2026-03-01',
  },
];

export const MOCK_VERIFICATION_QUEUE: VerificationQueueItem[] = [
  {
    id: 'v-101',
    profileId: MOCK_PROFILES[0].id,
    profile: MOCK_PROFILES[0],
    nidNumber: '19942691234509',
    nidDocUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    submittedAt: 'Today, 11:20 AM',
    status: 'PENDING',
  },
  {
    id: 'v-102',
    profileId: MOCK_PROFILES[1].id,
    profile: MOCK_PROFILES[1],
    nidNumber: '19882699876512',
    nidDocUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    submittedAt: 'Today, 09:15 AM',
    status: 'PENDING',
  },
  {
    id: 'v-103',
    profileId: MOCK_PROFILES[2].id,
    profile: MOCK_PROFILES[2],
    nidNumber: '19912693456789',
    nidDocUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    submittedAt: 'Yesterday',
    status: 'PENDING',
  },
];

export const MOCK_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep-301',
    reporterId: 'p-102',
    reporterName: 'Tanvir Hossain',
    targetType: 'PROFILE',
    targetId: 'p-107',
    targetName: 'Fake Profile User',
    reason: 'FAKE_PROFILE',
    status: 'NEW',
    details: 'Photos seem taken from Instagram without authorization.',
    createdAt: 'Today, 08:30 AM',
  },
  {
    id: 'rep-302',
    reporterId: 'p-103',
    reporterName: 'Nusrat Jahan',
    targetType: 'MESSAGE',
    targetId: 'msg-99',
    targetName: 'Suspicious User',
    reason: 'HARASSMENT',
    status: 'UNDER_REVIEW',
    details: 'Insistence on sharing bank details inappropriately.',
    createdAt: 'Yesterday, 11:14 PM',
  },
];

export const MOCK_REFUND_REQUESTS: RefundRequest[] = [
  {
    id: 'ref-501',
    transactionId: 'TXN-984210',
    userId: 'p-104',
    userName: 'Kazi Sharmin',
    amount: 1499,
    currency: 'BDT',
    reason: 'Accidental duplicate checkout payment',
    status: 'PENDING',
    createdAt: 'Today, 07:10 AM',
  },
];

export const MOCK_MEMBERSHIP_PLANS_ADMIN: MembershipPlanAdmin[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    price: 99,
    currency: 'BDT',
    billingPeriod: '1 Week',
    features: [
      'Send Unlimited Express Interests',
      'Unlock Direct Contact & WhatsApp Info',
      'Private Photo Access Requests',
      'Verified Badge Priority Search',
    ],
    status: 'ACTIVE',
    subscriberCount: 840,
  },
  {
    id: 'monthly',
    name: 'Monthly Pass',
    price: 299,
    currency: 'BDT',
    billingPeriod: '1 Month',
    features: [
      'Send Unlimited Express Interests',
      'Unlock Direct Contact & WhatsApp Info',
      'Private Photo Access Requests',
      'Verified Badge Priority Search',
      '24/7 VIP Matrimonial Support',
    ],
    status: 'ACTIVE',
    subscriberCount: 1420,
  },
];

export const MOCK_CMS_PAGES: CmsPage[] = [
  {
    id: 'page-about',
    title: 'About 2nd Chance Matrimonial',
    slug: 'about-us',
    content: '2nd Chance is Bangladesh’s premier dignified remarriage matrimonial platform for divorced, widowed, and single parent individuals.',
    seoTitle: 'About Us — 2nd Chance Dignified Matrimonial',
    seoDescription: 'Learn about our mission to help Bangladeshi individuals find meaningful second chances in marriage.',
    seoKeywords: '2nd chance matrimonial, remarriage bangladesh, divorced matrimony',
    status: 'PUBLISHED',
    publishedAt: '2026-01-10',
    updatedAt: '2026-08-20',
  },
  {
    id: 'page-safety',
    title: 'Matrimonial Safety & Trust Center',
    slug: 'safety-center',
    content: 'Comprehensive guidelines on online matchmaking safety, NID identity verification, and fraud prevention.',
    seoTitle: 'Safety Center & Fraud Prevention — 2nd Chance',
    seoDescription: 'Stay safe while searching for your life partner.',
    seoKeywords: 'matrimonial safety, verified profiles bangladesh, NID verification',
    status: 'PUBLISHED',
    publishedAt: '2026-01-15',
    updatedAt: '2026-08-28',
  },
];

export const MOCK_CMS_FAQS: CmsFaq[] = [
  {
    id: 'faq-1',
    question: 'How does NID Profile Verification work?',
    answer: 'Our admin team manually cross-verifies national ID documents and photo matches before granting the Verified Badge.',
    category: 'Verification',
    sortOrder: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'faq-2',
    question: 'What is included in the ৳1,499 Premium Plan?',
    answer: 'Unlimited Express Interests, Direct WhatsApp/Contact sharing, Private Photo Access, and Priority Match Search.',
    category: 'Membership',
    sortOrder: 2,
    status: 'PUBLISHED',
  },
];

export const MOCK_CMS_ARTICLES: CmsArticle[] = [
  {
    id: 'art-1',
    title: 'Navigating Marriage with Children: A Compassionate Guide for Single Parents',
    slug: 'navigating-marriage-with-children',
    content: 'Blending families requires patience, open communication, and mutual respect between both partners and children.',
    excerpt: 'Practical advice for single parents looking for a second chance in marriage in Bangladesh.',
    category: 'Relationship Advice',
    tags: ['Single Parents', 'Family', 'Remarriage'],
    featuredImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
    seoTitle: 'Single Parent Marriage Guide — 2nd Chance',
    seoDescription: 'Tips for single parents seeking a dignified second marriage in Bangladesh.',
    isFeatured: true,
    status: 'PUBLISHED',
    publishedAt: '2026-08-10',
  },
];

export const MOCK_CMS_BANNERS: CmsBanner[] = [
  {
    id: 'ban-1',
    title: 'Verified Profiles Special Offer',
    description: 'Get verified today with NID to boost your profile responses by 3x.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    ctaText: 'Verify Profile Now',
    ctaUrl: '/member/profile',
    targetAudience: 'ALL',
    sortOrder: 1,
    status: 'ACTIVE',
  },
];

export const MOCK_CMS_MEDIA: CmsMediaItem[] = [
  {
    id: 'med-1',
    fileName: 'hero-banner-couple.jpg',
    fileUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    fileSize: '1.2 MB',
    fileType: 'image/jpeg',
    uploadedAt: '2026-08-01',
    usageCount: 3,
  },
];

export const MOCK_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  { id: 'hero', name: 'Hero Banner Section', enabled: true, order: 1, title: 'Find Dignified Second Chances in Marriage' },
  { id: 'how-it-works', name: 'How It Works', enabled: true, order: 2, title: 'Three Simple Steps to Matrimonial Success' },
  { id: 'features', name: 'Key Features & Safety', enabled: true, order: 3, title: 'Built with Trust, NID Verification & Privacy' },
  { id: 'success-stories', name: 'Success Stories', enabled: true, order: 4, title: 'Real Couples Who Found Love Again' },
  { id: 'cta', name: 'Bottom Registration CTA', enabled: true, order: 5, title: 'Ready to Begin Your Matrimonial Journey?' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-901',
    adminId: 'admin-1',
    adminName: 'Super Admin',
    adminRole: 'SUPER_ADMIN',
    action: 'MEMBER_VERIFIED',
    target: 'Profile p-101 (Anika Rahman)',
    description: 'Approved NID Verification request #v-101.',
    ipAddress: '103.114.12.89',
    timestamp: 'Today, 10:15 AM',
  },
  {
    id: 'log-902',
    adminId: 'admin-3',
    adminName: 'Sabrina Ahmed',
    adminRole: 'FINANCE',
    action: 'SUBSCRIPTION_VERIFIED',
    target: 'Transaction TXN-894210',
    description: 'Verified Mock Payment gateway receipt for ৳1,499 BDT.',
    ipAddress: '103.114.12.92',
    timestamp: 'Yesterday, 04:30 PM',
  },
];

export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'Platform Maintenance Notice',
    message: 'Scheduled database optimization will occur tonight at 02:00 AM.',
    type: 'SYSTEM',
    audience: 'ALL',
    status: 'SENT',
    createdAt: 'Today, 09:00 AM',
  },
];
