import { DIFFICULTIES } from '@/features/game/lib/difficulty';
import type { DifficultyId } from '@/features/game/types';
import {
  isPlainObject,
  readJson,
  readLegacyBestScore,
  STORAGE_KEYS,
} from '@/lib/storage';
import type { DifficultyRecords, RecordsState } from '../types';

export const RECORDS_VERSION = 1;

export interface RoundSummary {
  readonly difficulty: DifficultyId;
  readonly score: number;
  readonly accuracy: number;
  readonly elapsedSeconds: number;
  readonly pairsFound: number;
  readonly errors: number;
  readonly bestStreak: number;
  readonly won: boolean;
}

export interface RecordsUpdate {
  readonly records: RecordsState;
  readonly isNewBestScore: boolean;
  readonly isNewBestTime: boolean;
  readonly isNewBestAccuracy: boolean;
}

export function createEmptyDifficultyRecords(): DifficultyRecords {
  return {
    bestScore: 0,
    bestTimeInSeconds: null,
    bestAccuracy: null,
    gamesPlayed: 0,
    wins: 0,
    totalPairs: 0,
    totalErrors: 0,
    bestStreak: 0,
  };
}

export function createEmptyRecords(): RecordsState {
  return {
    version: RECORDS_VERSION,
    globalBestScore: 0,
    byDifficulty: {
      easy: createEmptyDifficultyRecords(),
      normal: createEmptyDifficultyRecords(),
      hard: createEmptyDifficultyRecords(),
    },
  };
}

function numberField(
  source: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const raw = source[key];

  return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? raw : fallback;
}

function nullableNumberField(
  source: Record<string, unknown>,
  key: string,
): number | null {
  const raw = source[key];

  return typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 ? raw : null;
}

export function normalizeDifficultyRecords(value: unknown): DifficultyRecords {
  if (!isPlainObject(value)) return createEmptyDifficultyRecords();

  return {
    bestScore: numberField(value, 'bestScore', 0),
    bestTimeInSeconds: nullableNumberField(value, 'bestTimeInSeconds'),
    bestAccuracy: nullableNumberField(value, 'bestAccuracy'),
    gamesPlayed: numberField(value, 'gamesPlayed', 0),
    wins: numberField(value, 'wins', 0),
    totalPairs: numberField(value, 'totalPairs', 0),
    totalErrors: numberField(value, 'totalErrors', 0),
    bestStreak: numberField(value, 'bestStreak', 0),
  };
}

export function readRecords(): RecordsState {
  const empty = createEmptyRecords();
  const legacyBestScore = readLegacyBestScore();
  const stored = readJson<unknown>(STORAGE_KEYS.records, null);

  if (!isPlainObject(stored)) {
    return { ...empty, globalBestScore: legacyBestScore };
  }

  const storedByDifficulty = isPlainObject(stored.byDifficulty)
    ? stored.byDifficulty
    : {};
  const byDifficulty = { ...empty.byDifficulty };

  for (const difficulty of DIFFICULTIES) {
    byDifficulty[difficulty.id] = normalizeDifficultyRecords(
      storedByDifficulty[difficulty.id],
    );
  }

  return {
    version: RECORDS_VERSION,
    globalBestScore: Math.max(numberField(stored, 'globalBestScore', 0), legacyBestScore),
    byDifficulty,
  };
}

export function applyRound(records: RecordsState, round: RoundSummary): RecordsUpdate {
  const current = records.byDifficulty[round.difficulty];
  const isNewBestScore = round.score > current.bestScore;
  const isNewBestTime =
    round.won &&
    (current.bestTimeInSeconds === null ||
      round.elapsedSeconds < current.bestTimeInSeconds);
  const isNewBestAccuracy = round.accuracy > (current.bestAccuracy ?? 0);

  const updated: DifficultyRecords = {
    ...current,
    bestScore: Math.max(current.bestScore, round.score),
    bestTimeInSeconds: isNewBestTime ? round.elapsedSeconds : current.bestTimeInSeconds,
    bestAccuracy: Math.max(current.bestAccuracy ?? 0, round.accuracy),
    gamesPlayed: current.gamesPlayed + 1,
    wins: current.wins + (round.won ? 1 : 0),
    totalPairs: current.totalPairs + round.pairsFound,
    totalErrors: current.totalErrors + round.errors,
    bestStreak: Math.max(current.bestStreak, round.bestStreak),
  };

  return {
    records: {
      ...records,
      globalBestScore: Math.max(records.globalBestScore, round.score),
      byDifficulty: {
        ...records.byDifficulty,
        [round.difficulty]: updated,
      },
    },
    isNewBestScore,
    isNewBestTime,
    isNewBestAccuracy,
  };
}
