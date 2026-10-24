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
      state: { isGameOver: true, status: 'finished', score: 600 },
    });

    expect(screen.getByText('GAME OVER')).toBeInTheDocument();
    expect(screen.getByText('Score: 600')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'New game!' }));

    expect(onOk).toHaveBeenCalledTimes(1);
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
