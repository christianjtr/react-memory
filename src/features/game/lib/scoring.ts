export const SCORING_RULES = {
  timeBonusPerSecond: 5,
  streakBonusPerLevel: 25,
  errorPenalty: 25,
} as const;

export interface ScoreBreakdown {
  readonly base: number;
  readonly streakBonus: number;
  readonly errorPenalty: number;
  readonly timeBonus: number;
  readonly total: number;
}

export interface ScoreInput {
  readonly pairsFound: number;
  readonly errors: number;
  readonly streakPoints: number;
  readonly scoreMultiplier: number;
}

export function computeBaseScore(pairsFound: number, scoreMultiplier: number): number {
  return Math.max(0, pairsFound) * Math.max(0, scoreMultiplier);
}

export function computeStreakBonusForLevel(streak: number): number {
  if (streak < 2) return 0;
  return (streak - 1) * SCORING_RULES.streakBonusPerLevel;
}

export function computeTimeBonus(remainingSeconds: number): number {
  return Math.max(0, remainingSeconds) * SCORING_RULES.timeBonusPerSecond;
}

export function computeErrorPenalty(errors: number): number {
  return Math.max(0, errors) * SCORING_RULES.errorPenalty;
}

export function computeAccuracy(pairsFound: number, errors: number): number {
  const attempts = pairsFound + errors;
  if (attempts <= 0) return 0;

  return Math.round((pairsFound / attempts) * 100);
}

export function computeLiveScore(input: ScoreInput): number {
  const base = computeBaseScore(input.pairsFound, input.scoreMultiplier);
  const penalty = computeErrorPenalty(input.errors);
  const streakBonus = Math.max(0, input.streakPoints);

  return Math.max(0, base + streakBonus - penalty);
}

export function buildScoreBreakdown(
  input: ScoreInput & { readonly remainingSeconds: number },
): ScoreBreakdown {
  const base = computeBaseScore(input.pairsFound, input.scoreMultiplier);
  const streakBonus = Math.max(0, input.streakPoints);
  const errorPenalty = computeErrorPenalty(input.errors);
  const timeBonus = computeTimeBonus(input.remainingSeconds);

  return {
    base,
    streakBonus,
    errorPenalty,
    timeBonus,
    total: Math.max(0, base + streakBonus - errorPenalty + timeBonus),
  };
}
