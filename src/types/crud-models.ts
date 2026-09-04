/**
 * 2nd Chance Matrimonial Platform — Complete Production CRUD Models
 * Used for Frontend State Management & Laravel 11 REST API / MySQL Schemas
 */

// 1. User & Auth Model
export interface UserModel {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'GUEST' | 'FREE' | 'PREMIUM' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  emailVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 2. Profile & NID Verification Models
export interface ProfileModel {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: 'Male' | 'Female';
  maritalStatus: 'Divorced' | 'Widowed' | 'Single Parent' | 'Never Married';
  hasChildren: boolean;
  childrenCount?: number;
  height: string;
  religion: string;
  education: string;
  profession: string;
  income?: string;
  city: string;
  country: string;
  location: string;
  photoUrl: string;
  photoPrivacy: 'PUBLIC' | 'PRIVATE' | 'MATCH_ONLY';
  isVerified: boolean;
  trustScore: number;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileVerificationModel {
  id: string;
  profileId: string;
  nidNumber: string;
  nidDocUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CHANGES_REQUESTED';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// 3. Connection & Match Models
export interface InterestModel {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'DRAFT' | 'PAYMENT_PENDING' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchModel {
  id: string;
  userOneId: string;
  userTwoId: string;
  compatibilityScore: number;
  status: 'ACTIVE' | 'BLOCKED' | 'ENDED';
  matchedAt: string;
}

// 4. Communication & Messaging Models
export interface ConversationModel {
  id: string;
  matchId: string;
  userOneId: string;
  userTwoId: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCountUserOne: number;
  unreadCountUserTwo: number;
  status: 'ACTIVE' | 'BLOCKED' | 'ENDED';
}

export interface MessageModel {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'CONTACT' | 'SYSTEM';
  mediaUrl?: string;
  contactDetails?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
}

// 5. Payment & Membership Models
export interface MembershipPlanModel {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface SubscriptionModel {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
  startedAt: string;
  expiresAt: string;
  transactionId: string;
  paymentMethod: string;
}

export interface PaymentTransactionModel {
  id: string;
  transactionId: string;
  userId: string;
  recipientId?: string;
  purpose: 'subscription' | 'interest';
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  gateway: 'MOCK' | 'SSLCOMMERZ';
  paidAt: string;
  createdAt: string;
}

export interface RefundRequestModel {
  id: string;
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  processedAt?: string;
  createdAt: string;
}

// 6. Moderation & Report Models
export interface ModerationReportModel {
  id: string;
  reporterId: string;
  targetType: 'PROFILE' | 'MESSAGE' | 'PHOTO';
  targetId: string;
  reason: 'FAKE_PROFILE' | 'SCAM' | 'HARASSMENT' | 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'ABUSE' | 'SUSPICIOUS_ACTIVITY' | 'OTHER';
  status: 'NEW' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED' | 'ESCALATED';
  details: string;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  createdAt: string;
}

// 7. CMS Suite Models
export interface CmsPageModel {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';
  publishedAt: string;
  updatedAt: string;
}

export interface CmsFaqModel {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  status: 'PUBLISHED' | 'DRAFT';
}

export interface CmsArticleModel {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featuredImage: string;
  isFeatured: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string;
}

export interface CmsBannerModel {
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

// 8. Admin & Audit Models
export interface AdminUserModel {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'SUPPORT' | 'FINANCE' | 'CONTENT_MANAGER';
  permissions: string[];
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  createdAt: string;
}

export interface AuditLogModel {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  action: string;
  target: string;
  description: string;
  ipAddress?: string;
  createdAt: string;
}
