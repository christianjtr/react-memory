import type { Repository } from '@/features/contributors/types';
import type {
  DifficultyId,
  GameCard,
  GameConfig,
  GameMode,
} from '../types';

export const GAME_ACTION_TYPES = {
  START_GAME: 'START_GAME',
  RESET_GAME: 'RESET_GAME',
  SELECT_CARD: 'SELECT_CARD',
  FACE_DOWN_CARDS: 'FACE_DOWN_CARDS',
  TICK: 'TICK',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SET_REPOSITORY: 'SET_REPOSITORY',
  SET_MODE: 'SET_MODE',
} as const;

export type GameAction =
  | {
      readonly type: typeof GAME_ACTION_TYPES.START_GAME;
      readonly payload: {
        readonly cards: readonly GameCard[];
        readonly config: GameConfig;
        readonly mode: GameMode;
        readonly repository: Repository;
        readonly startedAt: number;
      };
    }
  | { readonly type: typeof GAME_ACTION_TYPES.RESET_GAME }
  | {
      readonly type: typeof GAME_ACTION_TYPES.SELECT_CARD;
      readonly payload: { readonly cardId: number };
    }
  | { readonly type: typeof GAME_ACTION_TYPES.FACE_DOWN_CARDS }
  | { readonly type: typeof GAME_ACTION_TYPES.TICK }
  | {
      readonly type: typeof GAME_ACTION_TYPES.SET_DIFFICULTY;
      readonly payload: { readonly difficulty: DifficultyId };
    }
  | {
      readonly type: typeof GAME_ACTION_TYPES.SET_REPOSITORY;
      readonly payload: { readonly repository: Repository };
    }
  | {
      readonly type: typeof GAME_ACTION_TYPES.SET_MODE;
      readonly payload: { readonly mode: GameMode; readonly seed?: string | null };
    };
