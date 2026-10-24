import { describe, expect, it } from 'vitest';
import { DEFAULT_GAME_CONFIG, INITIAL_GAME_STATE, resolveGameConfig } from './gameState';

describe('gameState', () => {
  it('provides default game values', () => {
    expect(resolveGameConfig()).toEqual(DEFAULT_GAME_CONFIG);
    expect(INITIAL_GAME_STATE).toMatchObject({
      cards: [],
      foundContributorIds: [],
      selectedCardIds: [],
      score: 0,
      status: 'idle',
      pendingResolution: 'none',
      isGameOver: false,
    });
  });

  it('merges custom configuration', () => {
    expect(
      resolveGameConfig({
        durationInSeconds: 30,
        pairsOfCards: 4,
        scoreMultiplier: 25,
        timeUntilFaceDownCardsInSeconds: 0.5,
      }),
    ).toEqual({
      durationInSeconds: 30,
      pairsOfCards: 4,
      scoreMultiplier: 25,
      timeUntilFaceDownCardsInSeconds: 0.5,
    });
  });

  it('rejects an invalid duration', () => {
    expect(() => resolveGameConfig({ durationInSeconds: 0 })).toThrow(
      'durationInSeconds debe ser un entero positivo.',
    );
  });

  it('rejects an invalid pair count', () => {
    expect(() => resolveGameConfig({ pairsOfCards: 1.5 })).toThrow(
      'pairsOfCards debe ser un entero positivo.',
    );
  });

  it('rejects an invalid score multiplier', () => {
    expect(() => resolveGameConfig({ scoreMultiplier: -1 })).toThrow(
      'scoreMultiplier debe ser un entero positivo.',
    );
  });

  it('rejects an invalid face-down delay', () => {
    expect(() =>
      resolveGameConfig({ timeUntilFaceDownCardsInSeconds: Number.POSITIVE_INFINITY }),
    ).toThrow('timeUntilFaceDownCardsInSeconds debe ser un número positivo.');
  });
});
