import { motion } from 'motion/react';
import type { ReactElement } from 'react';

export interface GameBoardHeaderProps {
  title?: string;
  repositoryName?: string;
  isShuffleDisabled?: boolean;
  onShuffle?: () => void;
}

export function GameBoardHeader({
  title = 'Github Memory',
  repositoryName,
  isShuffleDisabled = false,
  onShuffle,
}: GameBoardHeaderProps): ReactElement {
  return (
    <header className="flex flex-col items-center gap-3 pt-8 pb-5 text-center sm:pt-10">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}>
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl bg-fuchsia-400/60 blur-xl"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#5b21b6,#a21caf_52%,#0e7490)] shadow-glow-violet ring-1 ring-white/60">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-white">
            <path
              d="M12 2.5 14.2 9l6.3 2.2-6.3 2.2L12 20l-2.2-6.6L3.5 11.2 9.8 9 12 2.5Z"
              fill="currentColor"
            />
            <circle cx="19" cy="4.5" r="1.6" fill="currentColor" fillOpacity="0.75" />
          </svg>
        </span>
      </motion.div>

      <motion.h1
        className="animate-shimmer bg-[linear-gradient(90deg,#6d28d9,#d946ef_35%,#0891b2_65%,#6d28d9)] bg-[length:200%_auto] bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 220, damping: 22 }}>
        {title}
      </motion.h1>

      <motion.p
        className="max-w-md text-sm font-semibold text-violet-900/85 sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.4 }}>
        Encontrá las parejas de cada repositorio y sumá la mayor cantidad de puntos.
      </motion.p>

      {repositoryName !== undefined ? (
        <motion.div
          className="inline-flex max-w-full items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/90 py-1.5 pr-1.5 pl-3 text-xs font-bold text-violet-900 shadow-card backdrop-blur-md sm:text-sm"
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.22, type: 'spring', stiffness: 260, damping: 22 }}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 shrink-0 text-violet-600">
            <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.77 2.24 3.13 1.69.1-.72.4-1.21.7-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.34.75 1.01.75 2.04v3.02c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
          </svg>
          <span className="max-w-[13rem] truncate" title={repositoryName}>
            {repositoryName}
          </span>
          {onShuffle !== undefined ? (
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-200 text-violet-900 transition hover:bg-violet-300 hover:text-violet-950 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Elegir otro repositorio aleatorio"
              title="Elegir otro repositorio aleatorio"
              disabled={isShuffleDisabled}
              onClick={onShuffle}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path
                  d="M17 3h4v4M3 17l5-5m5-5 3-3m0 0h5M3 7l5 5m5 5 3 3m0 0h5v-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </header>
  );
}
