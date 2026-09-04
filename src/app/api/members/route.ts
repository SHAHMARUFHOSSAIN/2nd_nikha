import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const profiles = await Promise.race([
      db.profile.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      new Promise<any[]>((res) => setTimeout(() => res([]), 300)),
    ]).catch(() => []);

    const formattedMembers = profiles.map((p) => ({
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
      profession: p.profession,
      bio: p.bio,
      photoUrl: p.photoUrl,
      isVerified: p.user?.isVerified || false,
      trustScore: p.trustScore,
      userRole: p.user?.userRole || 'FREE',
      createdAt: p.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({ success: true, members: formattedMembers });
  } catch (error: any) {
    console.warn('DB members read warning:', error.message);
    return NextResponse.json({ success: false, members: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
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

    if (!fullName || !photoUrl) {
      return NextResponse.json({ success: false, error: 'Full name and photoUrl required' }, { status: 400 });
    }

    const userEmail = email || `user-${Date.now()}@2ndchance.com`;
    const userPhone = phone || `017${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Create or find user first
    let user = await db.user.findFirst({
      where: { OR: [{ email: userEmail }, { phone: userPhone }] },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          fullName,
          email: userEmail,
          phone: userPhone,
          passwordHash: '$2b$10$hashedpasswordplaceholder',
          isVerified: isVerified || false,
          country: country || 'Bangladesh',
        },
      });
    }

    let profile;
    if (id && !id.startsWith('p-')) {
      profile = await db.profile.upsert({
        where: { id },
        update: {
          age: age || 30,
          gender: gender || 'Female',
          height: height || '5ft 4in',
          maritalStatus: maritalStatus || 'Divorced',
          religion: religion || 'Islam',
          location: location || 'Dhaka, Bangladesh',
          education: education || 'Bachelor Degree',
          profession: profession || 'Professional',
          bio: bio || '',
          photoUrl: photoUrl,
        },
        create: {
          id,
          userId: user.id,
          age: age || 30,
          gender: gender || 'Female',
          height: height || '5ft 4in',
          maritalStatus: maritalStatus || 'Divorced',
          religion: religion || 'Islam',
          location: location || 'Dhaka, Bangladesh',
          education: education || 'Bachelor Degree',
          profession: profession || 'Professional',
          bio: bio || '',
          photoUrl: photoUrl,
        },
      });
    } else {
      profile = await db.profile.create({
        data: {
          userId: user.id,
          age: age || 30,
          gender: gender || 'Female',
          height: height || '5ft 4in',
          maritalStatus: maritalStatus || 'Divorced',
          religion: religion || 'Islam',
          location: location || 'Dhaka, Bangladesh',
          education: education || 'Bachelor Degree',
          profession: profession || 'Professional',
          bio: bio || '',
          photoUrl: photoUrl,
        },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error('Error saving member to MySQL DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
