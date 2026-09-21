import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, isAdmin, unauthorized } from '@/lib/auth';
import { formatTime } from '@/lib/chat-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');
  if (!isAdmin(session)) return unauthorized('Admin access required');

  try {
    const subscriptions = await db.subscription.findMany({
      orderBy: { startsAt: 'desc' },
      take: 500,
    });

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        userId: s.userId,
        planId: s.planId,
        planName: s.planName,
        amount: s.amount,
        currency: s.currency || 'BDT',
        status: s.status,
        paymentMethod: s.planName || s.packageType || 'Online',
        startedAt: formatTime(s.startsAt),
        expiresAt: s.expiresAt ? formatTime(s.expiresAt) : '',
        createdAt: s.startsAt,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/subscriptions error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load subscriptions' }, { status: 500 });
  }
}