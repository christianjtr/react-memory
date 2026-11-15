import type { Repository } from '@/features/contributors/types';
import type { DifficultyId } from '@/features/game/types';

export interface DailyChallenge {
  readonly dateKey: string;
  readonly seed: string;
  readonly repository: Repository;
  readonly difficulty: DifficultyId;
}

export interface DailyState {
  readonly version: number;
  readonly lastPlayedDateKey: string | null;
  readonly bestScore: number;
  readonly scores: Readonly<Record<string, number>>;
}
