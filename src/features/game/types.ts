import type { Contributor, Repository } from '@/features/contributors/types';

export type DifficultyId = 'easy' | 'normal' | 'hard';

export type GameMode = 'classic' | 'daily';

export type GameOutcome = 'won' | 'lost';

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

export interface GameRound {
  readonly mode: GameMode;
  readonly difficulty: DifficultyId;
  readonly repository: Repository;
  readonly startedAt: number;
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
  readonly mode: GameMode;
  readonly seed: string | null;
  readonly difficulty: DifficultyId;
  readonly repository: Repository | null;
  readonly round: GameRound | null;
  readonly moves: number;
  readonly errors: number;
  readonly streak: number;
  readonly bestStreak: number;
  readonly streakPoints: number;
  readonly outcome: GameOutcome | null;
  readonly finalScore: number | null;
}
