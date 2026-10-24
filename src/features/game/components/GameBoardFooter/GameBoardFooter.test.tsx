import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameBoardFooter } from '@/features/game/components';
import { renderWithGameState } from '@/test/renderWithGameState';

describe('GameBoardFooter', () => {
  it('renders nothing while the game is idle', () => {
    const { container } = renderWithGameState(<GameBoardFooter />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the timer and score', () => {
    renderWithGameState(<GameBoardFooter />, {
      state: { status: 'playing', timer: 60, score: 100 },
    });

    expect(screen.getByText('Time: 60')).toBeInTheDocument();
    expect(screen.getByText('Score: 100')).toBeInTheDocument();
  });
});
