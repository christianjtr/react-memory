import { useCallback, useEffect } from 'react';
import type { Contributor } from '@/features/contributors/types';
import { GAME_ACTION_TYPES } from '../context/gameActions';
import { resolveGameConfig } from '../context/gameState';
import { buildDeck } from '../lib/deck';
import type { GameConfig } from '../types';
import { useGameDispatch, useGameState } from './useGameContext';
import { useGameTimer } from './useGameTimer';

export function useGame() {
  const state = useGameState();
  const dispatch = useGameDispatch();

  useGameTimer(state.status === 'playing');

  useEffect(() => {
    if (state.pendingResolution !== 'mismatch') return;

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: GAME_ACTION_TYPES.FACE_DOWN_CARDS });
    }, state.config.timeUntilFaceDownCardsInSeconds * 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, state.config.timeUntilFaceDownCardsInSeconds, state.pendingResolution]);

  const selectCard = useCallback(
    (cardId: number): void => {
      dispatch({ type: GAME_ACTION_TYPES.SELECT_CARD, payload: { cardId } });
    },
    [dispatch],
  );

  const resetGame = useCallback((): void => {
    dispatch({ type: GAME_ACTION_TYPES.RESET_GAME });
  }, [dispatch]);

  const startGame = useCallback(
    (contributors: readonly Contributor[], overrides?: Partial<GameConfig>): void => {
      const config = resolveGameConfig(overrides);
      const cards = buildDeck(contributors, config.pairsOfCards);

      dispatch({
        type: GAME_ACTION_TYPES.START_GAME,
        payload: { cards, config },
      });
    },
    [dispatch],
  );

  return {
    selectCard,
    startGame,
    resetGame,
    selectedCardIds: state.selectedCardIds,
    isMovePending: state.pendingResolution !== 'none',
  };
}
