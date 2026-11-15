import { describe, expect, it } from 'vitest';
import type { Repository } from '@/features/contributors/types';
import { contributorsFixture } from '@/test/fixtures/contributors';
import type { GameCard, GameConfig, GameState } from '../types';
import { GAME_ACTION_TYPES, type GameAction } from './gameActions';
import { gameReducer } from './gameReducer';
import { INITIAL_GAME_STATE, resolveGameConfig } from './gameState';

const config: GameConfig = resolveGameConfig({
  durationInSeconds: 10,
  pairsOfCards: 2,
  scoreMultiplier: 50,
  timeUntilFaceDownCardsInSeconds: 0.5,
});

const repository: Repository = { owner: 'facebook', name: 'react' };

const contributorA = contributorsFixture[0]!;
const contributorB = contributorsFixture[1]!;

const cards: GameCard[] = [
  { cardId: 0, contributor: contributorA, isFaceDown: true, isMatched: false },
  { cardId: 1, contributor: contributorB, isFaceDown: true, isMatched: false },
  { cardId: 2, contributor: contributorA, isFaceDown: true, isMatched: false },
  { cardId: 3, contributor: contributorB, isFaceDown: true, isMatched: false },
];

function startGameWithCards(
  gameCards: readonly GameCard[],
  gameConfig: GameConfig = config,
): GameState {
  return gameReducer(INITIAL_GAME_STATE, {
    type: GAME_ACTION_TYPES.START_GAME,
    payload: {
      cards: gameCards,
      config: gameConfig,
      mode: 'classic',
      repository,
      startedAt: 1_700_000_000_000,
    },
  });
}

function startGame(): GameState {
  return startGameWithCards(cards);
}

function selectCard(state: GameState, cardId: number): GameState {
  return gameReducer(state, {
    type: GAME_ACTION_TYPES.SELECT_CARD,
    payload: { cardId },
  });
}

