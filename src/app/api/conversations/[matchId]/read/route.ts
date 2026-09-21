import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { resolveMatchId } from '@/lib/chat-server';

export const dynamic = 'force-dynamic';

export async function POST(_req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  const { matchId } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const resolved = await resolveMatchId(matchId);
    if (!resolved || (resolved.userAId !== session.id && resolved.userBId !== session.id)) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    await db.message.updateMany({
      where: { matchId: resolved.matchId, receiverId: session.id, status: { not: 'READ' } },
      data: { status: 'READ' },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST read error:', error);
    return NextResponse.json({ success: false, error: 'Failed to mark as read' }, { status: 500 });
  }
}
