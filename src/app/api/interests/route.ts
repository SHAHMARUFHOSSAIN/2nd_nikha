import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { mapInterest, USER_INCLUDE } from '@/lib/connection-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const interests = await db.interest.findMany({
      where: { OR: [{ senderId: session.id }, { receiverId: session.id }] },
      include: { sender: { include: USER_INCLUDE }, receiver: { include: USER_INCLUDE } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, interests: interests.map((i) => mapInterest(i, session.id)) });
  } catch (error: any) {
    console.error('GET /api/interests error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load interests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();
    const receiverId: string = body?.receiverId;
    if (!receiverId || receiverId === session.id) {
      return NextResponse.json({ success: false, error: 'Invalid recipient' }, { status: 400 });
    }

    const receiver = await db.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return NextResponse.json({ success: false, error: 'Recipient not found' }, { status: 404 });
    }

    const existing = await db.interest.findUnique({
      where: { senderId_receiverId: { senderId: session.id, receiverId } },
    });

    const interest = existing
      ? await db.interest.update({
          where: { id: existing.id },
          data: { status: 'PENDING', message: body?.message || existing.message },
          include: { sender: { include: USER_INCLUDE }, receiver: { include: USER_INCLUDE } },
        })
      : await db.interest.create({
          data: {
            senderId: session.id,
            receiverId,
            status: 'PENDING',
            message: body?.message || null,
          },
          include: { sender: { include: USER_INCLUDE }, receiver: { include: USER_INCLUDE } },
        });

    if (!existing) {
      const senderName = interest.sender?.fullName || 'A member';
      await db.notification.create({
        data: {
          ownerId: receiverId,
          title: 'New Interest Received ❤️',
          body: `${senderName} expressed interest in your profile.`,
          type: 'INTEREST',
          targetUrl: '/member/interests',
        },
      });
    }

    return NextResponse.json({ success: true, interest: mapInterest(interest, session.id) });
  } catch (error: any) {
    console.error('POST /api/interests error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send interest' }, { status: 500 });
  }
}
