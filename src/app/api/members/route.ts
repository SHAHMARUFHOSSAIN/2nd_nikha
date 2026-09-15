import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, isAdmin, unauthorized } from '@/lib/auth';
import { queryWithTimeout } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function publicProfile(p: any) {
  return {
    id: p.id,
    userId: p.userId,
    fullName: p.user?.fullName || 'Anonymous Member',
    age: p.age,
    gender: p.gender,
    height: p.height,
    maritalStatus: p.maritalStatus,
    religion: p.religion,
    location: p.location,
    country: p.user?.country || 'Bangladesh',
    countryFlag: p.user?.countryFlag || '🇧🇩',
    education: p.education,
    institution: p.institution,
    profession: p.profession,
    bio: p.bio,
    photoUrl: p.photoUrl,
    photos: [p.photoUrl].filter(Boolean),
    isVerified: p.user?.isVerified || false,
    isNidVerified: p.isNidVerified || false,
    trustScore: p.trustScore,
    matchPercentage: p.matchPercentage,
    userRole: p.user?.userRole || 'FREE',
    subscriptionExpiresAt: p.subscriptionExpiresAt,
    isSubscriptionActive: p.isSubscriptionActive,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '',
  };
}

export async function GET(req: Request) {
  try {
    const profiles = await queryWithTimeout(
      () =>
        db.profile.findMany({
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        }),
      [] as any[],
      1500
    );

    const members = profiles.map(publicProfile);
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

    await db.profile.deleteMany({ where: { id } }).catch(() => {});
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
    const {
      fullName,
      email,
      phone,
      age,
      gender,
      height,
      maritalStatus,
      religion,
      location,
      country,
      education,
      profession,
      bio,
      photoUrl,
      isVerified,
    } = body;

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Full name required' }, { status: 400 });
    }

    const user = await db.user.upsert({
      where: { email: email || `admin-created-${Date.now()}@2ndnikah.com` },
      update: { fullName, isVerified: !!isVerified },
      create: {
        fullName,
        email: email || `admin-created-${Date.now()}@2ndnikah.com`,
        phone: phone || '',
        passwordHash: '$2b$12$unreachable.admin.created.only',
        isVerified: !!isVerified,
        country: country || 'Bangladesh',
      },
    });

    const profile = await db.profile.create({
      data: {
        userId: user.id,
        age: age ? Number(age) : 30,
        gender: gender || 'Female',
        height: height || "5'4\"",
        maritalStatus: maritalStatus || 'Divorced',
        religion: religion || 'Islam',
        location: location || 'Dhaka, Bangladesh',
        education: education || 'Bachelor Degree',
        profession: profession || 'Professional',
        bio: bio || '',
        photoUrl: photoUrl || '',
      },
    });

    return NextResponse.json({ success: true, profile: publicProfile({ ...profile, user }) }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving member:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}