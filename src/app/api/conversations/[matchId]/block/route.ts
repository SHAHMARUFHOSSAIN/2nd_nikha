import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { resolveMatchId } from '@/lib/chat-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  const { matchId } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const resolved = await resolveMatchId(matchId);
    if (!resolved || (resolved.userAId !== session.id && resolved.userBId !== session.id)) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });
    }

    const partnerId = resolved.userAId === session.id ? resolved.userBId : resolved.userAId;
    const body = await req.json().catch(() => ({}));
    const action: string | undefined = body?.action;

    const myBlock = await db.blockedUser.findUnique({
      where: { blockerId_blockedId: { blockerId: session.id, blockedId: partnerId } },
    });

    const anyBlock = await db.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: session.id, blockedId: partnerId },
          { blockerId: partnerId, blockedId: session.id },
        ],
      },
    });

    const shouldUnblock = action === 'UNBLOCK' || (action !== 'BLOCK' && Boolean(myBlock));

    if (shouldUnblock) {
      if (!myBlock) {
        return NextResponse.json(
          { success: false, error: 'Only the member who blocked can unblock' },
          { status: 403 }
        );
      }
      await db.blockedUser.delete({ where: { id: myBlock.id } });
      return NextResponse.json({ success: true, status: anyBlock && anyBlock.id !== myBlock.id ? 'BLOCKED' : 'ACTIVE' });
    }

    if (!myBlock) {
      await db.blockedUser.create({ data: { blockerId: session.id, blockedId: partnerId } });
    }
    return NextResponse.json({ success: true, status: 'BLOCKED', blockedBy: session.id });
  } catch (error: any) {
    console.error('POST block error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update block status' }, { status: 500 });
  }
}
