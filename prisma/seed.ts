import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding 2nd Chance Matrimonial Database for MySQL...');

  // Clean old records
  await prisma.setting.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.interest.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Seed Main User (Anika Rahman)
  const userAnika = await prisma.user.create({
    data: {
      id: 'p-101',
      fullName: 'Anika Rahman',
      email: 'anika.rahman@example.com',
      phone: '+8801712345678',
      passwordHash: 'hashed_password_sample',
      userRole: 'PREMIUM',
      isVerified: true,
      country: 'Bangladesh',
      countryFlag: '🇧🇩',
      profile: {
        create: {
          age: 32,
          gender: 'Female',
          height: `5' 4"`,
          maritalStatus: 'Divorced',
          religion: 'Islam (Sunni)',
          motherTongue: 'Bengali',
          location: 'Gulshan, Dhaka',
          education: 'MSc in Computer Science',
          institution: 'University of Dhaka',
          profession: 'Lead UX Architect',
          company: 'Brain Station 23',
          bio: 'Divorced with a 4-year-old daughter. Looking for a mature, respectful partner who values family, Islamic principles, and mutual growth.',
          photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
          familyType: 'Nuclear Respectable Family',
          familyLocation: 'Dhanmondi, Dhaka',
          parentsOccupation: 'Father Retired Govt Officer, Mother Homemaker',
          siblings: '1 Younger Brother (Software Engineer)',
          lifestyle: ['Halal Lifestyle', 'Non-Smoker', 'Family Focused'],
          partnerPreferences: {
            ageRange: '32 - 42',
            maritalStatuses: ['Divorced', 'Widowed', 'Single Parent'],
            religion: 'Islam',
            minHeight: `5' 7"`,
            education: 'BSc / MSc / PhD',
            location: 'Dhaka or Global Expat (USA/UK/UAE)',
          },
          matchPercentage: 98,
          trustScore: 99,
        },
      },
    },
  });

  // 2. Seed Candidate Profiles
  const userNusrat = await prisma.user.create({
    data: {
      id: 'p-103',
      fullName: 'Nusrat Jahan',
      email: 'nusrat.jahan@example.com',
      phone: '+16175550199',
      passwordHash: 'hashed_password_sample',
      userRole: 'PREMIUM',
      isVerified: true,
      country: 'USA',
      countryFlag: '🇺🇸',
      residencyStatus: 'Green Card Holder',
      profile: {
        create: {
          age: 35,
          gender: 'Female',
          height: `5' 5"`,
          maritalStatus: 'Single Parent',
          religion: 'Islam',
          location: 'Boston, MA, USA',
          education: 'MD Pediatrics, Harvard Fellow',
          institution: 'Harvard Medical School',
          profession: 'Consultant Pediatrician',
          company: 'Boston Childrens Hospital',
          bio: 'Widowed mother living in Boston. Seeking a compassionate BD or NRB candidate with high family values.',
          photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
          matchPercentage: 94,
        },
      },
    },
  });

  const userTariqul = await prisma.user.create({
    data: {
      id: 'p-106',
      fullName: 'Dr. Tariqul Islam',
      email: 'tariqul.islam@example.com',
      phone: '+971501234567',
      passwordHash: 'hashed_password_sample',
      userRole: 'PREMIUM',
      isVerified: true,
      country: 'UAE',
      countryFlag: '🇦🇪',
      residencyStatus: 'Golden Visa Holder',
      profile: {
        create: {
          age: 38,
          gender: 'Male',
          height: `5' 10"`,
          maritalStatus: 'Divorced',
          religion: 'Islam',
          location: 'Dubai, UAE',
          education: 'MBBS, FCPS Cardiology',
          institution: 'Chittagong Medical College',
          profession: 'Senior Cardiologist',
          company: 'Dubai Health Authority',
          bio: 'Senior doctor living in Dubai. Values honesty, religious values, and simple modern family life.',
          photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
          matchPercentage: 92,
        },
      },
    },
  });

  // 3. Seed CMS Articles & FAQs
  await prisma.article.createMany({
    data: [
      {
        title: 'Building Trust After Divorce: A Guide for Bangladeshi Singles',
        slug: 'building-trust-after-divorce',
        excerpt: 'Practical and emotional advice on opening your heart to a second chance at marriage with confidence.',
        content: 'Entering the matrimonial market after a divorce requires patience, clarity, and self-compassion...',
        category: 'Marriage Advice',
        author: 'Dr. Reshma Parveen',
      },
      {
        title: 'Expat NRB Matrimony: Navigating Distance and Family Expectations',
        slug: 'expat-nrb-matrimony-guide',
        excerpt: 'How Bangladeshi expats in USA, UK, and UAE can find compatible life partners while preserving cultural roots.',
        content: 'Living overseas brings career success but finding a compatible partner from back home requires clear communication...',
        category: 'Expat NRB Guide',
        author: 'Editorial Team',
      },
    ],
  });

  await prisma.fAQ.createMany({
    data: [
      {
        question: 'How is NID Verification audited on 2nd Chance?',
        answer: 'Every candidate submits a National ID (NID) or Passport copy. Our moderation team verifies the details before awarding the green verified badge.',
        category: 'Verification',
        order: 1,
      },
      {
        question: 'Can international members pay via SSLCommerz?',
        answer: 'Yes! International users in USA, UK, UAE, Saudi Arabia, Canada, and Europe can pay in USD using Visa, Mastercard, or AMEX via SSLCommerz gateway.',
        category: 'Payments',
        order: 2,
      },
    ],
  });

  console.log('✅ Seeding Completed Successfully for MySQL 2ndchance_db!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
