import { describe, expect, it } from 'vitest';
import {
  REPOSITORY_POOL,
  isSameRepository,
} from '@/features/contributors/lib/repositories';
import {
  buildDailyChallenge,
  formatDailyCountdown,
  getDailyChallenge,
  getSecondsUntilNextDaily,
} from './dailyChallenge';

const DATE_KEYS = Array.from({ length: 60 }, (_, index) => {
  const month = String(Math.floor(index / 30) + 1).padStart(2, '0');
  const day = String((index % 30) + 1).padStart(2, '0');

  return `2026-${month}-${day}`;
});

describe('dailyChallenge', () => {
  it('builds the same challenge for the same date key', () => {
    expect(buildDailyChallenge('2026-01-01')).toEqual(buildDailyChallenge('2026-01-01'));
  });

  it('uses a stable seed, the daily difficulty and the date key', () => {
    const challenge = buildDailyChallenge('2026-01-01');

    expect(challenge.seed).toBe('github-memory:daily:2026-01-01');
    expect(challenge.difficulty).toBe('normal');
    expect(challenge.dateKey).toBe('2026-01-01');
  });

  it('picks the repository from the pool for every date', () => {
    for (const dateKey of DATE_KEYS) {
      const challenge = buildDailyChallenge(dateKey);

      expect(
        REPOSITORY_POOL.some((repository) =>
          isSameRepository(repository, challenge.repository),
        ),
      ).toBe(true);
    }
  });

  it('varies the repository across different dates', () => {
    const repositories = new Set(
      DATE_KEYS.map((dateKey) => buildDailyChallenge(dateKey).repository.name),
    );

    expect(repositories.size).toBeGreaterThan(1);
  });

  it('derives the challenge from the current date', () => {
    const challenge = getDailyChallenge(new Date('2026-03-05T10:00:00Z'));

    expect(challenge).toEqual(buildDailyChallenge('2026-03-05'));
  });

  it('computes the seconds until the next UTC midnight', () => {
    expect(getSecondsUntilNextDaily(new Date('2026-03-05T00:00:00Z'))).toBe(86400);
    expect(getSecondsUntilNextDaily(new Date('2026-03-05T12:30:15Z'))).toBe(41385);
    expect(getSecondsUntilNextDaily(new Date('2026-03-05T23:59:59Z'))).toBe(1);
  });

  it('never returns a negative countdown', () => {
    expect(getSecondsUntilNextDaily(new Date('2026-03-05T23:59:59.9Z'))).toBe(1);
  });

  it('formats the countdown', () => {
    expect(formatDailyCountdown(3661)).toBe('1 h 1 min');
    expect(formatDailyCountdown(125)).toBe('2 min 5 s');
    expect(formatDailyCountdown(42)).toBe('42 s');
    expect(formatDailyCountdown(0)).toBe('0 s');
    expect(formatDailyCountdown(-5)).toBe('0 s');
  });
});
