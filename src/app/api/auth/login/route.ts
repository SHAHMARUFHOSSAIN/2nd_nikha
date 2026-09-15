import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSessionToken, setSessionCookie, SessionUser } from '@/lib/auth';
import { sanitizeString } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const identifier = sanitizeString(body.identifier, 150).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    const isAdminAttempt = sanitizeString(body.isAdmin, 10) === 'true';

    if (!identifier || !password) {
      return NextResponse.json({ success: false, error: 'Email/phone and password are required' }, { status: 400 });
    }

    // 1. Find the user by email/phone (just the user record, lightweight)
    const lightweightUser = await db.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
      select: { id: true, passwordHash: true, userRole: true, email: true, phone: true },
    });

    // 2. Legacy fallback: allow login via profile email/phone lookup
    let userId = lightweightUser?.id;
    if (!userId && !isAdminAttempt) {
      const legacyProfile = await db.profile.findFirst({
        where: {
          OR: [{ user: { email: identifier } }, { user: { phone: identifier } }],
        },
        select: { userId: true },
      });
      if (legacyProfile) userId = legacyProfile.userId;
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: 'No account found. Please register first.' }, { status: 401 });
    }

    // 3. Fetch full user + profile
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'Account not found.' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password, targetUser.passwordHash).catch(() => false);

    // Handle legacy placeholder hash (users created by old registration without real hashing)
    if (!passwordMatches && targetUser.passwordHash === '$2b$10$hashedpasswordplaceholder') {
      return NextResponse.json(
        { success: false, error: 'This legacy account needs a password reset. Please contact support.' },
        { status: 401 }
      );
    }

    if (!passwordMatches) {
      return NextResponse.json({ success: false, error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

    const sessionUser: SessionUser = {
      id: targetUser.id,
      email: targetUser.email,
      fullName: targetUser.fullName,
      role: targetUser.userRole || 'FREE',
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json({
      success: true,
      user: {
        id: targetUser.id,
        fullName: targetUser.fullName,
        email: targetUser.email,
        phone: targetUser.phone,
        userRole: targetUser.userRole,
        isVerified: targetUser.isVerified,
        country: targetUser.country,
        countryFlag: targetUser.countryFlag,
        photoUrl: targetUser.photoUrl,
        profile: targetUser.profile,
      },
    });
    await setSessionCookie(response, token);

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed. Please try again.' }, { status: 500 });
  }
}