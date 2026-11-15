import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDailySeed } from '@/lib/random';
import {
  getDailyChallenge,
  getSecondsUntilNextDaily,
} from '../lib/dailyChallenge';
import {
  applyDailyResult,
  getDailyScore,
  hasPlayedDaily,
  readDailyState,
  writeDailyState,
} from '../lib/dailyStore';
import type { DailyChallenge, DailyState } from '../types';

const COUNTDOWN_TICK_MS = 30_000;

export function useDailyChallenge() {
  const [state, setState] = useState<DailyState>(() => readDailyState());
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, COUNTDOWN_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    writeDailyState(state);
  }, [state]);

  const dateKey = getDailySeed(now);
  const challenge: DailyChallenge = useMemo(() => getDailyChallenge(now), [now]);

  const saveDailyResult = useCallback((score: number): void => {
    setState((current) => applyDailyResult(current, getDailySeed(), score).state);
  }, []);

  return {
    challenge,
    dateKey,
    hasPlayedToday: hasPlayedDaily(state, dateKey),
    todayScore: getDailyScore(state, dateKey),
    bestScore: state.bestScore,
    secondsUntilNext: getSecondsUntilNextDaily(now),
    saveDailyResult,
  };
}
