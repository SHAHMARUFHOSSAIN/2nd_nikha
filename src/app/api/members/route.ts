import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), '.data');
const MEMBERS_FILE = path.join(DATA_DIR, 'members.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {}
}

function readDiskMembers(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(MEMBERS_FILE)) {
      const content = fs.readFileSync(MEMBERS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function writeDiskMembers(members: any[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2), 'utf-8');
  } catch (e) {}
}

function isMockProfileId(id: string | undefined | null): boolean {
  if (!id) return false;
  const mockIds = ['p-101', 'p-102', 'p-103', 'p-104', 'p-105', 'p-106', 'p-107', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5'];
  if (mockIds.includes(id)) return true;
  if (id.startsWith('p-') && !id.startsWith('p-real-') && !id.startsWith('p-cust-') && !id.startsWith('p-txn-')) {
    const rawNum = id.replace('p-', '');
    const num = parseInt(rawNum, 10);
    if (!isNaN(num) && num < 10000) return true;
  }
  return false;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const purgeDummy = url.searchParams.get('purgeDummy') === 'true';

  let diskMembers = readDiskMembers();
  let formattedDbMembers: any[] = [];

  try {
    const dbProfiles = await Promise.race([
      db.profile.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      new Promise<any[]>((res) => setTimeout(() => res([]), 600)),
    ]).catch(() => []);

    if (Array.isArray(dbProfiles) && dbProfiles.length > 0) {
      formattedDbMembers = dbProfiles.map((p) => ({
        id: p.id,
        userId: p.userId,
        fullName: p.user?.fullName || 'Anonymous Member',
        email: p.user?.email || '',
        phone: p.user?.phone || '',
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
        photos: [p.photoUrl],
        isVerified: p.user?.isVerified || false,
        trustScore: p.trustScore,
        userRole: p.user?.userRole || 'FREE',
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }));
    }
  } catch (e) {}

  // Merge disk members and DB members (disk takes precedence for fresh registered profiles)
  let combined = [...diskMembers];
  for (const dbm of formattedDbMembers) {
    if (!combined.some((m) => m.id === dbm.id || (m.email && dbm.email && m.email.toLowerCase() === dbm.email.toLowerCase()))) {
      combined.push(dbm);
    }
  }

  if (purgeDummy) {
    combined = combined.filter((m) => !isMockProfileId(m?.id));
  }

  return NextResponse.json({ success: true, members: combined });
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const purgeDummy = url.searchParams.get('purgeDummy');
    if (purgeDummy === 'true') {
      let diskMembers = readDiskMembers();
      const cleanMembers = diskMembers.filter((m: any) => !isMockProfileId(m?.id));
      writeDiskMembers(cleanMembers);
      return NextResponse.json({ success: true, message: 'Purged mock profiles from disk' });
    }
    return NextResponse.json({ success: false, error: 'Invalid operation' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
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
      photos,
      isVerified,
    } = body;

    if (!fullName) {
      return NextResponse.json({ success: false, error: 'Full name required' }, { status: 400 });
    }

    const memberId = id || `p-${Date.now()}`;
    const userEmail = email || `user-${Date.now()}@2ndnikah.com`;
    const userPhone = phone || `017${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newMemberRecord = {
      ...body,
      id: memberId,
      fullName,
      email: userEmail,
      phone: userPhone,
      photoUrl: photoUrl || photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
      photos: Array.isArray(photos) && photos.length > 0 ? photos : [photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'],
      createdAt: body.createdAt || new Date().toISOString().split('T')[0],
    };

    // Save to Disk JSON database
    let diskMembers = readDiskMembers();
    const existingIndex = diskMembers.findIndex((m) => m.id === memberId || (m.email && m.email.toLowerCase() === userEmail.toLowerCase()));
    if (existingIndex >= 0) {
      diskMembers[existingIndex] = { ...diskMembers[existingIndex], ...newMemberRecord };
    } else {
      diskMembers = [newMemberRecord, ...diskMembers];
    }
    writeDiskMembers(diskMembers);

    // Background sync to MySQL DB
    try {
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

      const existingProfile = await db.profile.findFirst({
        where: { OR: [{ id: memberId }, { userId: user.id }] },
      });

      if (existingProfile) {
        await db.profile.update({
          where: { id: existingProfile.id },
          data: {
            age: age ? Number(age) : 30,
            gender: gender || 'Female',
            height: height || "5'4\"",
            maritalStatus: maritalStatus || 'Divorced',
            religion: religion || 'Islam',
            location: location || 'Dhaka, Bangladesh',
            education: education || 'Bachelor Degree',
            profession: profession || 'Professional',
            bio: bio || '',
            photoUrl: newMemberRecord.photoUrl,
          },
        });
      } else {
        await db.profile.create({
          data: {
            id: memberId,
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
            photoUrl: newMemberRecord.photoUrl,
          },
        });
      }
    } catch (e) {
      console.warn('MySQL background sync note:', e);
    }

    return NextResponse.json({ success: true, profile: newMemberRecord });
  } catch (error: any) {
    console.error('Error saving member:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
