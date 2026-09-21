import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { resolveMatchId } from '@/lib/chat-server';

export const dynamic = 'force-dynamic';

export async function DELETE(_req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  const { matchId } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const resolved = await resolveMatchId(matchId);
    if (!resolved || (resolved.userAId !== session.id && resolved.userBId !== session.id)) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    await db.message.deleteMany({ where: { matchId: resolved.matchId } });
    await db.conversation.deleteMany({
      where: {
        OR: [
          { userAId: resolved.userAId, userBId: resolved.userBId },
          { userAId: resolved.userBId, userBId: resolved.userAId },
        ],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE conversation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete conversation' }, { status: 500 });
  }
}
