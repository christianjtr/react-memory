import { assertNever } from '@/lib/assertNever';
import { GAME_ACTION_TYPES, type GameAction } from './gameActions';
import {
  buildScoreBreakdown,
  computeLiveScore,
  computeStreakBonusForLevel,
} from '../lib/scoring';
import type { GameCard, GameState } from '../types';

function flipCards(cards: readonly GameCard[], cardIds: readonly number[]): GameCard[] {
  return cards.map((card) =>
    cardIds.includes(card.cardId) ? { ...card, isFaceDown: false } : card,
  );
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case GAME_ACTION_TYPES.SET_DIFFICULTY: {
      if (state.difficulty === action.payload.difficulty) return state;

      return { ...state, difficulty: action.payload.difficulty };
    }

    case GAME_ACTION_TYPES.SET_REPOSITORY: {
      if (
        state.repository !== null &&
        state.repository.owner === action.payload.repository.owner &&
        state.repository.name === action.payload.repository.name
      ) {
        return state;
      }

      return { ...state, repository: action.payload.repository };
    }

    case GAME_ACTION_TYPES.SET_MODE: {
      const seed = action.payload.seed ?? null;

      if (state.mode === action.payload.mode && state.seed === seed) return state;

      return { ...state, mode: action.payload.mode, seed };
    }

    case GAME_ACTION_TYPES.START_GAME: {
      const { cards, config, mode, repository, startedAt } = action.payload;

      return {
        ...state,
        cards,
        foundContributorIds: [],
        selectedCardIds: [],
        score: 0,
        streakPoints: 0,
        moves: 0,
        errors: 0,
        streak: 0,
        bestStreak: 0,
        outcome: null,
        finalScore: null,
        timer: config.durationInSeconds,
        config,
        status: 'playing',
        pendingResolution: 'none',
        isGameOver: false,
        round: {
          mode,
          difficulty: state.difficulty,
          repository,
          startedAt,
        },
      };
    }

    case GAME_ACTION_TYPES.RESET_GAME: {
      return {
        ...state,
        cards: [],
        foundContributorIds: [],
        selectedCardIds: [],
        score: 0,
        streakPoints: 0,
        moves: 0,
        errors: 0,
        streak: 0,
        bestStreak: 0,
        outcome: null,
        finalScore: null,
        timer: state.config.durationInSeconds,
        status: 'idle',
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

      const moves = state.moves + 1;

      if (firstCard.contributor.id !== secondCard.contributor.id) {
        const errors = state.errors + 1;

        return {
          ...state,
          cards: cardsWithSelection,
          selectedCardIds,
          moves,
          errors,
          streak: 0,
          pendingResolution: 'mismatch',
          score: computeLiveScore({
            pairsFound: state.foundContributorIds.length,
            errors,
            streakPoints: state.streakPoints,
            scoreMultiplier: state.config.scoreMultiplier,
          }),
        };
      }

      const contributorId = firstCard.contributor.id;
      const foundContributorIds = state.foundContributorIds.includes(contributorId)
        ? state.foundContributorIds
        : [...state.foundContributorIds, contributorId];
      const streak = state.streak + 1;
      const streakPoints = state.streakPoints + computeStreakBonusForLevel(streak);
      const bestStreak = Math.max(state.bestStreak, streak);
      const isGameOver = foundContributorIds.length === state.config.pairsOfCards;
      const score = computeLiveScore({
        pairsFound: foundContributorIds.length,
        errors: state.errors,
        streakPoints,
        scoreMultiplier: state.config.scoreMultiplier,
      });

      return {
        ...state,
        cards: state.cards.map((card) =>
          selectedCardIds.includes(card.cardId)
            ? { ...card, isFaceDown: false, isMatched: true }
            : card,
        ),
        foundContributorIds,
        selectedCardIds: [],
        moves,
        streak,
        bestStreak,
        streakPoints,
        score,
        status: isGameOver ? 'finished' : 'playing',
        pendingResolution: 'none',
        isGameOver,
        outcome: isGameOver ? 'won' : null,
        finalScore: isGameOver
          ? buildScoreBreakdown({
              pairsFound: foundContributorIds.length,
              errors: state.errors,
              streakPoints,
              scoreMultiplier: state.config.scoreMultiplier,
              remainingSeconds: state.timer,
            }).total
          : null,
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

      if (timer > 0) {
        return { ...state, timer };
      }

      return {
        ...state,
        timer: 0,
        status: 'finished',
        isGameOver: true,
        outcome: 'lost',
        finalScore: buildScoreBreakdown({
          pairsFound: state.foundContributorIds.length,
          errors: state.errors,
          streakPoints: state.streakPoints,
          scoreMultiplier: state.config.scoreMultiplier,
          remainingSeconds: 0,
        }).total,
      };
    }

    default:
      return assertNever(action);
  }
}
