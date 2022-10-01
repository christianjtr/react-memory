import { take, shuffle } from 'lodash';

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
  case GAME_ACTION_TYPES.FACE_UP_CARD: {
    const { cards } = state;
    const { cardId } = action.payload;

    const copyOfCards = cards.map((card) => {
      return card.id === cardId 
        ? {...card, isFaceDown: false} 
        : card;
    });
    
    return {
      ...state,
      cards: copyOfCards,
    };
  }
  case GAME_ACTION_TYPES.INIT_GAME: {
    const { config } = state;
    const { data, config: customConfig = undefined } = action.payload;

    const pairsOfCards = (customConfig?.pairsOfCards && customConfig?.pairsOfCards%2 === 0) 
      ? customConfig?.pairsOfCards
      : config.pairsOfCards;
    
    const selectionOfItems = take(shuffle(data), pairsOfCards);
    const shuffledItems = shuffle([...selectionOfItems, ...selectionOfItems]);
    const cardsToAdd = shuffledItems.map((item, index) => ({
      id: index,
      data: item,
      isFaceDown: true,
    }));
    
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
