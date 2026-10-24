import { describe, expect, it } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const result = shuffle(input);

    expect(result).not.toBe(input);
    expect([...result].sort()).toEqual([...copy].sort());
    expect(input).toEqual(copy);
  });

  it('handles empty and single-item collections', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(['only'])).toEqual(['only']);
  });
});
