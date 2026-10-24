import type { GameConfig } from '../types';

export type DifficultyId = 'easy' | 'normal' | 'hard';

export interface Difficulty {
  readonly id: DifficultyId;
  readonly label: string;
  readonly description: string;
  readonly config: Pick<GameConfig, 'pairsOfCards' | 'durationInSeconds'>;
}

export const DIFFICULTIES: readonly Difficulty[] = [
  {
    id: 'easy',
    label: 'Fácil',
    description: '4 pares · 90s',
    config: { pairsOfCards: 4, durationInSeconds: 90 },
  },
  {
    id: 'normal',
    label: 'Normal',
    description: '6 pares · 60s',
    config: { pairsOfCards: 6, durationInSeconds: 60 },
  },
  {
    id: 'hard',
    label: 'Difícil',
    description: '8 pares · 45s',
    config: { pairsOfCards: 8, durationInSeconds: 45 },
  },
];

export const DEFAULT_DIFFICULTY: DifficultyId = 'normal';

export function getDifficulty(id: DifficultyId): Difficulty {
  return DIFFICULTIES.find((difficulty) => difficulty.id === id) ?? DIFFICULTIES[1]!;
}
