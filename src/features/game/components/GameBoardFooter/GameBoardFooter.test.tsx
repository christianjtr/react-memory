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

    expect(screen.getByText('60 s')).toBeInTheDocument();
    expect(screen.getByText('100', { selector: 'p' })).toBeInTheDocument();
  });

  it('shows the final score when the game is finished', () => {
    renderWithGameState(<GameBoardFooter />, {
      state: { status: 'finished', timer: 0, score: 950, finalScore: 1160 },
    });

    expect(screen.getByText('Puntaje final')).toBeInTheDocument();
    expect(screen.getByText('Partida terminada')).toBeInTheDocument();
    expect(screen.getByText('1160', { selector: 'p' })).toBeInTheDocument();
    expect(screen.queryByText('950', { selector: 'p' })).not.toBeInTheDocument();
  });
});
