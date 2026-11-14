export const STORAGE_NAMESPACE = 'github-memory';
export const STORAGE_VERSION = 'v2';

export const STORAGE_KEYS = {
  player: `${STORAGE_NAMESPACE}:${STORAGE_VERSION}:player`,
  records: `${STORAGE_NAMESPACE}:${STORAGE_VERSION}:records`,
  daily: `${STORAGE_NAMESPACE}:${STORAGE_VERSION}:daily`,
} as const;

export const LEGACY_BEST_SCORE_KEY = `${STORAGE_NAMESPACE}:best-score`;

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function removeStoredItem(key: string): void {
  const storage = getStorage();
  if (storage === null) return;

  try {
    storage.removeItem(key);
  } catch {
    return;
  }
}

export function readJson<T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T,
): T {
  const storage = getStorage();
  if (storage === null) return fallback;

  let raw: string | null;
  try {
    raw = storage.getItem(key);
  } catch {
    return fallback;
  }

  if (raw === null) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    removeStoredItem(key);
    return fallback;
  }

  if (isValid !== undefined && !isValid(parsed)) {
    removeStoredItem(key);
    return fallback;
  }

  return parsed as T;
}

export function writeJson(key: string, value: unknown): boolean {
  const storage = getStorage();
  if (storage === null) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readString(key: string): string | null {
  const storage = getStorage();
  if (storage === null) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function readNumber(key: string): number | null {
  const raw = readString(key);
  if (raw === null) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function writeNumber(key: string, value: number): boolean {
  if (!Number.isFinite(value)) return false;

  const storage = getStorage();
  if (storage === null) return false;

  try {
    storage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

export function readLegacyBestScore(): number {
  const parsed = readNumber(LEGACY_BEST_SCORE_KEY);
  return parsed !== null && parsed > 0 ? parsed : 0;
}

export function clearLegacyBestScore(): void {
  removeStoredItem(LEGACY_BEST_SCORE_KEY);
}
