import { describe, expect, it } from 'vitest';
import {
  SCORING_RULES,
  buildScoreBreakdown,
  computeAccuracy,
  computeBaseScore,
  computeErrorPenalty,
  computeLiveScore,
  computeStreakBonusForLevel,
  computeTimeBonus,
} from './scoring';

describe('scoring', () => {
  it('computes the base score from pairs and the difficulty multiplier', () => {
    expect(computeBaseScore(6, 150)).toBe(900);
    expect(computeBaseScore(0, 150)).toBe(0);
    expect(computeBaseScore(-1, 150)).toBe(0);
  });

  it('ramps the streak bonus with the combo level', () => {
    expect(computeStreakBonusForLevel(1)).toBe(0);
    expect(computeStreakBonusForLevel(2)).toBe(SCORING_RULES.streakBonusPerLevel);
    expect(computeStreakBonusForLevel(5)).toBe(4 * SCORING_RULES.streakBonusPerLevel);
    expect(computeStreakBonusForLevel(0)).toBe(0);
  });

  it('computes the time bonus from the remaining seconds', () => {
    expect(computeTimeBonus(30)).toBe(30 * SCORING_RULES.timeBonusPerSecond);
    expect(computeTimeBonus(0)).toBe(0);
    expect(computeTimeBonus(-5)).toBe(0);
  });

  it('computes the penalty from the number of errors', () => {
    expect(computeErrorPenalty(3)).toBe(3 * SCORING_RULES.errorPenalty);
    expect(computeErrorPenalty(0)).toBe(0);
  });

  it('computes accuracy from matches and errors', () => {
    expect(computeAccuracy(6, 0)).toBe(100);
    expect(computeAccuracy(3, 3)).toBe(50);
    expect(computeAccuracy(0, 0)).toBe(0);
    expect(computeAccuracy(0, 4)).toBe(0);
  });

  it('keeps the live score at zero when the penalty exceeds the base', () => {
    expect(
      computeLiveScore({
        pairsFound: 1,
        errors: 8,
        streakPoints: 0,
        scoreMultiplier: 100,
      }),
    ).toBe(0);
  });

  it('computes the live score without the time bonus', () => {
    expect(
      computeLiveScore({
        pairsFound: 6,
        errors: 1,
        streakPoints: 25,
        scoreMultiplier: 150,
      }),
    ).toBe(900 + 25 - 25);
  });

  it('builds the full breakdown for the results screen', () => {
    const breakdown = buildScoreBreakdown({
      pairsFound: 6,
      errors: 2,
      streakPoints: 25,
      scoreMultiplier: 150,
      remainingSeconds: 20,
    });

    expect(breakdown).toEqual({
      base: 900,
      streakBonus: 25,
      errorPenalty: 50,
      timeBonus: 100,
      total: 975,
    });
  });

  it('never returns a negative total', () => {
    const breakdown = buildScoreBreakdown({
      pairsFound: 1,
      errors: 10,
      streakPoints: 0,
      scoreMultiplier: 100,
      remainingSeconds: 0,
    });

    expect(breakdown.total).toBe(0);
  });
});
