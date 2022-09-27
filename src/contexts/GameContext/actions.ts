import _ from 'lodash';

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
    const { cards, config: customConfig = undefined } = action.payload;

    const pairsOfCards = (customConfig?.pairsOfCards && customConfig?.pairsOfCards%2 === 0) 
      ? customConfig?.pairsOfCards
      : config.pairsOfCards;
    
    const selectionOfCards = _.chain(cards)
      .shuffle()
      .take(pairsOfCards)
      .value();

    const cardsToAdd = _.shuffle([...selectionOfCards, ...selectionOfCards]);

    return {
      ...state,
      cards: cardsToAdd,
      config: { 
        durationInSeconds: customConfig?.durationInSeconds || config.durationInSeconds, 
        pairsOfCards 
      }
    };
  }
  default: {
    throw new Error('Unhandled action type');
  }
  }
};

export default GameActions;
