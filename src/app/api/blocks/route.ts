import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const blocks = await db.blockedUser.findMany({ where: { blockerId: session.id } });
    return NextResponse.json({ success: true, blockedUserIds: blocks.map((b) => b.blockedId) });
  } catch (error: any) {
    console.error('GET /api/blocks error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load blocks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();
    const userId: string = body?.userId;
    if (!userId || userId === session.id) {
      return NextResponse.json({ success: false, error: 'Invalid user' }, { status: 400 });
    }

    await db.blockedUser.upsert({
      where: { blockerId_blockedId: { blockerId: session.id, blockedId: userId } },
      update: { reason: body?.reason || undefined },
      create: { blockerId: session.id, blockedId: userId, reason: body?.reason || null },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/blocks error:', error);
    return NextResponse.json({ success: false, error: 'Failed to block user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const userId = new URL(req.url).searchParams.get('userId');
    if (!userId) return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });

    await db.blockedUser.deleteMany({ where: { blockerId: session.id, blockedId: userId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/blocks error:', error);
    return NextResponse.json({ success: false, error: 'Failed to unblock user' }, { status: 500 });
  }
}
