import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { vi } from 'vitest';
import {
  GameDispatchContext,
  GameStateContext,
} from '@/features/game/context/gameContexts';
import { INITIAL_GAME_STATE } from '@/features/game/context/gameState';
import type { GameState } from '@/features/game/types';

interface RenderWithGameStateOptions extends Omit<RenderOptions, 'wrapper'> {
  state?: Partial<GameState>;
}

export function renderWithGameState(
  ui: ReactElement,
  { state, ...options }: RenderWithGameStateOptions = {},
) {
  const gameState: GameState = { ...INITIAL_GAME_STATE, ...state };
  const dispatch = vi.fn();

  return {
    dispatch,
    ...render(ui, {
      ...options,
      wrapper: ({ children }: { children: ReactNode }) => (
        <GameStateContext.Provider value={gameState}>
          <GameDispatchContext.Provider value={dispatch}>
            {children}
          </GameDispatchContext.Provider>
        </GameStateContext.Provider>
      ),
    }),
  };
}
