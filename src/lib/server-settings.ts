import { db } from '@/lib/db';

/**
 * Server-side (SSR) settings loader used by the root layout so the very first
 * paint of the public site already shows the admin-saved hero data instead of
 * flashing the hardcoded dummy defaults after mount.
 *
 * Results are cached in memory for a short TTL to avoid a DB round-trip on
 * every request. If MySQL is unreachable we fall back to an empty object so
 * rendering never hangs or crashes.
 */

interface ServerSettingsCache {
  settings: Record<string, any>;
  fetchedAt: number;
}

let serverSettingsCache: ServerSettingsCache | null = null;
const CACHE_TTL_MS = 10_000;

const SETTINGS_META_KEY = '_settingsUpdatedAt';

async function readSettingsFromDb(): Promise<Record<string, any>> {
  const result: Record<string, any> = {};

  const recordsPromise = db.setting.findMany().catch(() => [] as any[]);
  const timeoutPromise = new Promise<any[] | null>((resolve) => setTimeout(() => resolve(null), 250));
  const records = await Promise.race([recordsPromise, timeoutPromise]);

  if (!records) return result;

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
}

export async function getServerSettings(): Promise<Record<string, any>> {
  // In development, always read fresh so admin saves appear without a stale flash.
  if (process.env.NODE_ENV !== 'development') {
    if (serverSettingsCache && Date.now() - serverSettingsCache.fetchedAt < CACHE_TTL_MS) {
      return serverSettingsCache.settings;
    }
  }
  const settings = await readSettingsFromDb();
  serverSettingsCache = { settings, fetchedAt: Date.now() };
  return settings;
}