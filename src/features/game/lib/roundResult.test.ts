import { describe, expect, it } from 'vitest';
import { INITIAL_GAME_STATE, resolveGameConfig } from '../context/gameState';
import type { GameState } from '../types';
import { buildRoundResult } from './roundResult';

const repository = { owner: 'facebook', name: 'react' } as const;

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    ...INITIAL_GAME_STATE,
    config: resolveGameConfig({
      durationInSeconds: 60,
      pairsOfCards: 6,
      scoreMultiplier: 150,
    }),
    ...overrides,
  };
}

describe('buildRoundResult', () => {
  it('returns null while the game is running', () => {
    expect(buildRoundResult(createState({ status: 'playing' }))).toBeNull();
  });

  it('returns null when the round has no metadata', () => {
    expect(buildRoundResult(createState({ isGameOver: true }))).toBeNull();
  });

  it('summarizes a finished round', () => {
    const state = createState({
      isGameOver: true,
      status: 'finished',
      outcome: 'won',
      foundContributorIds: [1, 2, 3, 4, 5, 6],
      errors: 2,
      moves: 8,
      bestStreak: 3,
      streakPoints: 25,
      timer: 20,
      round: { mode: 'classic', difficulty: 'normal', repository, startedAt: 1 },
    });

    const result = buildRoundResult(state);

    expect(result).not.toBeNull();
    expect(result?.score).toBe(975);
    expect(result?.base).toBe(900);
    expect(result?.streakBonus).toBe(25);
    expect(result?.errorPenalty).toBe(50);
    expect(result?.timeBonus).toBe(100);
    expect(result?.accuracy).toBe(75);
    expect(result?.pairsFound).toBe(6);
    expect(result?.elapsedSeconds).toBe(40);
    expect(result?.repositoryLabel).toBe('facebook/react');
    expect(result?.difficulty).toBe('normal');
    expect(result?.outcome).toBe('won');
  });

  it('reports a loss with no time bonus', () => {
    const state = createState({
      isGameOver: true,
      status: 'finished',
      outcome: 'lost',
      foundContributorIds: [1, 2],
      errors: 3,
      moves: 5,
      timer: 0,
      round: { mode: 'classic', difficulty: 'easy', repository, startedAt: 1 },
    });

    const result = buildRoundResult(state);

    expect(result?.outcome).toBe('lost');
    expect(result?.timeBonus).toBe(0);
    expect(result?.accuracy).toBe(40);
    expect(result?.elapsedSeconds).toBe(60);
  });
});
