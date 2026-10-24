import { motion } from 'motion/react';
import type { ReactElement } from 'react';

export interface GameBoardHeaderProps {
  title?: string;
}

export function GameBoardHeader({
  title = 'Github Memory',
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
        <span className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#7c3aed,#d946ef_52%,#0891b2)] shadow-glow-violet ring-1 ring-white/60">
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
        className="max-w-md text-sm font-semibold text-violet-800/75 sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.4 }}>
        Encontrá todas las parejas de contribuyentes y sumá la mayor cantidad de puntos.
      </motion.p>
    </header>
  );
}
