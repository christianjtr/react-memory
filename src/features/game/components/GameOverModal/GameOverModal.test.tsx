import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GameOverModal } from '@/features/game/components';
import { renderWithGameState } from '@/test/renderWithGameState';

describe('GameOverModal', () => {
  it('does not render while the game is running', () => {
    const { container } = renderWithGameState(<GameOverModal onOk={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the final score and restarts the game', async () => {
    const onOk = vi.fn();
    const user = userEvent.setup();

    renderWithGameState(<GameOverModal onOk={onOk} />, {
      state: { isGameOver: true, status: 'finished', score: 600, outcome: 'lost' },
    });

    expect(screen.getByText('GAME OVER')).toBeInTheDocument();
    expect(screen.getByText('Se acabó el tiempo, ¡inténtalo de nuevo!')).toBeInTheDocument();
    expect(screen.getByText('Score: 600')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'New game!' }));

    expect(onOk).toHaveBeenCalledTimes(1);
  });

  it('celebrates a victory and prefers the final score', () => {
    renderWithGameState(<GameOverModal onOk={vi.fn()} />, {
      state: {
        isGameOver: true,
        status: 'finished',
        score: 900,
        finalScore: 1200,
        outcome: 'won',
      },
    });

    expect(screen.getByText('¡VICTORIA!')).toBeInTheDocument();
    expect(
      screen.getByText('Completaste todas las parejas a tiempo'),
    ).toBeInTheDocument();
    expect(screen.getByText('Score: 1200')).toBeInTheDocument();
  });

  it('restarts the game when the dialog is cancelled', () => {
    const onOk = vi.fn();

    renderWithGameState(<GameOverModal onOk={onOk} />, {
      state: { isGameOver: true, status: 'finished', score: 100 },
    });

    const dialog = screen.getByRole('dialog');

    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }));

    expect(onOk).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog when unmounted', () => {
    const onOk = vi.fn();
    const { unmount } = renderWithGameState(<GameOverModal onOk={onOk} />, {
      state: { isGameOver: true, status: 'finished', score: 100 },
    });

    expect(() => unmount()).not.toThrow();
  });
});
