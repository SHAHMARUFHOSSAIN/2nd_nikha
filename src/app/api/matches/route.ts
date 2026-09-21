import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';
import { mapMatch, USER_INCLUDE } from '@/lib/connection-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const matches = await db.match.findMany({
      where: { OR: [{ userAId: session.id }, { userBId: session.id }] },
      include: { userA: { include: USER_INCLUDE }, userB: { include: USER_INCLUDE } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, matches: matches.map((m) => mapMatch(m, session.id)) });
  } catch (error: any) {
    console.error('GET /api/matches error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load matches' }, { status: 500 });
  }
}
