import { Profile, VerificationStatus, MembershipTier, PaymentStatus, PaymentPurpose, InterestStatus, MatchStatus } from './index';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'FINANCE' | 'CONTENT_MANAGER';

export type AdminPermission =
  | 'members.view'
  | 'members.edit'
  | 'members.verify'
  | 'members.suspend'
  | 'connections.view'
  | 'connections.manage'
  | 'communication.view'
  | 'communication.moderate'
  | 'moderation.view'
  | 'moderation.resolve'
  | 'payments.view'
  | 'payments.manage'
  | 'refunds.manage'
  | 'membership.view'
  | 'membership.manage'
  | 'cms.view'
  | 'cms.create'
  | 'cms.edit'
  | 'cms.publish'
  | 'cms.delete'
  | 'notifications.view'
  | 'notifications.send'
  | 'admins.view'
  | 'admins.manage'
  | 'settings.manage'
  | 'audit_logs.view';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  createdAt: string;
}

export type ReportReason =
  | 'FAKE_PROFILE'
  | 'SCAM'
  | 'HARASSMENT'
  | 'INAPPROPRIATE_CONTENT'
  | 'SPAM'
  | 'ABUSE'
  | 'SUSPICIOUS_ACTIVITY'
  | 'OTHER';

export type ReportStatus = 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' | 'ESCALATED';

export interface ModerationReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'PROFILE' | 'MESSAGE' | 'PHOTO';
  targetId: string;
  targetName: string;
  reason: ReportReason;
  status: ReportStatus;
  details: string;
  createdAt: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface VerificationQueueItem {
  id: string;
  profileId: string;
  profile: Profile;
  nidNumber: string;
  nidDocUrl?: string;
  submittedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CHANGES_REQUESTED';
  reviewNotes?: string;
}

export interface RefundRequest {
  id: string;
  transactionId: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  processedAt?: string;
}

export interface MembershipPlanAdmin {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  subscriberCount: number;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'ANNOUNCEMENT' | 'SAFETY' | 'PROMOTION' | 'SYSTEM';
  audience: 'ALL' | 'PREMIUM' | 'VERIFIED';
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
  createdAt: string;
  scheduledAt?: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  publishedAt: string;
  updatedAt: string;
}

export interface CmsFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: 'PUBLISHED' | 'DRAFT';
}

export interface CmsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsBanner {
  id: string;
  title: string;
  description: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  targetAudience: 'ALL' | 'FREE' | 'PREMIUM';
  sortOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CmsMediaItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  usageCount: number;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  target: string;
  description: string;
  ipAddress?: string;
  timestamp: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}
