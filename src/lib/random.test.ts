import { describe, expect, it } from 'vitest';
import {
  createSeededRandom,
  createSeededRandomFromString,
  formatDateKey,
  getDailySeed,
  hashString,
} from './random';

describe('random', () => {
  it('hashes strings deterministically', () => {
    expect(hashString('github-memory')).toBe(hashString('github-memory'));
    expect(hashString('github-memory')).not.toBe(hashString('github-memori'));
    expect(hashString('')).toBe(2166136261);
  });

  it('produces the same sequence for the same seed', () => {
    const first = createSeededRandom(42);
    const second = createSeededRandom(42);

    const firstSequence = [first.next(), first.next(), first.next()];
    const secondSequence = [second.next(), second.next(), second.next()];

    expect(firstSequence).toEqual(secondSequence);
  });

  it('produces different sequences for different seeds', () => {
    const first = createSeededRandom(1);
    const second = createSeededRandom(2);

    expect(first.next()).not.toBe(second.next());
  });

  it('keeps generated values inside the unit interval', () => {
    const random = createSeededRandomFromString('seed');

    for (let index = 0; index < 50; index += 1) {
      const value = random.next();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('generates integers inside the exclusive range', () => {
    const random = createSeededRandomFromString('seed');

    for (let index = 0; index < 50; index += 1) {
      const value = random.int(8);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(8);
    }
  });

  it('returns zero for invalid integer ranges', () => {
    const random = createSeededRandom(7);

    expect(random.int(0)).toBe(0);
    expect(random.int(-3)).toBe(0);
    expect(random.int(2.5)).toBe(0);
  });

  it('formats dates as UTC keys', () => {
    expect(formatDateKey(new Date('2026-11-14T00:00:00.000Z'))).toBe('2026-11-14');
    expect(formatDateKey(new Date('2026-01-05T23:59:59.000Z'))).toBe('2026-01-05');
  });

  it('exposes the daily seed for a given date', () => {
    expect(getDailySeed(new Date('2026-11-14T12:30:00.000Z'))).toBe('2026-11-14');
  });
});
