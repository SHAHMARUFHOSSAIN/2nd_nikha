import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { formatTime } from '@/lib/chat-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const notifications = await db.notification.findMany({
      where: { ownerId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({
      success: true,
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.body,
        date: formatTime(n.createdAt),
        read: n.isRead,
        targetUrl: n.targetUrl || undefined,
      })),
    });
  } catch (error: any) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load notifications' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json().catch(() => ({}));
    if (body?.id) {
      await db.notification.updateMany({ where: { id: body.id, ownerId: session.id }, data: { isRead: true } });
    } else {
      await db.notification.updateMany({ where: { ownerId: session.id, isRead: false }, data: { isRead: true } });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PATCH /api/notifications error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 });
  }
}
