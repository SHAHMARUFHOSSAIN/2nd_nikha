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
    const payments = await db.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return NextResponse.json({
      success: true,
      payments: payments.map((p) => ({
        id: p.id,
        transactionId: p.transactionId,
        gateway: p.gateway,
        amount: p.amount,
        currency: p.currency || 'BDT',
        purpose: p.purpose || 'subscription',
        status: p.status === 'SUCCESS' ? 'PAID' : p.status,
        paidAt: formatTime(p.paidAt || p.createdAt),
        createdAt: p.createdAt,
        userId: p.userId || undefined,
        email: p.email || undefined,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/payments error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load payments' }, { status: 500 });
  }
}