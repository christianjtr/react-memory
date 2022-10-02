import { GameConfig, Contributor } from '../../types';

export enum GAME_ACTION_TYPES {
    FACE_UP_CARD = 'FACE_UP_CARD',
    FACE_DOWN_CARDS = 'FACE_DOWN_CARDS',
    ADD_TO_FOUND_PAIRS = 'ADD_TO_FOUND_PAIRS',
    INIT_GAME = 'INIT_GAME',
}

export type GameActionTypes =
  | { type: GAME_ACTION_TYPES.FACE_UP_CARD; payload: { cardId: number; } }
  | { type: GAME_ACTION_TYPES.FACE_DOWN_CARDS; }
  | { type: GAME_ACTION_TYPES.ADD_TO_FOUND_PAIRS; payload: { cardId: number; } }
  | { type: GAME_ACTION_TYPES.INIT_GAME; payload: { data: Contributor[]; config?: GameConfig; } }
