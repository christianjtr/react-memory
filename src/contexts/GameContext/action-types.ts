enum GAME_ACTION_TYPES {
    ADD_TO_SCORE = 'ADD_TO_SCORE',
    INIT_GAME = 'INIT_GAME',
}

export type GameActionTypes = { type: keyof typeof GAME_ACTION_TYPES };
