import { describe, expect, it } from 'vitest';
import { DEFAULT_DIFFICULTY, DIFFICULTIES, getDifficulty } from './difficulty';

describe('difficulty presets', () => {
  it('defaults to normal difficulty', () => {
    expect(DEFAULT_DIFFICULTY).toBe('normal');
    expect(getDifficulty(DEFAULT_DIFFICULTY).config).toEqual({
      pairsOfCards: 6,
      durationInSeconds: 60,
      scoreMultiplier: 150,
    });
  });

  it('provides increasing pair counts across presets', () => {
    expect(DIFFICULTIES.map(({ config }) => config.pairsOfCards)).toEqual([4, 6, 8]);
  });

  it('rewards harder presets with a bigger score multiplier', () => {
    expect(DIFFICULTIES.map(({ config }) => config.scoreMultiplier)).toEqual([
      100, 150, 200,
    ]);
  });

  it('falls back to normal for unknown ids', () => {
    expect(getDifficulty('unknown' as never).id).toBe('normal');
  });
});
