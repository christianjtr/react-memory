import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RecordsModal } from '@/features/records/components/RecordsModal';
import { createEmptyRecords } from '@/features/records/lib/recordsStore';

describe('RecordsModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <RecordsModal open={false} records={createEmptyRecords()} onClose={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the empty state', () => {
    render(<RecordsModal open records={createEmptyRecords()} onClose={vi.fn()} />);

    expect(screen.getByText('Todavía no jugaste ninguna partida.')).toBeInTheDocument();
    expect(screen.getByText('Mejor score global')).toBeInTheDocument();
  });

  it('renders the records of every difficulty', () => {
    const records = {
      ...createEmptyRecords(),
      globalBestScore: 1500,
      byDifficulty: {
        ...createEmptyRecords().byDifficulty,
        normal: {
          bestScore: 1200,
          bestTimeInSeconds: 42,
          bestAccuracy: 86,
          gamesPlayed: 5,
          wins: 3,
          totalPairs: 24,
          totalErrors: 4,
          bestStreak: 6,
        },
      },
    };

    render(<RecordsModal open records={records} onClose={vi.fn()} />);

    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText('42s')).toBeInTheDocument();
    expect(screen.getByText('86%')).toBeInTheDocument();
    expect(screen.getByText('5 partidas jugadas en total.')).toBeInTheDocument();
  });

  it('closes on demand', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<RecordsModal open records={createEmptyRecords()} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
