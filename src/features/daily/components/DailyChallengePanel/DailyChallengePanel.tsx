import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { formatRepository } from '@/features/contributors/lib/repositories';
import { formatDailyCountdown, getDailyDifficultyLabel } from '../../lib/dailyChallenge';
import type { DailyChallenge } from '../../types';

export interface DailyChallengePanelProps {
  readonly challenge: DailyChallenge;
  readonly hasPlayedToday: boolean;
  readonly todayScore: number | null;
  readonly bestScore: number;
  readonly streak: number;
  readonly secondsUntilNext: number;
  readonly isPlayDisabled?: boolean;
  readonly onPlay?: () => void;
}

export function DailyChallengePanel({
  challenge,
  hasPlayedToday,
  todayScore,
  bestScore,
  streak,
  secondsUntilNext,
  isPlayDisabled = false,
  onPlay,
}: DailyChallengePanelProps): ReactElement {
  return (
    <motion.section
      aria-label="Reto diario"
      className="mb-4 rounded-3xl border border-fuchsia-200/80 bg-[linear-gradient(120deg,rgba(250,245,255,0.95),rgba(245,240,255,0.9)_55%,rgba(240,253,255,0.95))] p-4 shadow-card backdrop-blur-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 22 }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#a21caf,#5b21b6)] text-white shadow-card">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm12 8v9H5v-9h14Zm-7 1.3-1.2 2.4-2.7.4 2 1.9-.5 2.7 2.4-1.3 2.4 1.3-.5-2.7 2-1.9-2.7-.4L12 11.3Z" />
            </svg>
          </span>
          <div className="min-w-0 text-left">
            <p className="text-sm font-black text-violet-950">Reto diario</p>
            <p className="truncate text-xs font-semibold text-violet-700/85">
              {formatRepository(challenge.repository)} · {getDailyDifficultyLabel()} · un
              intento por día
            </p>
          </div>
        </div>

        {hasPlayedToday ? (
          <div className="text-right">
            <p className="text-sm font-black text-violet-950">
              Hoy: {todayScore ?? 0} pts
            </p>
            <p className="text-xs font-semibold text-violet-700/85">
              Nuevo reto en {formatDailyCountdown(secondsUntilNext)}
            </p>
            <p className="text-[0.65rem] font-semibold text-fuchsia-600">
              Racha: {streak} {streak === 1 ? 'día' : 'días'} · Mejor diario: {bestScore}{' '}
              pts
            </p>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7c3aed,#a21caf)] px-5 py-2.5 text-xs font-black text-white shadow-[0_14px_30px_-14px_rgb(124_58_237_/_0.9)] transition hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            disabled={isPlayDisabled}
            onClick={onPlay}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
            Jugar el reto
          </button>
        )}
      </div>
    </motion.section>
  );
}
