import type { ReactElement } from 'react';
import { useGameState } from '../../hooks/useGameContext';

export function GameBoardFooter(): ReactElement | null {
  const { score, timer, status } = useGameState();

  if (status === 'idle') return null;

  return (
    <footer className="my-5 flex w-full flex-col gap-2 text-xl font-medium text-slate-700 sm:flex-row">
      <p className="sm:flex-1">Time: {timer}</p>
      <p className="sm:flex-1 sm:text-right" aria-live="polite">
        Score: {score}
      </p>
    </footer>
  );
}
