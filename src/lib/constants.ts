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

export const ALL_PROFESSION_OPTIONS = [
  'Software Engineer / IT Professional',
  'Doctor / Physician / Surgeon',
  'Banker / Finance Professional',
  'Engineer (Civil / Electrical / Mechanical)',
  'Business Owner / Entrepreneur',
  'Government Officer / BCS Cadre',
  'Teacher / Lecturer / Professor',
  'Corporate Executive / Manager',
  'Lawyer / Legal Practitioner',
  'Accountant / CA / Auditor',
  'Architect / Interior Designer',
  'Defense Officer (Army / Navy / Air Force)',
  'Pilot / Aviation Professional',
  'HR / Marketing Specialist',
  'Pharmacist / Healthcare Professional',
  'Freelancer / Consultant / Digital Creator',
  'Media / Journalist / Writer',
  'Homemaker / Family Business',
  'Student / Researcher',
  'Other Profession',
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
    'Dhaka (Capital)',
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
    'Faridpur',
    'Manikganj',
    'Munshiganj',
    'Narsingdi',
    'Rajbari',
    'Shariatpur',
    'Gopalganj',
    'Madaripur',
    'Kishoreganj',
    'Brahmanbaria',
    'Chandpur',
    'Lakshmipur',
    'Rangamati',
    'Khagrachhari',
    'Bandarban',
    'Moulvibazar',
    'Habiganj',
    'Sunamganj',
    'Sirajganj',
    'Naogaon',
    'Natore',
    'Joypurhat',
    'Chapainawabganj',
    'Bagerhat',
    'Chuadanga',
    'Jhenaidah',
    'Magura',
    'Meherpur',
    'Narail',
    'Satkhira',
    'Bhola',
    'Jhalokati',
    'Patuakhali',
    'Pirojpur',
    'Barguna',
    'Gaibandha',
    'Kurigram',
    'Lalmonirhat',
    'Nilphamari',
    'Panchagarh',
    'Thakurgaon',
    'Jamalpur',
    'Netrokona',
    'Sherpur',
  ],
  India: ['New Delhi (Capital)', 'Kolkata', 'Mumbai', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Patna', 'Chandigarh'],
  Pakistan: ['Islamabad (Capital)', 'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 'Peshawar', 'Multan', 'Quetta', 'Gujranwala', 'Sialkot'],
  'United States': ['Washington DC (Capital)', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Dallas', 'Atlanta', 'San Francisco', 'Boston', 'Seattle', 'Detroit', 'Miami', 'San Jose', 'Philadelphia', 'Phoenix', 'San Diego', 'Austin', 'Virginia', 'Maryland'],
  'United Kingdom': ['London (Capital)', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Liverpool', 'Edinburgh', 'Bristol', 'Cardiff', 'Belfast', 'Leicester', 'Luton', 'Coventry'],
  UAE: ['Abu Dhabi (Capital)', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'],
  'Saudi Arabia': ['Riyadh (Capital)', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Tabuk', 'Abha', 'Jubail'],
  Canada: ['Ottawa (Capital)', 'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Edmonton', 'Winnipeg', 'Quebec City', 'Halifax'],
  Malaysia: ['Kuala Lumpur (Capital)', 'Penang', 'Johor Bahru', 'Shah Alam', 'Melaka', 'Ipoh', 'Selangor'],
  Australia: ['Canberra (Capital)', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast'],
};

export function getCitiesForCountry(countryName: string): string[] {
  if (!countryName || countryName === 'Any' || countryName === 'All') {
    return Array.from(new Set(Object.values(COUNTRY_CITY_MAP).flat()));
  }
  const clean = countryName.toLowerCase().trim();

  if (clean.includes('bangladesh') || clean === 'bd') return COUNTRY_CITY_MAP['Bangladesh'] || [];
  if (clean.includes('united states') || clean.includes('usa') || clean === 'us' || clean.includes('america')) return COUNTRY_CITY_MAP['United States'] || [];
  if (clean.includes('united kingdom') || clean.includes('uk') || clean.includes('england') || clean.includes('london')) return COUNTRY_CITY_MAP['United Kingdom'] || [];
  if (clean.includes('uae') || clean.includes('emirates') || clean.includes('dubai')) return COUNTRY_CITY_MAP['UAE'] || [];
  if (clean.includes('saudi') || clean === 'ksa') return COUNTRY_CITY_MAP['Saudi Arabia'] || [];
  if (clean.includes('canada')) return COUNTRY_CITY_MAP['Canada'] || [];
  if (clean.includes('malaysia')) return COUNTRY_CITY_MAP['Malaysia'] || [];
  if (clean.includes('india')) return COUNTRY_CITY_MAP['India'] || [];
  if (clean.includes('pakistan')) return COUNTRY_CITY_MAP['Pakistan'] || [];
  if (clean.includes('australia')) return COUNTRY_CITY_MAP['Australia'] || [];

  const directMatchKey = Object.keys(COUNTRY_CITY_MAP).find(
    (k) => k.toLowerCase() === clean || clean.includes(k.toLowerCase()) || k.toLowerCase().includes(clean)
  );
  if (directMatchKey) return COUNTRY_CITY_MAP[directMatchKey];

  return Array.from(new Set(Object.values(COUNTRY_CITY_MAP).flat()));
}

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
      { text: 'Complete Matrimonial Profile Setup', included: true },
      { text: 'Unlimited AI Match Searches & Profiles', included: true },
      { text: 'Direct Messaging, Photos & WhatsApp Sharing', included: true },
      { text: 'Priority NID Verification & VIP Crown Badge', included: true },
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
      { text: 'Complete Matrimonial Profile Setup', included: true },
      { text: 'Unlimited AI Match Searches & Profiles', included: true },
      { text: 'Direct Messaging, Photos & WhatsApp Sharing', included: true },
      { text: 'Priority NID Verification & VIP Crown Badge', included: true },
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
