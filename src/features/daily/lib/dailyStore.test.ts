import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '@/lib/storage';
import {
  applyDailyResult,
  createEmptyDailyState,
  getDailyScore,
  hasPlayedDaily,
  readDailyState,
  writeDailyState,
} from './dailyStore';

describe('dailyStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts empty', () => {
    expect(readDailyState()).toEqual(createEmptyDailyState());
    expect(hasPlayedDaily(createEmptyDailyState(), '2026-01-01')).toBe(false);
    expect(getDailyScore(createEmptyDailyState(), '2026-01-01')).toBeNull();
  });

  it('records the first attempt of the day and flags a new best', () => {
    const { state, isNewBest } = applyDailyResult(
      createEmptyDailyState(),
      '2026-01-01',
      900,
    );

    expect(isNewBest).toBe(true);
    expect(hasPlayedDaily(state, '2026-01-01')).toBe(true);
    expect(getDailyScore(state, '2026-01-01')).toBe(900);
    expect(state.bestScore).toBe(900);
  });

  it('locks the day after the first attempt', () => {
    const first = applyDailyResult(createEmptyDailyState(), '2026-01-01', 900).state;
    const second = applyDailyResult(first, '2026-01-01', 1200);

    expect(second.isNewBest).toBe(false);
    expect(second.state).toBe(first);
    expect(getDailyScore(second.state, '2026-01-01')).toBe(900);
  });

  it('keeps the best score and history across days', () => {
    let state = createEmptyDailyState();
    state = applyDailyResult(state, '2026-01-01', 900).state;
    state = applyDailyResult(state, '2026-01-02', 1200).state;

    expect(state.bestScore).toBe(1200);
    expect(state.lastPlayedDateKey).toBe('2026-01-02');
    expect(getDailyScore(state, '2026-01-01')).toBe(900);
    expect(getDailyScore(state, '2026-01-02')).toBe(1200);
  });

  it('normalizes malformed stored state', () => {
    window.localStorage.setItem(
      STORAGE_KEYS.daily,
      JSON.stringify({
        version: 99,
        lastPlayedDateKey: 42,
        bestScore: -5,
        scores: {
          '2026-01-01': 900,
          '2026-01-02': 'nope',
          '': 5,
          '2026-01-03': -1,
        },
      }),
    );

    const state = readDailyState();

    expect(state.version).toBe(1);
    expect(state.lastPlayedDateKey).toBeNull();
    expect(state.bestScore).toBe(0);
    expect(state.scores).toEqual({ '2026-01-01': 900 });
  });

  it('resets corrupt storage', () => {
    window.localStorage.setItem(STORAGE_KEYS.daily, '{oops');

    expect(readDailyState()).toEqual(createEmptyDailyState());
  });

  it('persists and reloads the state', () => {
    const { state } = applyDailyResult(createEmptyDailyState(), '2026-01-01', 900);

    expect(writeDailyState(state)).toBe(true);
    expect(readDailyState()).toEqual(state);
  });
});
