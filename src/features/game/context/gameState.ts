import type { GameConfig, GameState } from '../types';

export const DEFAULT_GAME_CONFIG: GameConfig = {
  durationInSeconds: 60,
  pairsOfCards: 6,
  scoreMultiplier: 100,
  timeUntilFaceDownCardsInSeconds: 1,
};

export const INITIAL_GAME_STATE: GameState = {
  cards: [],
  foundContributorIds: [],
  selectedCardIds: [],
  score: 0,
  timer: DEFAULT_GAME_CONFIG.durationInSeconds,
  config: DEFAULT_GAME_CONFIG,
  status: 'idle',
  pendingResolution: 'none',
  isGameOver: false,
};

function requirePositiveInteger(value: number, field: string): number {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${field} debe ser un entero positivo.`);
  }

  return value;
}

function requirePositiveNumber(value: number, field: string): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${field} debe ser un número positivo.`);
  }

  return value;
}

export function resolveGameConfig(overrides?: Partial<GameConfig>): GameConfig {
  return {
    durationInSeconds: requirePositiveInteger(
      overrides?.durationInSeconds ?? DEFAULT_GAME_CONFIG.durationInSeconds,
      'durationInSeconds',
    ),
    pairsOfCards: requirePositiveInteger(
      overrides?.pairsOfCards ?? DEFAULT_GAME_CONFIG.pairsOfCards,
      'pairsOfCards',
    ),
    scoreMultiplier: requirePositiveInteger(
      overrides?.scoreMultiplier ?? DEFAULT_GAME_CONFIG.scoreMultiplier,
      'scoreMultiplier',
    ),
    timeUntilFaceDownCardsInSeconds: requirePositiveNumber(
      overrides?.timeUntilFaceDownCardsInSeconds ??
        DEFAULT_GAME_CONFIG.timeUntilFaceDownCardsInSeconds,
      'timeUntilFaceDownCardsInSeconds',
    ),
  };
}
