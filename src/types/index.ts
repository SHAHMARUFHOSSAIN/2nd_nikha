export type MaritalStatus = 'Divorced' | 'Widowed' | 'Single Parent' | 'Never Married';

export type Gender = 'Male' | 'Female';

export type Religion = 'Islam' | 'Hinduism' | 'Christianity' | 'Buddhism' | 'Other';

export type VerificationStatus = 'Verified' | 'Pending' | 'Unverified';

export type MembershipTier = 'Free' | 'Premium';

export type UserRole = 'GUEST' | 'FREE' | 'PREMIUM' | 'ADMIN';

export type PhotoPrivacy = 'PUBLIC' | 'PRIVATE' | 'MATCH_ONLY' | 'PREMIUM_ONLY';

export type InterestStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'SENT'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'PENDING';

export type MatchStatus = 'ACTIVE' | 'BLOCKED' | 'ENDED';

export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type PaymentPurpose = 'subscription' | 'interest';

export type MessageType = 'TEXT' | 'IMAGE' | 'CONTACT' | 'SYSTEM';

export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface PartnerPreference {
  ageRange: string;
  maritalStatuses: MaritalStatus[];
  religion: string;
  minHeight: string;
  education: string;
  location: string;
  profession?: string;
}

export interface Profile {
  id: string;
  fullName: string;
  age: number;
  gender: Gender;
  maritalStatus: MaritalStatus;
  hasChildren: boolean;
  childrenCount?: number;
  childrenLivingWith?: string;
  height: string;
  religion: Religion;
  motherTongue?: string;
  education: string;
  institution?: string;
  profession: string;
  company?: string;
  income?: string;
  location: string;
  city: string;
  country: string;
  countryFlag?: string;
  residencyStatus?: string;
  photoUrl: string;
  additionalPhotos?: string[];
  photoPrivacy: PhotoPrivacy;
  isVerified: boolean;
  verificationDetails?: {
    identityVerified: boolean;
    backgroundChecked: boolean;
    educationVerified: boolean;
  };
  matchPercentage: number;
  matchReasons: string[];
  bio: string;
  lifestyle?: string[];
  hobbies?: string[];
  languages?: string[];
  familyType?: string;
  familyLocation?: string;
  parentsOccupation?: string;
  siblings?: string;
  partnerPreferences: PartnerPreference;
  trustScore: number;
  membershipTier: MembershipTier;
  createdAt: string;
  isShortlisted?: boolean;
  lastActive?: string;
}

export interface Interest {
  id: string;
  senderId: string;
  receiverId: string;
  senderProfile: Profile;
  receiverProfile: Profile;
  status: InterestStatus;
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Match {
  id: string;
  matchId?: string;
  userOneId: string;
  userTwoId: string;
  profile: Profile;
  compatibilityScore: number;
  matchedAt: string;
  status: MatchStatus;
}

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  userId: string;
  recipientId?: string;
  purpose: PaymentPurpose;
  amount: number;
  currency: string;
  status: PaymentStatus;
  gateway: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: string;
  sentAt?: string;
  readAt?: string;
  mediaUrl?: string;
  contactDetails?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
}

export interface Conversation {
  id: string;
  matchId: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'ACTIVE' | 'BLOCKED' | 'ENDED';
  profile: Profile;
}

export interface SharedPhoto {
  id: string;
  matchId: string;
  senderId: string;
  url: string;
  createdAt: string;
  privacy: PhotoPrivacy;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  startedAt: string;
  expiresAt: string;
  transactionId: string;
  paymentMethod: string;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId?: string;
  transactionId: string;
  amount: number;
  currency: string;
  gateway: string;
  status: PaymentStatus;
  paidAt: string;
  createdAt: string;
  purpose?: PaymentPurpose;
}

export interface SearchFilterOptions {
  seekingGender?: Gender;
  maritalStatus?: MaritalStatus | 'Any';
  minAge?: number;
  maxAge?: number;
  religion?: Religion | 'Any';
  location?: string;
  education?: string;
  profession?: string;
  height?: string;
  income?: string;
  hasChildren?: 'Any' | 'Yes' | 'No';
  familyType?: string;
  verifiedOnly?: boolean;
  sortBy?: 'best_match' | 'newest' | 'compatibility' | 'recently_active';
}

export interface SuccessStory {
  id: string;
  coupleNames?: string;
  headline?: string;
  storyText?: string;
  photoUrl: string;
  marriageYear?: string;
  location: string;
  maritalHistory?: string;
  husbandName?: string;
  wifeName?: string;
  husbandAge?: number;
  wifeAge?: number;
  husbandStatus?: string;
  wifeStatus?: string;
  marriageDate?: string;
  quote?: string;
  story?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  priceUSD: number;
  priceBDT: number;
  billingCycle: string;
  description: string;
  badge?: string;
  features: {
    text: string;
    included: boolean;
  }[];
  isPopular?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}
