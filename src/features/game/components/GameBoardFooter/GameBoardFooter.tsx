import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useGameState } from '../../hooks/useGameContext';
import { TimerRing } from '../TimerRing/TimerRing';

export interface GameBoardFooterProps {
  bestScore?: number;
}

export function GameBoardFooter({
  bestScore = 0,
}: GameBoardFooterProps): ReactElement | null {
  const { score, timer, status, config, foundContributorIds } = useGameState();

  if (status === 'idle') return null;

  const progress = Math.min(
    1,
    foundContributorIds.length / Math.max(1, config.pairsOfCards),
  );

  return (
    <footer className="my-6 grid w-full gap-3 sm:grid-cols-[auto_1fr]">
      <div className="flex items-center gap-3 rounded-3xl border border-violet-200/70 bg-violet-50/85 p-3 shadow-card backdrop-blur-md sm:pr-5">
        <TimerRing
          timer={timer}
          total={config.durationInSeconds}
          isRunning={status === 'playing'}
        />
        <div className="hidden sm:block">
          <p className="text-[0.6rem] font-bold tracking-[0.22em] text-violet-500 uppercase">
            Reloj
          </p>
          <p className="text-sm font-semibold text-violet-800/80">
            {status === 'playing' ? 'La partida está en curso' : 'Partida terminada'}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center rounded-3xl border border-violet-200/70 bg-violet-50/85 p-4 shadow-card backdrop-blur-md">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.6rem] font-bold tracking-[0.22em] text-violet-500 uppercase">
              Puntaje
            </p>
            <motion.p
              key={score}
              className="text-2xl font-black text-ink tabular-nums"
              aria-live="polite"
              initial={{ scale: 0.82, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 420, damping: 20 }}>
              Score: {score}
            </motion.p>
          </div>

          <span className="rounded-xl bg-[linear-gradient(120deg,#ddd6fe,#a5f3fc)] px-3 py-1.5 text-xs font-black text-violet-900 ring-1 ring-violet-300/90">
            Récord: {bestScore > 0 ? bestScore : '—'}
          </span>
        </div>

        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-violet-200"
          role="progressbar"
          aria-label="Parejas encontradas"
          aria-valuemin={0}
          aria-valuemax={config.pairsOfCards}
          aria-valuenow={foundContributorIds.length}>
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#7c3aed,#d946ef_55%,#06b6d4)]"
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'spring', stiffness: 140, damping: 22 }}
          />
        </div>

        <p className="mt-2 text-[0.7rem] font-bold text-violet-600/80">
          {foundContributorIds.length} de {config.pairsOfCards} parejas encontradas
        </p>
      </div>
    </footer>
  );
}
