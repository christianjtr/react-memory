import { GameConfig, Contributor } from '../../types';

export enum GAME_ACTION_TYPES {
    FACE_UP_CARD = 'FACE_UP_CARD',
    FACE_DOWN_CARDS = 'FACE_DOWN_CARDS',
    ADD_TO_FOUND_PAIRS = 'ADD_TO_FOUND_PAIRS',
    SET_GAME_OVER = 'SET_GAME_OVER',
    SET_COUNT_DOWN_TIME = 'SET_COUNT_DOWN_TIME',
    INIT_GAME = 'INIT_GAME',
}

export type GameActionTypes =
  | { type: GAME_ACTION_TYPES.FACE_UP_CARD; payload: { cardId: number; } }
  | { type: GAME_ACTION_TYPES.FACE_DOWN_CARDS; }
  | { type: GAME_ACTION_TYPES.ADD_TO_FOUND_PAIRS; payload: { cardId: number; } }
  | { type: GAME_ACTION_TYPES.SET_GAME_OVER } 
  | { type: GAME_ACTION_TYPES.SET_COUNT_DOWN_TIME, payload: { timer: number; } } 
  | { type: GAME_ACTION_TYPES.INIT_GAME; payload: { data: Contributor[]; config?: GameConfig; } }
  
