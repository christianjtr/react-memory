import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as githubApi from '@/features/contributors/api/github';
import { githubContributorsFixture } from '@/test/fixtures/contributors';
import App from './App';

vi.mock('@/lib/shuffle', () => ({
  shuffle: (items: unknown[]) => [...items],
}));

vi.mock('@/features/contributors/api/github', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@/features/contributors/api/github')>();

  return {
    ...actual,
    fetchRepositoryContributors: vi.fn(),
  };
});

const fetchRepositoryContributorsMock = vi.mocked(githubApi.fetchRepositoryContributors);

describe('App', () => {
  beforeEach(() => {
    fetchRepositoryContributorsMock.mockReset();
  });

  it('renders the game board', async () => {
    fetchRepositoryContributorsMock.mockResolvedValue(githubContributorsFixture);

    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Github Memory' }),
    ).toBeInTheDocument();
    expect(await screen.findAllByRole('button', { name: /boca abajo/ })).toHaveLength(12);
  });
});
