import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return unauthorized('Not logged in');
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        userRole: true,
        isVerified: true,
        emailVerifiedAt: true,
        country: true,
        countryFlag: true,
        photoUrl: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            age: true,
            gender: true,
            height: true,
            maritalStatus: true,
            religion: true,
            motherTongue: true,
            location: true,
            education: true,
            institution: true,
            profession: true,
            company: true,
            bio: true,
            photoUrl: true,
            additionalPhotos: true,
            partnerPreferences: true,
            matchReasons: true,
            photoPrivacy: true,
            subscriptionExpiresAt: true,
            isSubscriptionActive: true,
            matchPercentage: true,
            trustScore: true,
          },
        },
      },
    });

    if (!user) {
      return unauthorized('Account no longer exists');
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Me error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load session' }, { status: 500 });
  }
}