import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameBoardHeader } from '@/features/game/components';

describe('GameBoardHeader', () => {
  it('renders the default title', () => {
    render(<GameBoardHeader />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Github Memory');
  });

  it('renders a custom title', () => {
    render(<GameBoardHeader title="Custom title" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Custom title');
  });
});
