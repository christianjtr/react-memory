import { isPlainObject, readJson, STORAGE_KEYS, writeJson } from '@/lib/storage';
import type { DailyState } from '../types';

export const DAILY_VERSION = 1;

export function createEmptyDailyState(): DailyState {
  return {
    version: DAILY_VERSION,
    lastPlayedDateKey: null,
    bestScore: 0,
    scores: {},
  };
}

function sanitizeScores(value: unknown): Record<string, number> {
  if (!isPlainObject(value)) return {};

  const scores: Record<string, number> = {};

  for (const [key, raw] of Object.entries(value)) {
    if (key.length === 0) continue;

    if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0) {
      scores[key] = raw;
    }
  }

  return scores;
}

export function readDailyState(): DailyState {
  const stored = readJson<unknown>(STORAGE_KEYS.daily, null);

  if (!isPlainObject(stored)) return createEmptyDailyState();

  return {
    version: DAILY_VERSION,
    lastPlayedDateKey:
      typeof stored.lastPlayedDateKey === 'string' && stored.lastPlayedDateKey.length > 0
        ? stored.lastPlayedDateKey
        : null,
    bestScore:
      typeof stored.bestScore === 'number' &&
      Number.isFinite(stored.bestScore) &&
      stored.bestScore >= 0
        ? stored.bestScore
        : 0,
    scores: sanitizeScores(stored.scores),
  };
}

export function writeDailyState(state: DailyState): boolean {
  return writeJson(STORAGE_KEYS.daily, state);
}

export function hasPlayedDaily(state: DailyState, dateKey: string): boolean {
  return state.lastPlayedDateKey === dateKey;
}

export function getDailyScore(state: DailyState, dateKey: string): number | null {
  const score = state.scores[dateKey];

  return typeof score === 'number' ? score : null;
}

export interface DailyResultUpdate {
  readonly state: DailyState;
  readonly isNewBest: boolean;
}

export function applyDailyResult(
  state: DailyState,
  dateKey: string,
  score: number,
): DailyResultUpdate {
  if (hasPlayedDaily(state, dateKey)) {
    return { state, isNewBest: false };
  }

  const isNewBest = score > state.bestScore;

  return {
    state: {
      version: DAILY_VERSION,
      lastPlayedDateKey: dateKey,
      bestScore: Math.max(state.bestScore, score),
      scores: { ...state.scores, [dateKey]: score },
    },
    isNewBest,
  };
}
