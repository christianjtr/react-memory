import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  formatRepository,
  isSameRepository,
  pickRandomRepository,
  REPOSITORY_POOL,
} from './repositories';

describe('repository randomizer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('formats repository identifiers as owner/name', () => {
    expect(formatRepository({ owner: 'vercel', name: 'next.js' })).toBe('vercel/next.js');
  });

  it('selects a repository from the curated pool', () => {
    const repository = pickRandomRepository();

    expect(REPOSITORY_POOL).toContainEqual(repository);
  });

  it('does not immediately repeat the current repository', () => {
    const currentRepository = REPOSITORY_POOL[0]!;
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const nextRepository = pickRandomRepository(currentRepository);

    expect(isSameRepository(nextRepository, currentRepository)).toBe(false);
    expect(nextRepository).toEqual(REPOSITORY_POOL[1]);
  });
});
