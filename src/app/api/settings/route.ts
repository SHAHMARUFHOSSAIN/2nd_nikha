import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession, isAdmin, unauthorized } from '@/lib/auth';
import { maskSettingsSecrets, mergePreservingSecrets } from '@/lib/settings-secrets';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTINGS_META_KEY = '_settingsUpdatedAt';

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

/**
 * The database is the single source of truth for platform settings. We never
 * fall back to a disk file or a session-scoped in-memory copy — doing so caused
 * different users to see different values and made saves silently "succeed"
 * while only living in the browser.
 */
async function readSettingsFromDb(): Promise<Record<string, any>> {
  const records = await db.setting.findMany();
  const result: Record<string, any> = {};
  for (const rec of records) {
    try {
      const value = JSON.parse(rec.value);
      if (rec.key === SETTINGS_META_KEY) {
        result[SETTINGS_META_KEY] =
          typeof value === 'number' ? value : parseInt(value, 10) || 0;
      } else {
        result[rec.key] = value;
      }
    } catch {
      result[rec.key] = rec.value;
    }
  }
  return result;
}

export async function GET() {
  try {
    const settings = await readSettingsFromDb();
    return NextResponse.json(
      { success: true, settings: maskSettingsSecrets(settings) },
      { headers: noStoreHeaders }
    );
  } catch (error: any) {
    console.error('GET /api/settings failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load settings from database' },
      { status: 503, headers: noStoreHeaders }
    );
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || !isAdmin(session)) {
    return unauthorized('Admin access required');
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const now = Date.now();

  // Normalise both supported payload shapes into { category: values }.
  const updates: Record<string, any> = {};
  if (body?.settings && typeof body.settings === 'object') {
    for (const [catKey, catVal] of Object.entries(body.settings)) {
      if (!catKey || catKey === SETTINGS_META_KEY || catVal === undefined) continue;
      updates[catKey] = catVal;
    }
  } else if (body?.category && body?.values !== undefined) {
    if (body.category === SETTINGS_META_KEY) {
      return NextResponse.json({ success: false, error: 'Reserved settings key' }, { status: 400 });
    }
    updates[body.category] = body.values;
  } else {
    return NextResponse.json(
      { success: false, error: 'Category and values (or settings object) required' },
      { status: 400 }
    );
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: 'No settings provided' }, { status: 400 });
  }

  try {
    const existing = await readSettingsFromDb();

    await db.$transaction(async (tx) => {
      for (const [catKey, catVal] of Object.entries(updates)) {
        const prev = existing[catKey];
        const merged = mergePreservingSecrets(
          catVal && typeof catVal === 'object' ? catVal : { value: catVal },
          prev && typeof prev === 'object' ? prev : {}
        );
        const stringified = JSON.stringify(merged);
        await tx.setting.upsert({
          where: { key: catKey },
          update: { value: stringified },
          create: { key: catKey, value: stringified },
        });
      }
      await tx.setting.upsert({
        where: { key: SETTINGS_META_KEY },
        update: { value: JSON.stringify(now) },
        create: { key: SETTINGS_META_KEY, value: JSON.stringify(now) },
      });
    });

    const saved = await readSettingsFromDb();
    return NextResponse.json({
      success: true,
      settings: maskSettingsSecrets(saved),
      updatedAt: now,
    });
  } catch (error: any) {
    console.error('POST /api/settings failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings to database' },
      { status: 500 }
    );
  }
}
