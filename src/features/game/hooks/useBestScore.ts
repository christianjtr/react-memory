import { useCallback, useState } from 'react';
import { readNumber, writeNumber } from '@/lib/storage';

export const BEST_SCORE_STORAGE_KEY = 'github-memory:best-score';

function readBestScore(): number {
  const parsedValue = readNumber(BEST_SCORE_STORAGE_KEY);

  return parsedValue !== null && parsedValue > 0 ? parsedValue : 0;
}

export function useBestScore() {
  const [bestScore, setBestScore] = useState(readBestScore);

  const submitScore = useCallback((score: number): void => {
    if (!Number.isFinite(score) || score <= 0) return;

    setBestScore((currentBestScore) => {
      if (score <= currentBestScore) return currentBestScore;

      writeNumber(BEST_SCORE_STORAGE_KEY, score);
      return score;
    });
  }, []);

  return { bestScore, submitScore };
}
