import { GameStateInterface } from './state';
import { GameActionTypes } from './action-types';

export interface GameActionsInterface {
    action: GameActionTypes;
    payload?: unknown;
}

const GameActions = (state: GameStateInterface, {action, payload}: GameActionsInterface): GameStateInterface => {
  switch(action.type) {
  case 'ADD_TO_SCORE': {
    const {score} = state;
    return {
      ...state,
      score: score + 1,
    };
  }
  default: {
    throw new Error(`Unhandled action type: ${action.type}`);
  }
  }
};

export default GameActions;