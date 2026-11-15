import { REPOSITORY_POOL } from '@/features/contributors/lib/repositories';
import { getDifficulty, type DifficultyId } from '@/features/game/lib/difficulty';
import {
  createSeededRandomFromString,
  getDailySeed,
} from '@/lib/random';
import type { DailyChallenge } from '../types';

export const DAILY_DIFFICULTY: DifficultyId = 'normal';

const DAILY_SEED_PREFIX = 'github-memory:daily';

export function buildDailyChallenge(dateKey: string): DailyChallenge {
  const seed = `${DAILY_SEED_PREFIX}:${dateKey}`;
  const random = createSeededRandomFromString(seed);
  const repository = REPOSITORY_POOL[random.int(REPOSITORY_POOL.length)]!;

  return {
    dateKey,
    seed,
    repository,
    difficulty: DAILY_DIFFICULTY,
  };
}

export function getDailyChallenge(date: Date = new Date()): DailyChallenge {
  return buildDailyChallenge(getDailySeed(date));
}

export function getSecondsUntilNextDaily(date: Date = new Date()): number {
  const nextMidnight = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate() + 1,
  );

  return Math.max(0, Math.ceil((nextMidnight - date.getTime()) / 1000));
}

export function formatDailyCountdown(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) return `${hours} h ${minutes} min`;
  if (minutes > 0) return `${minutes} min ${seconds} s`;

  return `${seconds} s`;
}

export function getDailyDifficultyLabel(): string {
  return getDifficulty(DAILY_DIFFICULTY).label;
}
