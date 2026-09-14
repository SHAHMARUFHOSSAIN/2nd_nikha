import { NextResponse } from 'next/server';
import { db, safeQuery } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SETTINGS_META_KEY = '_settingsUpdatedAt';
const DATA_DIR = path.join(process.cwd(), '.data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {}
}

function readDiskSettings(): Record<string, any> {
  try {
    ensureDataDir();
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {}
  return {};
}

function writeDiskSettings(data: Record<string, any>) {
  try {
    ensureDataDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

// Session-scoped in-memory store initialized with disk data
let inMemorySettings: Record<string, any> = readDiskSettings();

function savedAtOf(value: unknown): number {
  if (value && typeof value === 'object' && typeof (value as any)[SETTINGS_META_KEY] === 'number') {
    return (value as any)[SETTINGS_META_KEY] as number;
  }
  return 0;
}

function mergeSettingsByFreshness(local: Record<string, any>, remote: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = { ...(local || {}) };
  const localTs = savedAtOf(local);
  const remoteTs = savedAtOf(remote);

  if (remoteTs > localTs) {
    for (const [key, value] of Object.entries(local || {})) {
      if (key === SETTINGS_META_KEY) continue;
      if (remote[key] === undefined && value !== undefined) out[key] = value;
    }
    return { ...remote };
  }

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
  const diskSettings = readDiskSettings();
  const dbSettings = await readSettingsFromDb();
  const mergedSettings = mergeSettingsByFreshness(
    mergeSettingsByFreshness(inMemorySettings, diskSettings),
    dbSettings
  );

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
      writeDiskSettings(inMemorySettings);
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
    writeDiskSettings(inMemorySettings);
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