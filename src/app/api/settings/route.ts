import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let inMemorySettings: Record<string, any> = {};

export async function GET() {
  return NextResponse.json(
    { success: true, settings: inMemorySettings },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.settings && typeof body.settings === 'object') {
      const results: Record<string, any> = {};
      for (const [catKey, catVal] of Object.entries(body.settings)) {
        if (!catKey || catVal === undefined) continue;
        inMemorySettings[catKey] = catVal;
        results[catKey] = catVal;
      }

      import('@/lib/db').then(({ db }) => {
        for (const [catKey, catVal] of Object.entries(body.settings)) {
          const stringifiedVal = JSON.stringify(catVal);
          db.setting.upsert({
            where: { key: catKey },
            update: { value: stringifiedVal },
            create: { key: catKey, value: stringifiedVal },
          }).catch(() => {});
        }
      }).catch(() => {});

      return NextResponse.json({ success: true, settings: results });
    }

    const { category, values } = body;
    if (!category || values === undefined) {
      return NextResponse.json({ success: false, error: 'Category and values required' }, { status: 400 });
    }

    inMemorySettings[category] = values;
    import('@/lib/db').then(({ db }) => {
      const stringifiedVal = JSON.stringify(values);
      db.setting.upsert({
        where: { key: category },
        update: { value: stringifiedVal },
        create: { key: category, value: stringifiedVal },
      }).catch(() => {});
    }).catch(() => {});

    return NextResponse.json({ success: true, category, data: values });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
