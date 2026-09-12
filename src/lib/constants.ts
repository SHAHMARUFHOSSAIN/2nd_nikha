import { NavItem, MembershipPlan } from '@/types';

export const BRAND_NAME = '2ndNikah';
export const BRAND_TAGLINE = 'Every Heart Deserves a 2nd Chance';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'AI Match', href: '/search' },
  { label: 'Membership', href: '/membership' },
  { label: 'Blog', href: '/blog' },
];

export const MARITAL_STATUS_OPTIONS = [
  'Divorced',
  'Widowed',
  'Single Parent',
  'Never Married',
  'Married',
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

export const COUNTRY_CITY_MAP: Record<string, string[]> = {
  Bangladesh: [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh',
    'Comilla',
    'Narayanganj',
    'Gazipur',
    'Bogra',
    'Noakhali',
    'Feni',
    "Cox's Bazar",
    'Tangail',
    'Pabna',
    'Kushtia',
    'Jessore',
    'Dinajpur',
  ],
  India: ['Kolkata', 'Mumbai', 'Delhi', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
  Pakistan: ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Quetta'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Dallas', 'Atlanta', 'San Francisco', 'Washington DC', 'Boston', 'Seattle', 'Detroit', 'Miami', 'San Jose'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol'],
  UAE: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Al Ain'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Winnipeg'],
  Malaysia: ['Kuala Lumpur', 'Penang', 'Johor Bahru', 'Shah Alam', 'Melaka', 'Ipoh'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
};

export const AGE_RANGE_MIN = 18;
export const AGE_RANGE_MAX = 65;

export const MEMBERSHIP_CONFIG = {
  WEEKLY_BDT: 99,
  MONTHLY_BDT: 299,
  PREMIUM_WEEKLY_BDT: 99,
  PREMIUM_MONTHLY_BDT: 299,
  CURRENCY_SYMBOL_BDT: '৳',
};

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    priceUSD: 2.99,
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
    priceUSD: 6.99,
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