describe('gameReducer', () => {
  it('starts a new game', () => {
    const state = startGame();

    expect(state).toMatchObject({
      cards,
      foundContributorIds: [],
      selectedCardIds: [],
      score: 0,
      timer: 10,
      config,
      status: 'playing',
      pendingResolution: 'none',
      isGameOver: false,
      moves: 0,
      errors: 0,
      streak: 0,
      bestStreak: 0,
      streakPoints: 0,
      outcome: null,
      finalScore: null,
    });
    expect(state.round).toEqual({
      mode: 'classic',
      difficulty: 'normal',
      repository,
      startedAt: 1_700_000_000_000,
    });
  });

  it('resets the current game before loading another repository', () => {
    const startedState = selectCard(startGame(), 0);
    const state = gameReducer(startedState, {
      type: GAME_ACTION_TYPES.RESET_GAME,
    });

    expect(state).toMatchObject({
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
      timer: config.durationInSeconds,
      status: 'idle',
      pendingResolution: 'none',
      isGameOver: false,
    });
  });

  it('flips the first selected card', () => {
    const state = selectCard(startGame(), 0);

    expect(state.cards[0]?.isFaceDown).toBe(false);
    expect(state.selectedCardIds).toEqual([0]);
    expect(state.pendingResolution).toBe('none');
  });

  it('ignores invalid, repeated, and already flipped cards', () => {
    const initialState = startGame();
    const firstSelection = selectCard(initialState, 0);

    expect(selectCard(firstSelection, 0)).toBe(firstSelection);
    expect(selectCard(initialState, 99)).toBe(initialState);

    const matchedState = selectCard(selectCard(initialState, 0), 2);

    expect(selectCard(matchedState, 0)).toBe(matchedState);
  });

  it('marks a mismatch and waits for face-down resolution', () => {
    const state = selectCard(selectCard(startGame(), 0), 1);

    expect(state.cards[0]?.isFaceDown).toBe(false);
    expect(state.cards[1]?.isFaceDown).toBe(false);
    expect(state.selectedCardIds).toEqual([0, 1]);
    expect(state.pendingResolution).toBe('mismatch');
    expect(state.moves).toBe(1);
    expect(state.errors).toBe(1);
  });

  it('ignores selections while a mismatch is pending', () => {
    const mismatchState = selectCard(selectCard(startGame(), 0), 1);

    expect(selectCard(mismatchState, 2)).toBe(mismatchState);
  });

  it('flips mismatched cards back down', () => {
    const mismatchState = selectCard(selectCard(startGame(), 0), 1);
    const state = gameReducer(mismatchState, {
      type: GAME_ACTION_TYPES.FACE_DOWN_CARDS,
    });

    expect(state.cards[0]?.isFaceDown).toBe(true);
    expect(state.cards[1]?.isFaceDown).toBe(true);
    expect(state.selectedCardIds).toEqual([]);
    expect(state.pendingResolution).toBe('none');
  });

  it('resolves a matching pair and updates the score', () => {
    const state = selectCard(selectCard(startGame(), 0), 2);

    expect(state.cards[0]).toMatchObject({ isMatched: true, isFaceDown: false });
    expect(state.cards[2]).toMatchObject({ isMatched: true, isFaceDown: false });
    expect(state.foundContributorIds).toEqual([contributorA.id]);
    expect(state.selectedCardIds).toEqual([]);
    expect(state.score).toBe(50);
    expect(state.streak).toBe(1);
    expect(state.bestStreak).toBe(1);
    expect(state.streakPoints).toBe(0);
    expect(state.status).toBe('playing');
    expect(state.isGameOver).toBe(false);
  });

  it('applies a streak bonus on consecutive matches', () => {
    const firstMatch = selectCard(selectCard(startGame(), 0), 2);
    const state = selectCard(selectCard(firstMatch, 1), 3);

    expect(state.streak).toBe(2);
    expect(state.bestStreak).toBe(2);
    expect(state.streakPoints).toBe(25);
    expect(state.score).toBe(125);
  });

  it('resets the streak on a mismatch but keeps the earned points', () => {
    const contributorC = contributorsFixture[2]!;
    const contributorD = contributorsFixture[3]!;
    const openConfig = resolveGameConfig({
      durationInSeconds: 10,
      pairsOfCards: 3,
      scoreMultiplier: 50,
      timeUntilFaceDownCardsInSeconds: 0.5,
    });
    const extendedState = startGameWithCards(
      [
        ...cards,
        {
          cardId: 4,
          contributor: contributorC,
          isFaceDown: true,
          isMatched: false,
        },
        {
          cardId: 5,
          contributor: contributorD,
          isFaceDown: true,
          isMatched: false,
        },
      ],
      openConfig,
    );

    const firstMatch = selectCard(selectCard(extendedState, 0), 2);
    const secondMatch = selectCard(selectCard(firstMatch, 1), 3);
    const mismatchState = selectCard(selectCard(secondMatch, 4), 5);
    const state = gameReducer(mismatchState, {
      type: GAME_ACTION_TYPES.FACE_DOWN_CARDS,
    });

    expect(state.streak).toBe(0);
    expect(state.bestStreak).toBe(2);
    expect(state.streakPoints).toBe(25);
    expect(state.errors).toBe(1);
    expect(state.moves).toBe(3);
    expect(state.score).toBe(100);
  });

  it('finishes the game when all pairs are found', () => {
    const firstMatch = selectCard(selectCard(startGame(), 0), 2);
    const state = selectCard(selectCard(firstMatch, 1), 3);

    expect(state.foundContributorIds).toHaveLength(2);
    expect(state.score).toBe(125);
    expect(state.status).toBe('finished');
    expect(state.isGameOver).toBe(true);
    expect(state.outcome).toBe('won');
    expect(state.finalScore).toBe(175);
  });

  it('ignores selections after the game is over', () => {
    const firstMatch = selectCard(selectCard(startGame(), 0), 2);
    const finishedState = selectCard(selectCard(firstMatch, 1), 3);

    expect(selectCard(finishedState, 0)).toBe(finishedState);
  });

  it('keeps matched cards face up when other cards are flipped down', () => {
    const contributorC = contributorsFixture[2]!;
    const contributorD = contributorsFixture[3]!;
    const baseState = startGame();
    const extendedState: GameState = {
      ...baseState,
      cards: [
        ...baseState.cards,
        {
          cardId: 4,
          contributor: contributorC,
          isFaceDown: true,
          isMatched: false,
        },
        {
          cardId: 5,
          contributor: contributorD,
          isFaceDown: true,
          isMatched: false,
        },
      ],
    };
    const matchedState = selectCard(selectCard(extendedState, 0), 2);
    const mismatchState = selectCard(selectCard(matchedState, 4), 5);
    const state = gameReducer(mismatchState, {
      type: GAME_ACTION_TYPES.FACE_DOWN_CARDS,
    });

    expect(state.cards[0]).toMatchObject({ isMatched: true, isFaceDown: false });
    expect(state.cards[2]).toMatchObject({ isMatched: true, isFaceDown: false });
    expect(state.cards[4]?.isFaceDown).toBe(true);
    expect(state.cards[5]?.isFaceDown).toBe(true);
  });

  it('does not duplicate an already found contributor', () => {
    const stateWithFoundPair: GameState = {
      ...startGame(),
      foundContributorIds: [contributorA.id],
    };
    const state = selectCard(selectCard(stateWithFoundPair, 0), 2);

    expect(state.foundContributorIds).toEqual([contributorA.id]);
    expect(state.score).toBe(50);
  });

  it('handles selection state with stale card ids', () => {
    const stateWithStaleSelection: GameState = {
      ...startGame(),
      selectedCardIds: [99],
    };

    expect(selectCard(stateWithStaleSelection, 0)).toBe(stateWithStaleSelection);
  });

  it('counts down and finishes at zero', () => {
    const startedState = startGame();
    const tickingState = gameReducer(startedState, { type: GAME_ACTION_TYPES.TICK });
    const finishedState = gameReducer(
      { ...startedState, timer: 1 },
      { type: GAME_ACTION_TYPES.TICK },
    );

    expect(tickingState.timer).toBe(9);
    expect(finishedState).toMatchObject({
      timer: 0,
      status: 'finished',
      isGameOver: true,
      outcome: 'lost',
    });
  });

  it('awards no time bonus when the timer runs out', () => {
    const matchedState = selectCard(selectCard(startGame(), 0), 2);
    const finishedState = gameReducer(
      { ...matchedState, timer: 1 },
      { type: GAME_ACTION_TYPES.TICK },
    );

    expect(finishedState.outcome).toBe('lost');
    expect(finishedState.finalScore).toBe(50);
  });

  it('ignores ticks when the game is not running', () => {
    expect(gameReducer(INITIAL_GAME_STATE, { type: GAME_ACTION_TYPES.TICK })).toBe(
      INITIAL_GAME_STATE,
    );
  });

  it('updates the difficulty, repository and mode', () => {
    const withDifficulty = gameReducer(INITIAL_GAME_STATE, {
      type: GAME_ACTION_TYPES.SET_DIFFICULTY,
      payload: { difficulty: 'hard' },
    });
    const withRepository = gameReducer(withDifficulty, {
      type: GAME_ACTION_TYPES.SET_REPOSITORY,
      payload: { repository },
    });
    const withMode = gameReducer(withRepository, {
      type: GAME_ACTION_TYPES.SET_MODE,
      payload: { mode: 'daily' },
    });

    expect(withMode.difficulty).toBe('hard');
    expect(withMode.repository).toEqual(repository);
    expect(withMode.mode).toBe('daily');
  });

  it('ignores repeated difficulty, repository and mode updates', () => {
    const withDifficulty = gameReducer(INITIAL_GAME_STATE, {
      type: GAME_ACTION_TYPES.SET_DIFFICULTY,
      payload: { difficulty: 'normal' },
    });
    const withRepository = gameReducer(withDifficulty, {
      type: GAME_ACTION_TYPES.SET_REPOSITORY,
      payload: { repository },
    });
    const withSameRepository = gameReducer(withRepository, {
      type: GAME_ACTION_TYPES.SET_REPOSITORY,
      payload: { repository },
    });
    const withMode = gameReducer(withRepository, {
      type: GAME_ACTION_TYPES.SET_MODE,
      payload: { mode: 'classic' },
    });

    expect(withDifficulty).toBe(INITIAL_GAME_STATE);
    expect(withSameRepository).toBe(withRepository);
    expect(withMode).toBe(withRepository);
  });

  it('stores the daily seed and clears it when returning to classic', () => {
    const withSeed = gameReducer(INITIAL_GAME_STATE, {
      type: GAME_ACTION_TYPES.SET_MODE,
      payload: { mode: 'daily', seed: 'github-memory:daily:2026-01-01' },
    });

    expect(withSeed.mode).toBe('daily');
    expect(withSeed.seed).toBe('github-memory:daily:2026-01-01');

    const withClassic = gameReducer(withSeed, {
      type: GAME_ACTION_TYPES.SET_MODE,
      payload: { mode: 'classic' },
    });

    expect(withClassic.mode).toBe('classic');
    expect(withClassic.seed).toBeNull();
  });

  it('rejects unknown actions', () => {
    expect(() =>
      gameReducer(startGame(), { type: 'UNKNOWN' } as unknown as GameAction),
    ).toThrow('Unhandled case');
  });
});
