import { GameCard, GameConfig, Contributor } from '../../types';

export enum GAME_ACTION_TYPES {
    ADD_TO_SCORE = 'ADD_TO_SCORE',
    FACE_UP_CARD = 'FACE_UP_CARD',
    INIT_GAME = 'INIT_GAME',
}

export type GameActionTypes =
  | { type: GAME_ACTION_TYPES.ADD_TO_SCORE; payload: { score: number; } }
  | { type: GAME_ACTION_TYPES.INIT_GAME; payload: { data: Contributor[]; config?: GameConfig; } }
  | { type: GAME_ACTION_TYPES.FACE_UP_CARD; payload: { cardId: number; } }
