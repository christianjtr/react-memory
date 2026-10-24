import type { Contributor } from '@/features/contributors/types';

export interface GameConfig {
  readonly durationInSeconds: number;
  readonly pairsOfCards: number;
  readonly scoreMultiplier: number;
  readonly timeUntilFaceDownCardsInSeconds: number;
}

export type GameStatus = 'idle' | 'playing' | 'finished';

export interface GameCard {
  readonly cardId: number;
  readonly contributor: Contributor;
  readonly isFaceDown: boolean;
  readonly isMatched: boolean;
}

export interface GameState {
  readonly cards: readonly GameCard[];
  readonly foundContributorIds: readonly number[];
  readonly selectedCardIds: readonly number[];
  readonly score: number;
  readonly timer: number;
  readonly config: GameConfig;
  readonly status: GameStatus;
  readonly pendingResolution: 'none' | 'mismatch';
  readonly isGameOver: boolean;
}
