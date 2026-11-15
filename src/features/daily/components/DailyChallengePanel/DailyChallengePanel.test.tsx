import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { formatRepository } from '@/features/contributors/lib/repositories';
import { buildDailyChallenge } from '../../lib/dailyChallenge';
import { DailyChallengePanel } from './DailyChallengePanel';

const challenge = buildDailyChallenge('2026-01-01');
const challengeLabel = `${formatRepository(challenge.repository)} · Normal · un intento por día`;

describe('DailyChallengePanel', () => {
  it('shows the challenge and the play button before playing', async () => {
    const onPlay = vi.fn();
    const user = userEvent.setup();

    render(
      <DailyChallengePanel
        challenge={challenge}
        hasPlayedToday={false}
        todayScore={null}
        bestScore={0}
        streak={3}
        secondsUntilNext={3661}
        onPlay={onPlay}
      />,
    );

    expect(screen.getByRole('region', { name: 'Reto diario' })).toBeInTheDocument();
    expect(screen.getByText(challengeLabel)).toBeInTheDocument();

    const playButton = screen.getByRole('button', { name: 'Jugar el reto' });
    await user.click(playButton);

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('disables the play button while requested', () => {
    render(
      <DailyChallengePanel
        challenge={challenge}
        hasPlayedToday={false}
        todayScore={null}
        bestScore={0}
        streak={3}
        secondsUntilNext={3661}
        isPlayDisabled
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Jugar el reto' })).toBeDisabled();
  });

  it('shows today score and the countdown after playing', () => {
    render(
      <DailyChallengePanel
        challenge={challenge}
        hasPlayedToday
        todayScore={900}
        bestScore={1200}
        streak={1}
        secondsUntilNext={125}
        onPlay={vi.fn()}
      />,
    );

    expect(screen.getByText('Hoy: 900 pts')).toBeInTheDocument();
    expect(screen.getByText('Nuevo reto en 2 min 5 s')).toBeInTheDocument();
    expect(screen.getByText('Racha: 1 día · Mejor diario: 1200 pts')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Jugar el reto' }),
    ).not.toBeInTheDocument();
  });
});
