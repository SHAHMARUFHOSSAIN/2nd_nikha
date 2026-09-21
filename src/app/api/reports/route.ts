import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();
    const userId: string = body?.userId;
    const reason: string = body?.reason || body?.details || 'Reported by member';
    if (!userId || userId === session.id) {
      return NextResponse.json({ success: false, error: 'Invalid user' }, { status: 400 });
    }

    await db.report.create({
      data: {
        reporterId: session.id,
        reportedUserId: userId,
        reason,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/reports error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit report' }, { status: 500 });
  }
}
