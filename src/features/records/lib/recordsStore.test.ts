import { beforeEach, describe, expect, it } from 'vitest';
import { LEGACY_BEST_SCORE_KEY, STORAGE_KEYS } from '@/lib/storage';
import {
  applyRound,
  createEmptyRecords,
  normalizeDifficultyRecords,
  readRecords,
  type RoundSummary,
} from './recordsStore';

const round: RoundSummary = {
  difficulty: 'normal',
  score: 1200,
  accuracy: 80,
  elapsedSeconds: 42,
  pairsFound: 4,
  errors: 1,
  bestStreak: 3,
  won: true,
};

describe('recordsStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts empty', () => {
    const records = readRecords();

    expect(records.globalBestScore).toBe(0);
    expect(records.byDifficulty.normal.bestScore).toBe(0);
    expect(records.byDifficulty.normal.gamesPlayed).toBe(0);
  });

  it('migrates the legacy best score', () => {
    window.localStorage.setItem(LEGACY_BEST_SCORE_KEY, '700');

    expect(readRecords().globalBestScore).toBe(700);
  });

  it('restores persisted records', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.records,
      JSON.stringify({
        globalBestScore: 900,
        byDifficulty: {
          normal: { bestScore: 900, gamesPlayed: 3, bestTimeInSeconds: 30 },
        },
      }),
    );

    const records = readRecords();

    expect(records.globalBestScore).toBe(900);
    expect(records.byDifficulty.normal.bestScore).toBe(900);
    expect(records.byDifficulty.normal.gamesPlayed).toBe(3);
    expect(records.byDifficulty.normal.bestTimeInSeconds).toBe(30);
    expect(records.byDifficulty.easy.bestScore).toBe(0);
  });

  it('ignores corrupted records', () => {
    window.localStorage.setItem(STORAGE_KEYS.records, '{not json');

    expect(readRecords().globalBestScore).toBe(0);
  });

  it('normalizes unexpected values', () => {
    const normalized = normalizeDifficultyRecords({
      bestScore: 'nope',
      gamesPlayed: 4,
      bestTimeInSeconds: -10,
    });

    expect(normalized.bestScore).toBe(0);
    expect(normalized.gamesPlayed).toBe(4);
    expect(normalized.bestTimeInSeconds).toBeNull();
  });

  it('records a finished round', () => {
    const { records, isNewBestScore, isNewBestTime } = applyRound(
      createEmptyRecords(),
      round,
    );

    expect(records.globalBestScore).toBe(1200);
    expect(records.byDifficulty.normal.bestScore).toBe(1200);
    expect(records.byDifficulty.normal.gamesPlayed).toBe(1);
    expect(records.byDifficulty.normal.wins).toBe(1);
    expect(records.byDifficulty.normal.bestStreak).toBe(3);
    expect(records.byDifficulty.normal.bestAccuracy).toBe(80);
    expect(records.byDifficulty.normal.bestTimeInSeconds).toBe(42);
    expect(isNewBestScore).toBe(true);
    expect(isNewBestTime).toBe(true);
  });

  it('keeps the best score and the fastest time', () => {
    const first = applyRound(createEmptyRecords(), round).records;
    const second = applyRound(first, { ...round, score: 900, elapsedSeconds: 55 }).records;

    expect(second.byDifficulty.normal.bestScore).toBe(1200);
    expect(second.byDifficulty.normal.bestTimeInSeconds).toBe(42);
    expect(second.byDifficulty.normal.gamesPlayed).toBe(2);
    expect(second.globalBestScore).toBe(1200);
  });

  it('does not record a time for lost rounds', () => {
    const lost = applyRound(createEmptyRecords(), { ...round, won: false }).records;

    expect(lost.byDifficulty.normal.bestTimeInSeconds).toBeNull();
    expect(lost.byDifficulty.normal.wins).toBe(0);
  });
});
