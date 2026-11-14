import { formatRepository } from '@/features/contributors/lib/repositories';
import { buildScoreBreakdown, computeAccuracy } from './scoring';
import type {
  DifficultyId,
  GameMode,
  GameOutcome,
  GameState,
} from '../types';

export interface RoundResult {
  readonly mode: GameMode;
  readonly difficulty: DifficultyId;
  readonly repositoryLabel: string;
  readonly outcome: GameOutcome;
  readonly score: number;
  readonly base: number;
  readonly streakBonus: number;
  readonly errorPenalty: number;
  readonly timeBonus: number;
  readonly pairsFound: number;
  readonly errors: number;
  readonly moves: number;
  readonly bestStreak: number;
  readonly accuracy: number;
  readonly elapsedSeconds: number;
}

export function buildRoundResult(state: GameState): RoundResult | null {
  if (!state.isGameOver || state.round === null || state.outcome === null) {
    return null;
  }

  const pairsFound = state.foundContributorIds.length;
  const breakdown = buildScoreBreakdown({
    pairsFound,
    errors: state.errors,
    streakPoints: state.streakPoints,
    scoreMultiplier: state.config.scoreMultiplier,
    remainingSeconds: state.timer,
  });

  return {
    mode: state.round.mode,
    difficulty: state.round.difficulty,
    repositoryLabel: formatRepository(state.round.repository),
    outcome: state.outcome,
    score: state.finalScore ?? breakdown.total,
    base: breakdown.base,
    streakBonus: breakdown.streakBonus,
    errorPenalty: breakdown.errorPenalty,
    timeBonus: breakdown.timeBonus,
    pairsFound,
    errors: state.errors,
    moves: state.moves,
    bestStreak: state.bestStreak,
    accuracy: computeAccuracy(pairsFound, state.errors),
    elapsedSeconds: Math.max(0, state.config.durationInSeconds - state.timer),
  };
}
