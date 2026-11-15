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

const wonResult = {
  score: 900,
  elapsedSeconds: 30,
  won: true,
};

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
    const { state, isNewBest, isNewBestTime } = applyDailyResult(
      createEmptyDailyState(),
      '2026-01-01',
      wonResult,
    );

    expect(isNewBest).toBe(true);
    expect(isNewBestTime).toBe(true);
    expect(hasPlayedDaily(state, '2026-01-01')).toBe(true);
    expect(getDailyScore(state, '2026-01-01')).toBe(900);
    expect(state.bestScore).toBe(900);
    expect(state.bestTimeInSeconds).toBe(30);
  });

  it('locks the day after the first attempt', () => {
    const first = applyDailyResult(
      createEmptyDailyState(),
      '2026-01-01',
      wonResult,
    ).state;
    const second = applyDailyResult(first, '2026-01-01', {
      score: 1200,
      elapsedSeconds: 20,
      won: true,
    });

    expect(second.isNewBest).toBe(false);
    expect(second.isNewBestTime).toBe(false);
    expect(second.state).toBe(first);
    expect(getDailyScore(second.state, '2026-01-01')).toBe(900);
  });

  it('keeps the best time only for won rounds', () => {
    let state = createEmptyDailyState();
    state = applyDailyResult(state, '2026-01-01', wonResult).state;
    state = applyDailyResult(state, '2026-01-02', {
      score: 300,
      elapsedSeconds: 60,
      won: false,
    }).state;

    expect(state.bestTimeInSeconds).toBe(30);
    expect(getDailyScore(state, '2026-01-02')).toBe(300);
  });

  it('keeps the best score and history across days', () => {
    let state = createEmptyDailyState();
    state = applyDailyResult(state, '2026-01-01', wonResult).state;
    state = applyDailyResult(state, '2026-01-02', {
      score: 1200,
      elapsedSeconds: 25,
      won: true,
    }).state;

    expect(state.bestScore).toBe(1200);
    expect(state.bestTimeInSeconds).toBe(25);
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
        bestTimeInSeconds: -1,
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
    expect(state.bestTimeInSeconds).toBeNull();
    expect(state.scores).toEqual({ '2026-01-01': 900 });
  });

  it('resets corrupt storage', () => {
    window.localStorage.setItem(STORAGE_KEYS.daily, '{oops');

    expect(readDailyState()).toEqual(createEmptyDailyState());
  });

  it('persists and reloads the state', () => {
    const { state } = applyDailyResult(createEmptyDailyState(), '2026-01-01', wonResult);

    expect(writeDailyState(state)).toBe(true);
    expect(readDailyState()).toEqual(state);
  });
});
