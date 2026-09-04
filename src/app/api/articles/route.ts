import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const articles = await Promise.race([
      db.article.findMany({
        orderBy: { publishedAt: 'desc' },
      }),
      new Promise<any[]>((res) => setTimeout(() => res([]), 300)),
    ]).catch(() => []);
    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.warn('DB articles read warning:', error.message);
    return NextResponse.json({ success: false, articles: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, slug, content, excerpt, coverImage, category, author, isPublished } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let article;
    if (id && !id.startsWith('art-temp-')) {
      article = await db.article.upsert({
        where: { id },
        update: {
          title,
          slug: generatedSlug,
          content: content || '',
          excerpt: excerpt || '',
          coverImage: coverImage || '',
          category: category || 'Marriage Advice',
          author: author || 'Editorial Team',
          isPublished: isPublished !== undefined ? isPublished : true,
        },
        create: {
          id,
          title,
          slug: generatedSlug,
          content: content || '',
          excerpt: excerpt || '',
          coverImage: coverImage || '',
          category: category || 'Marriage Advice',
          author: author || 'Editorial Team',
          isPublished: isPublished !== undefined ? isPublished : true,
        },
      });
    } else {
      article = await db.article.create({
        data: {
          title,
          slug: generatedSlug,
          content: content || '',
          excerpt: excerpt || '',
          coverImage: coverImage || '',
          category: category || 'Marriage Advice',
          author: author || 'Editorial Team',
          isPublished: isPublished !== undefined ? isPublished : true,
        },
      });
    }

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error('Error saving article to MySQL DB:', error);
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
    await db.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
