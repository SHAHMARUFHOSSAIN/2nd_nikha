import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const banners = await Promise.race([
      db.banner.findMany(),
      new Promise<any[]>((res) => setTimeout(() => res([]), 300)),
    ]).catch(() => []);
    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    console.warn('DB banners read warning:', error.message);
    return NextResponse.json({ success: false, banners: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, subtitle, imageUrl, targetUrl, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ success: false, error: 'Title and imageUrl required' }, { status: 400 });
    }

    let banner;
    if (id && !id.startsWith('banner-temp-')) {
      banner = await db.banner.upsert({
        where: { id },
        update: {
          title,
          subtitle: subtitle || '',
          imageUrl,
          targetUrl: targetUrl || '',
          isActive: isActive !== undefined ? isActive : true,
        },
        create: {
          id,
          title,
          subtitle: subtitle || '',
          imageUrl,
          targetUrl: targetUrl || '',
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    } else {
      banner = await db.banner.create({
        data: {
          title,
          subtitle: subtitle || '',
          imageUrl,
          targetUrl: targetUrl || '',
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    }

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error('Error saving banner to MySQL DB:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }
    await db.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
