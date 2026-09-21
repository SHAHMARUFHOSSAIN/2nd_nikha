import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import {
  buildMatchId,
  ensureConversation,
  isBlockedBetween,
  loadPartnerProfile,
  mapConversation,
} from '@/lib/chat-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const me = session.id;
    const conversations = await db.conversation.findMany({
      where: { OR: [{ userAId: me }, { userBId: me }] },
      orderBy: { lastMessageAt: 'desc' },
    });

    const result = [];
    for (const conv of conversations) {
      const partnerId = conv.userAId === me ? conv.userBId : conv.userAId;
      const matchId = buildMatchId(conv.userAId, conv.userBId);

      const [partnerProfile, lastMessage, unreadCount, block] = await Promise.all([
        loadPartnerProfile(partnerId),
        db.message.findFirst({ where: { matchId }, orderBy: { createdAt: 'desc' } }),
        db.message.count({ where: { matchId, receiverId: me, status: { not: 'READ' } } }),
        isBlockedBetween(me, partnerId),
      ]);

      result.push(mapConversation(conv, me, partnerProfile, lastMessage, unreadCount, block));
    }

    return NextResponse.json({ success: true, conversations: result });
  } catch (error: any) {
    console.error('GET /api/conversations error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load conversations' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();
    const partnerId: string = body?.partnerId;
    if (!partnerId || partnerId === session.id) {
      return NextResponse.json({ success: false, error: 'Invalid partner' }, { status: 400 });
    }

    const conv = await ensureConversation(session.id, partnerId);
    if (!conv) {
      return NextResponse.json({ success: false, error: 'Could not start conversation' }, { status: 400 });
    }

    const matchId = buildMatchId(conv.userAId, conv.userBId);

    if (body?.message && typeof body.message === 'string' && body.message.trim()) {
      await db.message.create({
        data: {
          matchId,
          conversationId: conv.id,
          senderId: session.id,
          receiverId: partnerId,
          content: body.message.trim(),
          type: 'TEXT',
          status: 'SENT',
        },
      });
      await db.conversation.update({ where: { id: conv.id }, data: { lastMessageAt: new Date() } });
    }

    const [partnerProfile, lastMessage, unreadCount, block] = await Promise.all([
      loadPartnerProfile(partnerId),
      db.message.findFirst({ where: { matchId }, orderBy: { createdAt: 'desc' } }),
      db.message.count({ where: { matchId, receiverId: session.id, status: { not: 'READ' } } }),
      isBlockedBetween(session.id, partnerId),
    ]);

    return NextResponse.json({
      success: true,
      conversation: mapConversation(conv, session.id, partnerProfile, lastMessage, unreadCount, block),
    });
  } catch (error: any) {
    console.error('POST /api/conversations error:', error);
    return NextResponse.json({ success: false, error: 'Failed to start conversation' }, { status: 500 });
  }
}
