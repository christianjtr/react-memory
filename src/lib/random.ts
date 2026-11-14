export interface RandomSource {
  next(): number;
  int(maxExclusive: number): number;
}

const UINT32_RANGE = 4294967296;

export function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function createSeededRandom(seed: number): RandomSource {
  let state = seed >>> 0;

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / UINT32_RANGE;
  };

  return {
    next,
    int: (maxExclusive: number): number => {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) return 0;
      return Math.floor(next() * maxExclusive);
    },
  };
}

export function createSeededRandomFromString(seed: string): RandomSource {
  return createSeededRandom(hashString(seed));
}

export function formatDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDailySeed(date: Date = new Date()): string {
  return formatDateKey(date);
}
