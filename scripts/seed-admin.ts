/**
 * Seed the first admin account.
 * Run:  npx tsx scripts/seed-admin.ts
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@2ndnikah.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe!2026';
  const fullName = process.env.ADMIN_NAME || 'System Administrator';

  const hash = await bcrypt.hash(password, 12);

  const existing = await db.user.findUnique({ where: { email } });

  if (existing) {
    const updated = await db.user.update({
      where: { email },
      data: {
        fullName,
        passwordHash: hash,
        userRole: 'ADMIN',
        isVerified: true,
        country: 'Bangladesh',
        countryFlag: '🇧🇩',
      },
    });
    console.log(`✅ Admin updated: ${updated.email} (${updated.id})`);
  } else {
    const admin = await db.user.create({
      data: {
        fullName,
        email,
        phone: process.env.ADMIN_PHONE || '+8801000000000',
        passwordHash: hash,
        userRole: 'ADMIN',
        isVerified: true,
        country: 'Bangladesh',
        countryFlag: '🇧🇩',
        profile: {
          create: {
            age: 35,
            gender: 'Male',
            height: "5'10\"",
            maritalStatus: 'Married',
            religion: 'Islam',
            location: 'Dhaka, Bangladesh',
            education: 'Master Degree',
            profession: 'Platform Administrator',
            bio: 'System administrator account.',
            photoUrl: '',
          },
        },
      },
    });
    console.log(`✅ Admin created: ${admin.email} (${admin.id})`);
    console.log(`   ⚠️  Default password: ${password}`);
    console.log(`   Change it immediately by setting ADMIN_PASSWORD env and re-running.`);
  }

  await db.$disconnect();
}

main()
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await db.$disconnect();
    process.exit(1);
  });