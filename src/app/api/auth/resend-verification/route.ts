import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { canResend, issueVerificationToken, sendVerificationEmail } from '@/lib/email-verification';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Not logged in' }, { status: 401 });
  }

  // Never leak whether an arbitrary email belongs to an account: only a logged
  // in (or token-holding) user can trigger a resend for their own account.
  try {
    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, emailVerifiedAt: true },
    });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }

    // Already verified users get no email and no token churn.
    if (user.emailVerifiedAt) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    // Throttle resends to avoid email abuse.
    if (!canResend(user.id)) {
      return NextResponse.json(
        { success: false, error: 'A verification email was recently sent. Please wait a few minutes before requesting another.' },
        { status: 429 }
      );
    }

    // Resending reissues a fresh token, invalidating the previous one.
    const { raw } = await issueVerificationToken(user.id);
    const result = await sendVerificationEmail(user.email, raw);

    return NextResponse.json({
      success: true,
      sent: result.sent,
      skipped: !!result.skipped,
      ...(result.skipped ? { note: 'Delivery is unavailable right now; no email was sent.' } : {}),
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ success: false, error: 'Could not resend verification email.' }, { status: 500 });
  }
}