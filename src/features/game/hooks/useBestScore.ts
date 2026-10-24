import { useCallback, useState } from 'react';

export const BEST_SCORE_STORAGE_KEY = 'github-memory:best-score';

function readBestScore(): number {
  try {
    const storedValue = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);
    const parsedValue = Number(storedValue);

    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
  } catch {
    return 0;
  }
}

function persistBestScore(score: number): void {
  try {
    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(score));
  } catch {
    return;
  }
}

export function useBestScore() {
  const [bestScore, setBestScore] = useState(readBestScore);

  const submitScore = useCallback((score: number): void => {
    if (!Number.isFinite(score) || score <= 0) return;

    setBestScore((currentBestScore) => {
      if (score <= currentBestScore) return currentBestScore;

      persistBestScore(score);
      return score;
    });
  }, []);

  return { bestScore, submitScore };
}
