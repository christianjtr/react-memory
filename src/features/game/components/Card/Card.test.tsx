import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { contributorsFixture } from '@/test/fixtures/contributors';
import { Card } from '@/features/game/components';
import type { GameCard } from '../../types';

const contributor = contributorsFixture[0]!;
const faceDownCard: GameCard = {
  cardId: 0,
  contributor,
  isFaceDown: true,
  isMatched: false,
};

describe('Card', () => {
  it('renders a face-down card safely', () => {
    const onSelect = vi.fn();
    const { container } = render(<Card card={faceDownCard} onSelect={onSelect} />);

    const button = screen.getByRole('button', { name: 'Carta 1 boca abajo' });
    const image = container.querySelector('img');

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).not.toBeDisabled();
    expect(image).toHaveAttribute('src', contributor.avatarURL);
    expect(image).toHaveAttribute('alt', '');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(image).toHaveAttribute('width', '128');
    expect(image).toHaveAttribute('height', '128');
  });

  it('notifies the selected card id', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();

    render(<Card card={faceDownCard} onSelect={onSelect} />);
    await user.click(screen.getByRole('button', { name: 'Carta 1 boca abajo' }));

    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it('disables a flipped card', () => {
    render(<Card card={{ ...faceDownCard, isFaceDown: false }} onSelect={vi.fn()} />);

    const button = screen.getByRole('button', {
      name: `${contributor.loginName}, carta volteada`,
    });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('labels a matched card', () => {
    render(
      <Card
        card={{ ...faceDownCard, isFaceDown: false, isMatched: true }}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByRole('button', {
        name: `${contributor.loginName}, pareja encontrada`,
      }),
    ).toBeDisabled();
  });

  it('respects the disabled prop', () => {
    render(<Card card={faceDownCard} disabled onSelect={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Carta 1 boca abajo' })).toBeDisabled();
  });
});
