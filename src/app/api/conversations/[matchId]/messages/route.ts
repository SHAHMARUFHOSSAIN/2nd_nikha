import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { ensureConversation, mapMessage, resolveMatchId } from '@/lib/chat-server';

export const dynamic = 'force-dynamic';

async function resolve(rawId: string, me: string) {
  const resolved = await resolveMatchId(rawId);
  if (!resolved) return null;
  if (resolved.userAId !== me && resolved.userBId !== me) return null;
  return resolved;
}

export async function GET(_req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  const { matchId } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const resolved = await resolve(matchId, session.id);
    if (!resolved) return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });

    const messages = await db.message.findMany({
      where: { matchId: resolved.matchId },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, messages: messages.map(mapMessage) });
  } catch (error: any) {
    console.error('GET messages error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load messages' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  const { matchId } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const resolved = await resolve(matchId, session.id);
    if (!resolved) return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });

    const body = await req.json();
    const receiverId: string =
      body?.receiverId || (resolved.userAId === session.id ? resolved.userBId : resolved.userAId);

    const type = ['TEXT', 'IMAGE', 'CONTACT', 'SYSTEM'].includes(body?.type) ? body.type : 'TEXT';
    const content = (body?.content || '').toString().trim() || (type === 'IMAGE' ? 'Shared a photo 📷' : '');

    if (!content && !body?.mediaUrl) {
      return NextResponse.json({ success: false, error: 'Empty message' }, { status: 400 });
    }

    const conv = await ensureConversation(session.id, receiverId);

    const message = await db.message.create({
      data: {
        matchId: resolved.matchId,
        conversationId: conv?.id,
        senderId: session.id,
        receiverId,
        content,
        type,
        status: 'SENT',
        mediaUrl: body?.mediaUrl || null,
        contactDetails: body?.contactDetails || undefined,
      },
    });

    if (conv) {
      await db.conversation.update({ where: { id: conv.id }, data: { lastMessageAt: new Date() } });
    }

    return NextResponse.json({ success: true, message: mapMessage(message) });
  } catch (error: any) {
    console.error('POST messages error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  const { matchId } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const resolved = await resolve(matchId, session.id);
    if (!resolved) return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });

    const body = await req.json();
    const messageId: string = body?.messageId;
    if (!messageId) return NextResponse.json({ success: false, error: 'Missing messageId' }, { status: 400 });

    const existing = await db.message.findUnique({ where: { id: messageId } });
    if (!existing || existing.matchId !== resolved.matchId || existing.senderId !== session.id) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    const data: Record<string, any> = {};
    if (typeof body?.content === 'string') data.content = body.content;
    if (body?.contactDetails !== undefined) data.contactDetails = body.contactDetails;
    if (body?.status !== undefined) data.status = body.status;

    const message = await db.message.update({ where: { id: messageId }, data });
    return NextResponse.json({ success: true, message: mapMessage(message) });
  } catch (error: any) {
    console.error('PATCH messages error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ matchId: string }> }) {
  const session = await getSession();
  const { matchId } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const resolved = await resolve(matchId, session.id);
    if (!resolved) return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 });

    const messageId = new URL(req.url).searchParams.get('messageId');
    if (!messageId) return NextResponse.json({ success: false, error: 'Missing messageId' }, { status: 400 });

    const existing = await db.message.findUnique({ where: { id: messageId } });
    if (!existing || existing.matchId !== resolved.matchId || existing.senderId !== session.id) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    await db.message.delete({ where: { id: messageId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE messages error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 });
  }
}
