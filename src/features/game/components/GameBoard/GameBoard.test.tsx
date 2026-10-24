import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GameBoard } from '@/features/game/components';
import { GameProvider } from '@/features/game/context/GameContext';
import * as githubApi from '@/features/contributors/api/github';
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
