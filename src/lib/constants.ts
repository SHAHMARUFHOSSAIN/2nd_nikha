import { NavItem, MembershipPlan } from '@/types';

export const BRAND_NAME = '2nd Nikah';
export const BRAND_TAGLINE = 'Every Heart Deserves a Second Nikah';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'AI Match', href: '/search' },
  { label: 'Success Stories', href: '/stories' },
  { label: 'Membership', href: '/membership' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const MARITAL_STATUS_OPTIONS = [
  'Divorced',
  'Widowed',
  'Single Parent',
  'Never Married',
] as const;

export const RELIGION_OPTIONS = [
  'Islam',
  'Hinduism',
  'Christianity',
  'Buddhism',
  'Other',
] as const;

export const DEFAULT_COUNTRY_OPTIONS = [
  { label: 'All Countries (Global)', value: 'All', flag: '🌐' },
  { label: '🇧🇩 Bangladesh', value: 'Bangladesh', flag: '🇧🇩' },
  { label: '🇮🇳 India', value: 'India', flag: '🇮🇳' },
  { label: '🇵🇰 Pakistan', value: 'Pakistan', flag: '🇵🇰' },
  { label: '🇺🇸 United States (Expat NRB)', value: 'United States', flag: '🇺🇸' },
  { label: '🇬🇧 United Kingdom (Expat NRB)', value: 'United Kingdom', flag: '🇬🇧' },
  { label: '🇦🇪 United Arab Emirates (UAE Expat)', value: 'UAE', flag: '🇦🇪' },
  { label: '🇸🇦 Saudi Arabia (Expat)', value: 'Saudi Arabia', flag: '🇸🇦' },
  { label: '🇨🇦 Canada (Expat NRB)', value: 'Canada', flag: '🇨🇦' },
  { label: '🇲🇾 Malaysia (Expat NRB)', value: 'Malaysia', flag: '🇲🇾' },
];

export const AGE_RANGE_MIN = 22;
export const AGE_RANGE_MAX = 65;

export const MEMBERSHIP_CONFIG = {
  WEEKLY_BDT: 99,
  MONTHLY_BDT: 299,
  CURRENCY_SYMBOL_BDT: '৳',
};

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    priceUSD: 0.99,
    priceBDT: 99,
    billingCycle: 'per week',
    description: '1 week access to send interests, unlock chat, and direct contact details.',
    features: [
      { text: 'Create & Verify Profile', included: true },
      { text: 'Browse All Profiles', included: true },
      { text: 'Send Unlimited Interest & Connects', included: true },
      { text: 'Direct Messaging & Chat', included: true },
      { text: 'Access Private Photos', included: true },
      { text: 'Verified Contact Sharing', included: true },
    ],
    isPopular: false,
  },
  {
    id: 'monthly',
    name: 'Monthly Pass',
    priceUSD: 2.99,
    priceBDT: 299,
    billingCycle: 'per month',
    badge: 'Best Value For Remarriage',
    description: '30 days full premium access with priority search placement and 24/7 VIP support.',
    features: [
      { text: 'Create & Verify Profile', included: true },
      { text: 'Browse All Profiles', included: true },
      { text: 'Send Unlimited Interest & Connects', included: true },
      { text: 'Direct Messaging & Chat', included: true },
      { text: 'Access Private Photos', included: true },
      { text: 'Verified Contact Sharing', included: true },
      { text: 'Priority Search Placement & VIP Support', included: true },
    ],
    isPopular: true,
  },
];

export const TRUST_STATS = [
  { label: 'Verified Profiles', value: '10,000+' },
  { label: 'Successful Remarriages', value: '2,400+' },
  { label: 'Trust & Privacy Rating', value: '99.8%' },
  { label: 'Dedicated Matchmakers', value: '24/7 Support' },
];
