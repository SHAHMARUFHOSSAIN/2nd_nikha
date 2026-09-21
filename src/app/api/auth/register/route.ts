import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSessionToken, setSessionCookie, SessionUser } from '@/lib/auth';
import { claimPaymentsByEmail } from '@/lib/payment/persist-payment';
import { isValidEmail, isValidName, isValidPassword, isValidPhone, sanitizeString, sanitizeText, toInt } from '@/lib/validation';

export const dynamic = 'force-dynamic';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const fullName = sanitizeString(body.fullName, 100);
    const email = sanitizeString(body.email, 100).toLowerCase();
    const phone = sanitizeString(body.phone, 20);
    const password = typeof body.password === 'string' ? body.password : '';
    const gender = sanitizeString(body.gender, 20) || 'Female';
    const country = sanitizeString(body.country, 50) || 'Bangladesh';
    const countryFlag = body.countryFlag ? sanitizeString(body.countryFlag, 10) : '🇧🇩';
    const age = toInt(body.age, 30);
    const maritalStatus = sanitizeString(body.maritalStatus, 20) || 'Divorced';
    const religion = sanitizeString(body.religion, 20) || 'Islam';
    const location = sanitizeString(body.location, 100) || 'Dhaka, Bangladesh';
    const education = sanitizeString(body.education, 100) || 'Bachelor Degree';
    const profession = sanitizeString(body.profession, 100) || 'Professional';
    const bio = sanitizeText(body.bio, 5000) || 'Seeking a genuine, respectful life partner for remarriage.';
    const photoUrl = sanitizeString(body.photoUrl, 2000) || DEFAULT_AVATAR;
    const height = sanitizeString(body.height, 10) || "5'5\"";

    if (!isValidName(fullName)) {
      return NextResponse.json({ success: false, error: 'Full name must be at least 2 characters' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return NextResponse.json({ success: false, error: 'A valid phone number is required' }, { status: 400 });
    }
    if (!isValidPassword(password)) {
      return NextResponse.json({ success: false, error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await db.user.findFirst({
      where: { OR: [{ email }, { phone }] },
      select: { id: true, email: true, phone: true },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: existing.email === email ? 'An account with this email already exists' : 'An account with this phone number already exists' },
        { status: 409 }
      );
    }

    // Pay-before-register gate: registration is only allowed after a successful
    // (verified) subscription payment has been made for this exact email.
    const paid = await db.payment.findFirst({
      where: { email, status: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
    });
    if (!paid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment required.',
          code: 'PAYMENT_REQUIRED',
          message: 'Subscriptions must be purchased before creating an account. Please choose a plan and pay first.',
        },
        { status: 402 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        fullName,
        email,
        phone,
        passwordHash,
        userRole: 'PREMIUM',
        country,
        countryFlag,
        isVerified: false,
        photoUrl,
        profile: {
          create: {
            age,
            gender,
            height,
            maritalStatus,
            religion,
            location,
            education,
            profession,
            bio,
            photoUrl,
          },
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        userRole: true,
        isVerified: true,
        country: true,
        countryFlag: true,
        createdAt: true,
      },
    });

    // Link the guest payment to this account and activate the subscription.
    await claimPaymentsByEmail(email, user.id).catch((e) => console.error('[Register] claimPaymentsByEmail failed:', e));

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.userRole,
    };

    const token = await createSessionToken(sessionUser);
    const response = NextResponse.json(
      { success: true, user: { ...user, role: user.userRole } },
      { status: 201 }
    );
    await setSessionCookie(response, token);

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}