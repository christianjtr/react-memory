import { useCallback, useEffect } from 'react';
import type { Contributor, Repository } from '@/features/contributors/types';
import { createSeededRandomFromString, type RandomSource } from '@/lib/random';
import { GAME_ACTION_TYPES } from '../context/gameActions';
import { resolveGameConfig } from '../context/gameState';
import { buildDeck } from '../lib/deck';
import { getDifficulty } from '../lib/difficulty';
import type { DifficultyId, GameConfig, GameMode } from '../types';
import { useGameDispatch, useGameState } from './useGameContext';
import { useGameTimer } from './useGameTimer';

export interface StartGameOptions {
  readonly config?: Partial<GameConfig>;
  readonly random?: RandomSource;
}

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

  const setDifficulty = useCallback(
    (difficulty: DifficultyId): void => {
      dispatch({ type: GAME_ACTION_TYPES.SET_DIFFICULTY, payload: { difficulty } });
    },
    [dispatch],
  );

  const setRepository = useCallback(
    (repository: Repository): void => {
      dispatch({ type: GAME_ACTION_TYPES.SET_REPOSITORY, payload: { repository } });
    },
    [dispatch],
  );

  const setMode = useCallback(
    (mode: GameMode, seed?: string | null): void => {
      dispatch({ type: GAME_ACTION_TYPES.SET_MODE, payload: { mode, seed } });
    },
    [dispatch],
  );

  const startGame = useCallback(
    (
      contributors: readonly Contributor[],
      options?: StartGameOptions,
    ): void => {
      const repository = state.repository;

      if (repository === null) {
        throw new Error('No hay un repositorio seleccionado para iniciar la partida.');
      }

      const config = resolveGameConfig({
        ...getDifficulty(state.difficulty).config,
        ...options?.config,
      });
      const random =
        options?.random ??
        (state.mode === 'daily' && state.seed !== null
          ? createSeededRandomFromString(state.seed)
          : undefined);
      const cards = buildDeck(contributors, config.pairsOfCards, random);

      dispatch({
        type: GAME_ACTION_TYPES.START_GAME,
        payload: {
          cards,
          config,
          mode: state.mode,
          repository,
          startedAt: Date.now(),
        },
      });
    },
    [dispatch, state.difficulty, state.mode, state.repository, state.seed],
  );

  return {
    selectCard,
    startGame,
    resetGame,
    setDifficulty,
    setRepository,
    setMode,
    selectedCardIds: state.selectedCardIds,
    isMovePending: state.pendingResolution !== 'none',
  };
}
