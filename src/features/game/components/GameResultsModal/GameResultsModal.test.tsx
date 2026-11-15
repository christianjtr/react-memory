import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GameResultsModal } from '@/features/game/components';
import { resolveGameConfig } from '@/features/game/context/gameState';
import { renderWithGameState } from '@/test/renderWithGameState';
import type { GameState } from '@/features/game/types';

const repository = { owner: 'facebook', name: 'react' } as const;

const finishedState: Partial<GameState> = {
  status: 'finished',
  isGameOver: true,
  outcome: 'won',
  score: 950,
  finalScore: 1160,
  config: resolveGameConfig({
    durationInSeconds: 60,
    pairsOfCards: 6,
    scoreMultiplier: 150,
  }),
  foundContributorIds: [1, 2, 3, 4, 5, 6],
  errors: 1,
  moves: 7,
  streak: 6,
  bestStreak: 6,
  streakPoints: 75,
  timer: 42,
  round: { mode: 'classic', difficulty: 'normal', repository, startedAt: 1 },
};

describe('GameResultsModal', () => {
  it('does not render while the game is running', () => {
    const { container } = renderWithGameState(<GameResultsModal onOk={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('celebrates a victory with the score breakdown', () => {
    renderWithGameState(<GameResultsModal onOk={vi.fn()} nickname="ada" />, {
      state: finishedState,
    });

    expect(screen.getByText('¡VICTORIA!')).toBeInTheDocument();
    expect(
      screen.getByText('Completaste todas las parejas a tiempo'),
    ).toBeInTheDocument();
    expect(screen.getByText('ada')).toBeInTheDocument();
    expect(screen.getByText('Score: 1160')).toBeInTheDocument();
    expect(screen.getByText('+900')).toBeInTheDocument();
    expect(screen.getByText('+75')).toBeInTheDocument();
    expect(screen.getByText('+210')).toBeInTheDocument();
    expect(screen.getByText('−25')).toBeInTheDocument();
  });

  it('shows the round statistics', () => {
    renderWithGameState(<GameResultsModal onOk={vi.fn()} />, {
      state: finishedState,
    });

    expect(screen.getByText('18s')).toBeInTheDocument();
    expect(screen.getByText('86%')).toBeInTheDocument();
    expect(screen.getByText('6/6')).toBeInTheDocument();
    expect(screen.getByText('facebook/react')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
  });

  it('reports a loss when the time runs out', () => {
    renderWithGameState(<GameResultsModal onOk={vi.fn()} />, {
      state: {
        ...finishedState,
        outcome: 'lost',
        timer: 0,
        finalScore: 950,
      },
    });

    expect(screen.getByText('GAME OVER')).toBeInTheDocument();
    expect(
      screen.getByText('Se acabó el tiempo, ¡inténtalo de nuevo!'),
    ).toBeInTheDocument();
    expect(screen.getByText('Score: 950')).toBeInTheDocument();
  });

  it('restarts the game from the primary action', async () => {
    const onOk = vi.fn();
    const user = userEvent.setup();

    renderWithGameState(<GameResultsModal onOk={onOk} />, { state: finishedState });

    await user.click(screen.getByRole('button', { name: 'New game!' }));

    expect(onOk).toHaveBeenCalledTimes(1);
  });

  it('opens the records panel when requested', async () => {
    const onOpenRecords = vi.fn();
    const user = userEvent.setup();

    renderWithGameState(
      <GameResultsModal onOk={vi.fn()} onOpenRecords={onOpenRecords} />,
      { state: finishedState },
    );

    await user.click(screen.getByRole('button', { name: 'Récords' }));

    expect(onOpenRecords).toHaveBeenCalledTimes(1);
  });

  it('copies only the game link and closes the share menu', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    renderWithGameState(<GameResultsModal onOk={vi.fn()} />, { state: finishedState });

    await user.click(screen.getByRole('button', { name: 'Compartir' }));
    expect(
      screen.getByRole('menu', { name: 'Opciones para compartir' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('menuitem', { name: 'Copiar enlace' }));

    expect(writeText).toHaveBeenCalledExactlyOnceWith(
      'https://github.com/christianjtr/react-memory',
    );
    expect(
      screen.queryByRole('menu', { name: 'Opciones para compartir' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Enlace copiado al portapapeles.')).toBeInTheDocument();
  });
});
