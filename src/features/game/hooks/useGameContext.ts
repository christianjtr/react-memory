import { useContext, type Dispatch } from 'react';
import { GameDispatchContext, GameStateContext } from '../context/gameContexts';
import type { GameAction } from '../context/gameActions';
import type { GameState } from '../types';

export function useGameState(): GameState {
  const state = useContext(GameStateContext);

  if (state === undefined) {
    throw new Error('useGameState must be used within a GameProvider');
  }

  return state;
}

export function useGameDispatch(): Dispatch<GameAction> {
  const dispatch = useContext(GameDispatchContext);

  if (dispatch === undefined) {
    throw new Error('useGameDispatch must be used within a GameProvider');
  }

  return dispatch;
}
