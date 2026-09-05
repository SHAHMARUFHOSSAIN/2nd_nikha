import { NextResponse } from 'next/server';
import { db, safeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTINGS_META_KEY = '_settingsUpdatedAt';

// Session-scoped in-memory store. It carries the most recent writes of the
// current server process and guarantees saves work even when MySQL is down.
let inMemorySettings: Record<string, any> = {};

function savedAtOf(value: unknown): number {
  if (value && typeof value === 'object' && typeof (value as any)[SETTINGS_META_KEY] === 'number') {
    return (value as any)[SETTINGS_META_KEY] as number;
  }
  return 0;
}

/**
 * Merge two settings objects preferring whichever was updated more recently.
 * Keys missing from the preferred source are filled from the other source.
 */
function mergeSettingsByFreshness(local: Record<string, any>, remote: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...(local || {}) };
  const localTs = savedAtOf(local);
  const remoteTs = savedAtOf(remote);

  if (remoteTs > localTs) {
    // Remote is newer: remote wins, local fills gaps.
    for (const [key, value] of Object.entries(local || {})) {
      if (key === SETTINGS_META_KEY) continue;
      if (remote[key] === undefined && value !== undefined) out[key] = value;
    }
    return { ...remote };
  }

  // Local/session is newer (or tied): local wins, remote fills gaps.
  for (const [key, value] of Object.entries(remote || {})) {
    if (key === SETTINGS_META_KEY) continue;
    if (out[key] === undefined && value !== undefined) out[key] = value;
  }
  return out;
}

async function readSettingsFromDb(): Promise<Record<string, any>> {
  return safeQuery(
    async () => {
      const records = await db.setting.findMany();
      const result: Record<string, any> = {};
      for (const rec of records) {
        try {
          const value = JSON.parse(rec.value);
          if (rec.key === SETTINGS_META_KEY) {
            result[SETTINGS_META_KEY] = typeof value === 'number' ? value : parseInt(value, 10) || 0;
          } else {
            result[rec.key] = value;
          }
        } catch {
          result[rec.key] = rec.value;
        }
      }
      return result;
    },
    {},
    3000
  );
}

export async function GET() {
  const dbSettings = await readSettingsFromDb();
  const mergedSettings = mergeSettingsByFreshness(inMemorySettings, dbSettings);

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
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const now = Date.now();

    const persistCategory = async (catKey: string, catVal: any) => {
      const stringifiedVal = JSON.stringify(catVal);
      await db.setting.upsert({
        where: { key: catKey },
        update: { value: stringifiedVal },
        create: { key: catKey, value: stringifiedVal },
      });
    };

    if (body.settings && typeof body.settings === 'object') {
      const results: Record<string, any> = {};
      for (const [catKey, catVal] of Object.entries(body.settings)) {
        if (!catKey || catVal === undefined || catKey === SETTINGS_META_KEY) continue;
        inMemorySettings[catKey] = catVal;
        results[catKey] = catVal;
        try {
          await persistCategory(catKey, catVal);
        } catch (e) {
          console.error(`Failed to upsert setting key ${catKey} in DB:`, e);
        }
      }
      inMemorySettings[SETTINGS_META_KEY] = now;
      try {
        await persistCategory(SETTINGS_META_KEY, now);
      } catch (e) {
        console.error('Failed to persist settings updated-at marker in DB:', e);
      }
      return NextResponse.json({ success: true, settings: results, updatedAt: now });
    }

    const { category, values } = body;
    if (!category || values === undefined) {
      return NextResponse.json({ success: false, error: 'Category and values required' }, { status: 400 });
    }

    inMemorySettings[category] = values;
    inMemorySettings[SETTINGS_META_KEY] = now;
    try {
      await persistCategory(category, values);
      await persistCategory(SETTINGS_META_KEY, now);
    } catch (e) {
      console.error(`Failed to upsert category ${category} in DB:`, e);
    }

    return NextResponse.json({ success: true, category, data: values });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}