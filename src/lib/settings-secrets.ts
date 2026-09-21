/**
 * Helpers for keeping gateway / SMTP secrets out of the browser.
 *
 * Settings are stored as category objects (e.g. `payment`, `general`) in the
 * `settings` table. Some of those fields are secrets that must NEVER be sent to
 * the client. We mask them on read and preserve the stored value on write when
 * the client sends an empty/masked value back.
 */

export const SENSITIVE_SETTING_KEYS = [
  'sslCommerzStorePassword',
  'paystationSecretKey',
  'paystationApiKey',
  'paystationSecret',
  'smtpPassword',
  'smsApiKey',
  'smsApiSecret',
  'firebaseServerKey',
  'bkashAppSecret',
  'nagadPrivateKey',
];

const SENSITIVE = new Set(SENSITIVE_SETTING_KEYS);

export function isSensitiveSettingKey(key: string): boolean {
  return SENSITIVE.has(key);
}

/** Returns true when the value is empty or looks like a redaction placeholder. */
export function isMaskedOrEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return (
    trimmed === '' ||
    trimmed === '__UNCHANGED__' ||
    /^[•*]+$/.test(trimmed)
  );
}

/** Deep-copies settings, replacing secret values with an empty string. */
export function maskSettingsSecrets<T = Record<string, any>>(settings: T): T {
  if (!settings || typeof settings !== 'object') return settings;
  const out: any = Array.isArray(settings) ? [...(settings as any)] : { ...(settings as any) };
  for (const [key, value] of Object.entries(out)) {
    if (isSensitiveSettingKey(key)) {
      out[key] = '';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      out[key] = maskSettingsSecrets(value);
    }
  }
  return out as T;
}

/**
 * Merges incoming settings over existing ones, but keeps the existing value for
 * sensitive keys when the incoming value is empty/masked. This lets the admin
 * UI submit a form without re-typing secrets while never round-tripping them.
 */
export function mergePreservingSecrets(
  incoming: Record<string, any>,
  existing: Record<string, any>
): Record<string, any> {
  const out: Record<string, any> = { ...(existing || {}) };
  for (const [key, value] of Object.entries(incoming || {})) {
    if (isSensitiveSettingKey(key)) {
      if (isMaskedOrEmpty(value)) continue;
      out[key] = value;
      continue;
    }
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const prev = existing && typeof existing[key] === 'object' ? existing[key] : {};
      out[key] = mergePreservingSecrets(value, prev);
    } else {
      out[key] = value;
    }
  }
  return out;
}
