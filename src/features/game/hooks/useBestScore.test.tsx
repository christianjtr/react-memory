import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BEST_SCORE_STORAGE_KEY, useBestScore } from './useBestScore';

describe('useBestScore', () => {
  it('loads the stored record and only persists a higher score', () => {
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, '250');

    const { result, unmount } = renderHook(() => useBestScore());

    expect(result.current.bestScore).toBe(250);

    act(() => {
      result.current.submitScore(200);
    });

    expect(result.current.bestScore).toBe(250);

    act(() => {
      result.current.submitScore(400);
    });

    expect(result.current.bestScore).toBe(400);
    expect(window.localStorage.getItem(BEST_SCORE_STORAGE_KEY)).toBe('400');
    unmount();

    const nextSession = renderHook(() => useBestScore());
    expect(nextSession.result.current.bestScore).toBe(400);
  });

  it('ignores zero, negative, and non-finite scores', () => {
    const { result } = renderHook(() => useBestScore());

    act(() => {
      result.current.submitScore(0);
      result.current.submitScore(-10);
      result.current.submitScore(Number.NaN);
    });

    expect(result.current.bestScore).toBe(0);
    expect(window.localStorage.getItem(BEST_SCORE_STORAGE_KEY)).toBeNull();
  });
});
