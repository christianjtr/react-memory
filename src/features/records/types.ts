import type { DifficultyId } from '@/features/game/types';

export interface DifficultyRecords {
  readonly bestScore: number;
  readonly bestTimeInSeconds: number | null;
  readonly bestAccuracy: number | null;
  readonly gamesPlayed: number;
  readonly wins: number;
  readonly totalPairs: number;
  readonly totalErrors: number;
  readonly bestStreak: number;
}

export interface RecordsState {
  readonly version: number;
  readonly globalBestScore: number;
  readonly byDifficulty: Readonly<Record<DifficultyId, DifficultyRecords>>;
}
