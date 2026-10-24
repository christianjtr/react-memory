import { assertNever } from '@/lib/assertNever';
import { GAME_ACTION_TYPES, type GameAction } from './gameActions';
import type { GameCard, GameState } from '../types';

function flipCards(cards: readonly GameCard[], cardIds: readonly number[]): GameCard[] {
  return cards.map((card) =>
    cardIds.includes(card.cardId) ? { ...card, isFaceDown: false } : card,
  );
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case GAME_ACTION_TYPES.START_GAME: {
      const { cards, config } = action.payload;

      return {
        ...state,
        cards,
        foundContributorIds: [],
        selectedCardIds: [],
        score: 0,
        timer: config.durationInSeconds,
        config,
        status: 'playing',
        pendingResolution: 'none',
        isGameOver: false,
      };
    }

    case GAME_ACTION_TYPES.SELECT_CARD: {
      if (
        state.status !== 'playing' ||
        state.pendingResolution !== 'none' ||
        state.selectedCardIds.length >= 2
      ) {
        return state;
      }

      const selectedCard = state.cards.find(
        (card) => card.cardId === action.payload.cardId,
      );

      if (
        selectedCard === undefined ||
        !selectedCard.isFaceDown ||
        state.selectedCardIds.includes(selectedCard.cardId)
      ) {
        return state;
      }

      const selectedCardIds = [...state.selectedCardIds, selectedCard.cardId];
      const cardsWithSelection = flipCards(state.cards, selectedCardIds);

      if (selectedCardIds.length === 1) {
        return {
          ...state,
          cards: cardsWithSelection,
          selectedCardIds,
        };
      }

      const firstCard = state.cards.find((card) => card.cardId === selectedCardIds[0]);
      const secondCard = state.cards.find((card) => card.cardId === selectedCardIds[1]);

      if (firstCard === undefined || secondCard === undefined) {
        return state;
      }

      if (firstCard.contributor.id !== secondCard.contributor.id) {
        return {
          ...state,
          cards: cardsWithSelection,
          selectedCardIds,
          pendingResolution: 'mismatch',
        };
      }

      const contributorId = firstCard.contributor.id;
      const foundContributorIds = state.foundContributorIds.includes(contributorId)
        ? state.foundContributorIds
        : [...state.foundContributorIds, contributorId];
      const isGameOver = foundContributorIds.length === state.config.pairsOfCards;

      return {
        ...state,
        cards: state.cards.map((card) =>
          selectedCardIds.includes(card.cardId)
            ? { ...card, isFaceDown: false, isMatched: true }
            : card,
        ),
        foundContributorIds,
        selectedCardIds: [],
        score: state.config.scoreMultiplier * foundContributorIds.length,
        status: isGameOver ? 'finished' : 'playing',
        pendingResolution: 'none',
        isGameOver,
      };
    }

    case GAME_ACTION_TYPES.FACE_DOWN_CARDS: {
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.isMatched ? card : { ...card, isFaceDown: true },
        ),
        selectedCardIds: [],
        pendingResolution: 'none',
      };
    }

    case GAME_ACTION_TYPES.TICK: {
      if (state.status !== 'playing') return state;

      const timer = Math.max(0, state.timer - 1);
      const isGameOver = timer === 0;

      return {
        ...state,
        timer,
        status: isGameOver ? 'finished' : 'playing',
        isGameOver,
      };
    }

    default:
      return assertNever(action);
  }
}
