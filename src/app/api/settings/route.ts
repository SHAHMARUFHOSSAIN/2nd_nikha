import { NextResponse } from 'next/server';
import { db, safeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

let inMemorySettings: Record<string, any> = {};

export async function GET() {
  try {
    const dbSettings = await safeQuery(async () => {
      const records = await db.setting.findMany();
      const result: Record<string, any> = {};
      for (const rec of records) {
        try {
          result[rec.key] = JSON.parse(rec.value);
        } catch {
          result[rec.key] = rec.value;
        }
      }
      return result;
    }, {}, 3000);

    const mergedSettings = { ...inMemorySettings, ...dbSettings };

    return NextResponse.json(
      { success: true, settings: mergedSettings },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ success: true, settings: inMemorySettings });
  }
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
        try {
          const stringifiedVal = JSON.stringify(catVal);
          await db.setting.upsert({
            where: { key: catKey },
            update: { value: stringifiedVal },
            create: { key: catKey, value: stringifiedVal },
          });
        } catch (e) {
          console.error(`Failed to upsert setting key ${catKey} in DB:`, e);
        }
      }
      return NextResponse.json({ success: true, settings: results });
    }

    const { category, values } = body;
    if (!category || values === undefined) {
      return NextResponse.json({ success: false, error: 'Category and values required' }, { status: 400 });
    }

    inMemorySettings[category] = values;
    try {
      const stringifiedVal = JSON.stringify(values);
      await db.setting.upsert({
        where: { key: category },
        update: { value: stringifiedVal },
        create: { key: category, value: stringifiedVal },
      });
    } catch (e) {
      console.error(`Failed to upsert category ${category} in DB:`, e);
    }

    return NextResponse.json({ success: true, category, data: values });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
