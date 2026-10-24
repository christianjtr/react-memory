import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GameBoard } from '@/features/game/components';
import { GameProvider } from '@/features/game/context/GameContext';
import * as githubApi from '@/features/contributors/api/github';
import { clearGithubContributorsCache } from '@/features/contributors/hooks/useGithubContributors';
import type { Repository } from '@/features/contributors/types';
import { githubContributorsFixture } from '@/test/fixtures/contributors';
import type { GithubContributor } from '@/features/contributors/types';

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

function renderBoard() {
  return render(
    <GameProvider>
      <GameBoard />
    </GameProvider>,
  );
}

describe('GameBoard', () => {
  beforeEach(() => {
    fetchRepositoryContributorsMock.mockReset();
    clearGithubContributorsCache();
  });

  it('shows a loading state', async () => {
    let resolveRequest: (value: GithubContributor[]) => void = () => undefined;

    fetchRepositoryContributorsMock.mockReturnValue(
      new Promise<GithubContributor[]>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    renderBoard();

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Cargando contribuyentes...',
    );

    await act(async () => {
      resolveRequest(githubContributorsFixture);
    });

    expect(await screen.findAllByRole('button', { name: /boca abajo/ })).toHaveLength(12);
  });

  it('renders the board and resolves a matching pair', async () => {
    fetchRepositoryContributorsMock.mockResolvedValue(githubContributorsFixture);
    const user = userEvent.setup();

    renderBoard();

    const cards = await screen.findAllByRole('button', { name: /boca abajo/ });

    expect(cards).toHaveLength(12);
    expect(screen.getByText('Time: 60')).toBeInTheDocument();
    expect(screen.getByText('Score: 0')).toBeInTheDocument();

    await user.click(cards[0]!);
    await user.click(cards[1]!);

    expect(await screen.findByText('Score: 100')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /pareja encontrada/ })).toHaveLength(2);
  });

  it('restarts with the selected difficulty', async () => {
    fetchRepositoryContributorsMock.mockResolvedValue([
      ...githubContributorsFixture,
      {
        id: 7,
        login: 'octo-one',
        avatar_url: 'https://avatars.githubusercontent.com/u/7?v=4',
      },
      {
        id: 8,
        login: 'octo-two',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4',
      },
    ]);
    const user = userEvent.setup();

    renderBoard();
    await screen.findAllByRole('button', { name: /boca abajo/ });

    await user.click(screen.getByRole('button', { name: /Difícil/ }));

    expect(await screen.findAllByRole('button', { name: /boca abajo/ })).toHaveLength(16);
    expect(screen.getByText('Time: 45')).toBeInTheDocument();
  });

  it('completes the game and starts a new one', async () => {
    fetchRepositoryContributorsMock.mockResolvedValue(githubContributorsFixture);
    const user = userEvent.setup();

    renderBoard();

    const cards = await screen.findAllByRole('button', { name: /boca abajo/ });

    for (let index = 0; index < cards.length; index += 2) {
      await user.click(cards[index]!);
      await user.click(cards[index + 1]!);
    }

    const dialog = await screen.findByRole('dialog');

    expect(within(dialog).getByText('GAME OVER')).toBeInTheDocument();
    expect(within(dialog).getByText('Score: 600')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'New game!' }));

    await waitFor(() => {
      expect(fetchRepositoryContributorsMock).toHaveBeenCalledTimes(2);
    });
    const firstRepository = fetchRepositoryContributorsMock.mock
      .calls[0]?.[0] as Repository;
    const nextRepository = fetchRepositoryContributorsMock.mock
      .calls[1]?.[0] as Repository;
    expect(nextRepository).not.toEqual(firstRepository);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    expect(await screen.findAllByRole('button', { name: /boca abajo/ })).toHaveLength(12);
  });

  it('shows an API error and retries', async () => {
    fetchRepositoryContributorsMock.mockRejectedValueOnce(new Error('API caída'));
    const user = userEvent.setup();

    renderBoard();

    expect(await screen.findByRole('alert')).toHaveTextContent('API caída');

    fetchRepositoryContributorsMock.mockResolvedValue(githubContributorsFixture);

    await user.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findAllByRole('button', { name: /boca abajo/ })).toHaveLength(12);
  });

  it('shows a game error when there are not enough contributors', async () => {
    fetchRepositoryContributorsMock.mockResolvedValue([githubContributorsFixture[0]!]);

    renderBoard();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Se necesitan al menos 6 contribuyentes para iniciar la partida.',
    );
  });
});
