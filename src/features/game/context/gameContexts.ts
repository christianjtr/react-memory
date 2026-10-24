import { createContext, type Dispatch } from 'react';
import type { GameAction } from './gameActions';
import type { GameState } from '../types';

export const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameDispatchContext = createContext<Dispatch<GameAction> | undefined>(
  undefined,
);
