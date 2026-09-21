import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const VISIT_INCLUDE = {
  visitor: {
    include: {
      profile: true,
    },
  },
} as const;

function mapVisitor(v: any) {
  const profile = v.visitor?.profile || {};
  const additionalPhotos = Array.isArray(profile.additionalPhotos) ? profile.additionalPhotos : [];
  const photoUrl = profile.photoUrl || additionalPhotos[0] || '';
  return {
    id: v.id,
    visitorId: v.visitorId,
    visitedUserId: v.visitedUserId,
    visitedAt: v.createdAt?.toISOString?.() || new Date().toISOString(),
    profile: {
      id: v.visitorId,
      fullName: v.visitor?.fullName || 'Anonymous Member',
      age: profile.age,
      gender: profile.gender,
      location: profile.location,
      city: profile.location,
      religion: profile.religion,
      profession: profile.profession,
      photoUrl,
      photos: photoUrl ? [photoUrl] : [],
    },
  };
}

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const url = new URL(req.url);
    const onlyNew = url.searchParams.get('new') === 'true';
    const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 100);

    const visits = await db.profileVisit.findMany({
      where: { visitedUserId: session.id },
      include: VISIT_INCLUDE,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Newness: first time this visitor ever appeared (their earliest stored visit)
    const firstVisitPerVisitor = new Map<string, string>();
    const all = await db.profileVisit.findMany({
      where: { visitedUserId: session.id },
      select: { visitorId: true, id: true },
      orderBy: { createdAt: 'asc' },
    });
    for (const r of all) {
      if (!firstVisitPerVisitor.has(r.visitorId)) firstVisitPerVisitor.set(r.visitorId, r.id);
    }

    const items = visits.map((v: any) => {
      const isNew = firstVisitPerVisitor.get(v.visitorId) === v.id;
      return { ...mapVisitor(v), isNew };
    });

    const result = onlyNew ? items.filter((i) => i.isNew) : items;
    return NextResponse.json({ success: true, visitors: result });
  } catch (error: any) {
    console.error('GET /api/visits error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load profile visitors' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();
    const targetUserId: string = body?.profileId || body?.targetUserId || '';
    if (!targetUserId) {
      return NextResponse.json({ success: false, error: 'profileId required' }, { status: 400 });
    }
    if (targetUserId === session.id) {
      return NextResponse.json({ success: true, ignored: 'self_visit' });
    }

    const target = await db.user.findUnique({ where: { id: targetUserId } });
    if (!target) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    // Respect blocks both ways: do not record a visit if either side blocked the other.
    const existingBlock = await db.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: session.id, blockedId: targetUserId },
          { blockerId: targetUserId, blockedId: session.id },
        ],
      },
    });
    if (!existingBlock) {
      await db.profileVisit.create({
        data: { visitorId: session.id, visitedUserId: targetUserId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/visits error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record visit' }, { status: 500 });
  }
}
