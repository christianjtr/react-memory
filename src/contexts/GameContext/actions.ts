import { GameStateInterface } from './state';
import { GameActionTypes, GAME_ACTION_TYPES } from './action-types';

const GameActions = (state: GameStateInterface, action: GameActionTypes): GameStateInterface => {
  switch(action.type) {
  case GAME_ACTION_TYPES.ADD_TO_SCORE: {
    const { score } = state;
    const { score: scoreToAdd } = action.payload;
    return {
      ...state,
      score: score + scoreToAdd,
    };
  }
  case GAME_ACTION_TYPES.INIT_GAME: {
    const { config } = state;
    const {cards: cardsToAdd, config: customConfig = undefined} = action.payload;
    return {
      ...state,
      cards: cardsToAdd,
      config: customConfig || config
    };
  }
  default: {
    throw new Error('Unhandled action type');
  }
  }
};

export default GameActions;
