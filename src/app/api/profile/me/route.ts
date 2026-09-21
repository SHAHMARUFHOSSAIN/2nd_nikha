import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const USER_FIELDS = ['fullName', 'phone', 'country', 'countryFlag', 'photoUrl'] as const;
const PROFILE_FIELDS = [
  'age',
  'gender',
  'height',
  'maritalStatus',
  'religion',
  'motherTongue',
  'location',
  'education',
  'institution',
  'profession',
  'company',
  'bio',
  'photoUrl',
  'additionalPhotos',
  'partnerPreferences',
  'photoPrivacy',
] as const;

async function loadUser(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      userRole: true,
      isVerified: true,
      country: true,
      countryFlag: true,
      photoUrl: true,
      createdAt: true,
      profile: true,
    },
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const user = await loadUser(session.id);
    if (!user) return unauthorized('Account no longer exists');
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('GET /api/profile/me error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();

    const userData: Record<string, any> = {};
    for (const key of USER_FIELDS) {
      if (body[key] !== undefined) userData[key] = body[key];
    }

    const profileData: Record<string, any> = {};
    for (const key of PROFILE_FIELDS) {
      if (body[key] !== undefined) profileData[key] = body[key];
    }
    if (profileData.age !== undefined) profileData.age = Number(profileData.age) || 18;

    if (Object.keys(userData).length > 0) {
      await db.user.update({ where: { id: session.id }, data: userData });
    }

    if (Object.keys(profileData).length > 0) {
      const existing = await db.profile.findUnique({ where: { userId: session.id } });
      if (existing) {
        await db.profile.update({ where: { userId: session.id }, data: profileData });
      } else {
        await db.profile.create({
          data: {
            userId: session.id,
            age: Number(profileData.age) || 30,
            gender: profileData.gender || 'Female',
            height: profileData.height || "5'5\"",
            maritalStatus: profileData.maritalStatus || 'Divorced',
            religion: profileData.religion || 'Islam',
            location: profileData.location || 'Dhaka, Bangladesh',
            education: profileData.education || 'Bachelor Degree',
            profession: profileData.profession || 'Professional',
            bio: profileData.bio || '',
            photoUrl: profileData.photoUrl || '',
            ...profileData,
          },
        });
      }
    }

    const user = await loadUser(session.id);
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('PATCH /api/profile/me error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save profile' },
      { status: 500 }
    );
  }
}
