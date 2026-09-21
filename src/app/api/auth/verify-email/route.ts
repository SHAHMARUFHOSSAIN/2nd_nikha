import { NextRequest, NextResponse } from 'next/server';
import { consumeVerificationToken } from '@/lib/email-verification';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const token = (body?.token || '').toString().trim();
    if (!token) {
      return NextResponse.json({ success: false, error: 'Verification token is required' }, { status: 400 });
    }

    const user = await consumeVerificationToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'This verification link is invalid, expired, or has already been used. Please request a new verification email.',
          code: 'TOKEN_INVALID',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      emailVerifiedAt: user.emailVerifiedAt,
      user: { id: user.id, email: user.email },
    });
  } catch (error: any) {
    console.error('Verify email error:', error);
    return NextResponse.json({ success: false, error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}

// Also support token validation via a signed/opaque URL opened directly in the
// browser (GET support so /verify-email?token=... can POST on its own).
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || '';
  if (!token) {
    return NextResponse.json({ success: false, error: 'Verification token is required' }, { status: 400 });
  }
  const user = await consumeVerificationToken(token);
  if (!user) {
    return NextResponse.json(
      { success: false, code: 'TOKEN_INVALID', error: 'This verification link is invalid, expired, or has already been used.' },
      { status: 400 }
    );
  }
  return NextResponse.json({ success: true, emailVerifiedAt: user.emailVerifiedAt });
}