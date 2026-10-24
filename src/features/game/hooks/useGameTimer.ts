import { useEffect } from 'react';
import { GAME_ACTION_TYPES } from '../context/gameActions';
import { useGameDispatch } from './useGameContext';

export function useGameTimer(isRunning: boolean): void {
  const dispatch = useGameDispatch();

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      dispatch({ type: GAME_ACTION_TYPES.TICK });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch, isRunning]);
}
