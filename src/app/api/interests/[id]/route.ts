import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { mapInterest, mapMatch, USER_INCLUDE } from '@/lib/connection-server';

export const dynamic = 'force-dynamic';

const ALLOWED = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const { id } = await params;
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();
    const status: string = body?.status;
    if (!ALLOWED.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const existing = await db.interest.findUnique({ where: { id } });
    if (!existing || (existing.senderId !== session.id && existing.receiverId !== session.id)) {
      return NextResponse.json({ success: false, error: 'Interest not found' }, { status: 404 });
    }

    if (status === 'ACCEPTED' && existing.receiverId !== session.id) {
      return NextResponse.json({ success: false, error: 'Only the recipient can accept' }, { status: 403 });
    }

    const interest = await db.interest.update({
      where: { id },
      data: { status: status as any },
      include: { sender: { include: USER_INCLUDE }, receiver: { include: USER_INCLUDE } },
    });

    let match: any = null;
    if (status === 'ACCEPTED') {
      const [userAId, userBId] = [existing.senderId, existing.receiverId].sort();
      const saved = await db.match.upsert({
        where: { userAId_userBId: { userAId, userBId } },
        update: { status: 'ACTIVE' },
        create: { userAId, userBId, matchScore: 90, status: 'ACTIVE' },
        include: { userA: { include: USER_INCLUDE }, userB: { include: USER_INCLUDE } },
      });
      match = mapMatch(saved, session.id);

      const receiverName = interest.receiver?.fullName || 'A member';
      await db.notification.create({
        data: {
          ownerId: existing.senderId,
          title: 'Interest Accepted 🎉',
          body: `${receiverName} accepted your interest. You are now matched!`,
          type: 'MATCH',
          targetUrl: '/member/matches',
        },
      });
    }

    return NextResponse.json({ success: true, interest: mapInterest(interest, session.id), match });
  } catch (error: any) {
    console.error('PATCH /api/interests/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update interest' }, { status: 500 });
  }
}
