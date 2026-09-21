import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, unauthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const shortlists = await db.shortlist.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, shortlistedIds: shortlists.map((s) => s.targetProfileId) });
  } catch (error: any) {
    console.error('GET /api/shortlists error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load shortlist' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json();
    const profileId: string = body?.profileId;
    if (!profileId) return NextResponse.json({ success: false, error: 'Missing profileId' }, { status: 400 });

    const target = await db.user.findUnique({ where: { id: profileId } });
    if (!target) return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });

    await db.shortlist.upsert({
      where: { userId_targetProfileId: { userId: session.id, targetProfileId: profileId } },
      update: {},
      create: { userId: session.id, targetProfileId: profileId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/shortlists error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save shortlist' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) return unauthorized('Not logged in');

  try {
    const body = await req.json().catch(() => ({}));
    const profileId: string = body?.profileId || new URL(req.url).searchParams.get('profileId') || '';
    if (!profileId) return NextResponse.json({ success: false, error: 'Missing profileId' }, { status: 400 });

    await db.shortlist.deleteMany({ where: { userId: session.id, targetProfileId: profileId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/shortlists error:', error);
    return NextResponse.json({ success: false, error: 'Failed to remove shortlist' }, { status: 500 });
  }
}