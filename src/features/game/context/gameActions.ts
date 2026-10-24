import type { GameCard, GameConfig } from '../types';

export const GAME_ACTION_TYPES = {
  START_GAME: 'START_GAME',
  SELECT_CARD: 'SELECT_CARD',
  FACE_DOWN_CARDS: 'FACE_DOWN_CARDS',
  TICK: 'TICK',
} as const;

export type GameAction =
  | {
      readonly type: typeof GAME_ACTION_TYPES.START_GAME;
      readonly payload: {
        readonly cards: readonly GameCard[];
        readonly config: GameConfig;
      };
    }
  | {
      readonly type: typeof GAME_ACTION_TYPES.SELECT_CARD;
      readonly payload: { readonly cardId: number };
    }
  | { readonly type: typeof GAME_ACTION_TYPES.FACE_DOWN_CARDS }
  | { readonly type: typeof GAME_ACTION_TYPES.TICK };
