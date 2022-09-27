import { Contributor, GameConfig } from '../../types';

export enum GAME_ACTION_TYPES {
    ADD_TO_SCORE = 'ADD_TO_SCORE',
    INIT_GAME = 'INIT_GAME',
}

export type GameActionTypes =
  | { type: GAME_ACTION_TYPES.ADD_TO_SCORE; payload: { score: number;} }
  | { type: GAME_ACTION_TYPES.INIT_GAME; payload: { cards: Contributor[], config?: GameConfig } };
