import { NextResponse } from 'next/server';
import { db, queryWithTimeout } from '@/lib/db';
import { getSession, isAdmin, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function publicProfile(p: any, includeContact = false) {
  return {
    id: p.id,
    userId: p.userId,
    fullName: p.user?.fullName || 'Anonymous Member',
    email: includeContact ? p.user?.email || '' : undefined,
    phone: includeContact ? p.user?.phone || '' : undefined,
    age: p.age,
    gender: p.gender,
    height: p.height,
    maritalStatus: p.maritalStatus,
    religion: p.religion,
    motherTongue: p.motherTongue,
    location: p.location,
    city: p.location,
    country: p.user?.country || 'Bangladesh',
    countryFlag: p.user?.countryFlag || '🇧🇩',
    education: p.education,
    institution: p.institution,
    profession: p.profession,
    company: p.company,
    bio: p.bio,
    photoUrl: p.photoUrl,
    photos: [p.photoUrl, ...(Array.isArray(p.additionalPhotos) ? p.additionalPhotos : [])].filter(Boolean),
    additionalPhotos: Array.isArray(p.additionalPhotos) ? p.additionalPhotos : [],
    partnerPreferences: p.partnerPreferences || undefined,
    matchReasons: p.matchReasons || undefined,
    isVerified: p.user?.isVerified || false,
    trustScore: p.trustScore,
    matchPercentage: p.matchPercentage,
    userRole: p.user?.userRole || 'FREE',
    subscriptionExpiresAt: p.subscriptionExpiresAt,
    isSubscriptionActive: p.isSubscriptionActive,
    membershipTier: p.isSubscriptionActive ? 'Premium' : 'Free',
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '',
  };
}

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
  'matchReasons',
  'matchPercentage',
  'trustScore',
  'photoPrivacy',
  'isSubscriptionActive',
  'subscriptionExpiresAt',
  'subscriptionPlan',
] as const;

function pickProfileData(body: any) {
  const data: Record<string, any> = {};
  for (const key of PROFILE_FIELDS) {
    if (body[key] !== undefined) {
      if (key === 'age' || key === 'matchPercentage' || key === 'trustScore') {
        data[key] = Number(body[key]) || 0;
      } else if (key === 'subscriptionExpiresAt') {
        data[key] = body[key] ? new Date(body[key]) : null;
      } else {
        data[key] = body[key];
      }
    }
  }
  return data;
}

export async function GET() {
  try {
    const session = await getSession();
    const admin = isAdmin(session);

    const profiles = await queryWithTimeout(
      () =>
        db.profile.findMany({
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        }),
      [] as any[],
      4000
    );

    const members = profiles.map((p) => publicProfile(p, admin));
    return NextResponse.json({ success: true, members });
  } catch (error: any) {
    console.error('GET /api/members error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load members' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session)) {
      return unauthorized('Admin access required');
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Profile id required' }, { status: 400 });
    }

    await db.profile.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Profile removed' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session)) {
      return unauthorized('Admin access required');
    }

    const body = await req.json();
    const { id, fullName, email, phone, country, isVerified } = body;

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Full name required' }, { status: 400 });
    }

    // Update path: an existing profile id was supplied.
    if (id) {
      const existing = await db.profile.findUnique({ where: { id }, include: { user: true } });
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Member profile not found' }, { status: 404 });
      }

      const profileData = pickProfileData(body);
      if (Object.keys(profileData).length > 0) {
        await db.profile.update({ where: { id }, data: profileData });
      }

      const userData: Record<string, any> = {};
      if (fullName) userData.fullName = fullName;
      if (country) userData.country = country;
      if (isVerified !== undefined) userData.isVerified = !!isVerified;
      if (email && email !== existing.user?.email) userData.email = email;
      if (phone && phone !== existing.user?.phone) userData.phone = phone;
      if (Object.keys(userData).length > 0) {
        await db.user.update({ where: { id: existing.userId }, data: userData });
      }

      const updated = await db.profile.findUnique({ where: { id }, include: { user: true } });
      return NextResponse.json({ success: true, member: publicProfile(updated, true) });
    }

    // Create path: upsert the user by email, then create the profile.
    const resolvedEmail = email || `admin-created-${Date.now()}@2ndnikah.com`;
    const user = await db.user.upsert({
      where: { email: resolvedEmail },
      update: { fullName, isVerified: !!isVerified, ...(phone ? { phone } : {}) },
      create: {
        fullName,
        email: resolvedEmail,
        phone: phone || `admin-${Date.now()}`,
        passwordHash: '$2b$12$unreachable.admin.created.only',
        isVerified: !!isVerified,
        country: country || 'Bangladesh',
      },
    });

    const profileData = pickProfileData(body);
    const profile = await db.profile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: {
        userId: user.id,
        age: Number(body.age) || 30,
        gender: body.gender || 'Female',
        height: body.height || "5'4\"",
        maritalStatus: body.maritalStatus || 'Divorced',
        religion: body.religion || 'Islam',
        motherTongue: body.motherTongue || 'Bengali',
        location: body.location || 'Dhaka, Bangladesh',
        education: body.education || 'Bachelor Degree',
        profession: body.profession || 'Professional',
        bio: body.bio || '',
        photoUrl: body.photoUrl || '',
        ...profileData,
      },
    });

    const full = await db.profile.findUnique({ where: { id: profile.id }, include: { user: true } });
    return NextResponse.json({ success: true, member: publicProfile(full, true) }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving member:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
