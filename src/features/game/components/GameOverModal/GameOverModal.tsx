import { useEffect, useRef, type ReactElement, type SyntheticEvent } from 'react';
import { motion } from 'motion/react';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';
import { useGameState } from '../../hooks/useGameContext';

export interface GameOverModalProps {
  onOk: () => void;
  bestScore?: number;
  isNewRecord?: boolean;
}

export function GameOverModal({
  onOk,
  bestScore = 0,
  isNewRecord = false,
}: GameOverModalProps): ReactElement | null {
  const { isGameOver, score } = useGameState();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isGameOver) return;

    const dialog = dialogRef.current;
    if (dialog === null) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute('open', '');
    }

    return () => {
      if (dialog.open) {
        try {
          dialog.close();
        } catch {
          dialog.removeAttribute('open');
        }
      }

      previousFocusRef.current?.focus();
    };
  }, [isGameOver]);

  if (!isGameOver) return null;

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault();
    onOk();
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[calc(100%-2rem)] max-w-lg border-0 bg-transparent p-0 text-ink backdrop:bg-violet-950/35 backdrop:backdrop-blur-sm"
      aria-labelledby="game-over-title"
      onCancel={handleCancel}>
      <ConfettiBurst active={isGameOver} />

      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.86, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-16 h-48 w-48 rounded-full bg-fuchsia-300/50 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -bottom-24 h-52 w-52 rounded-full bg-cyan-300/50 blur-2xl"
        />

        <div className="relative px-6 py-8 text-center">
          <motion.div
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#7c3aed,#d946ef_55%,#0891b2)] shadow-glow-violet ring-1 ring-white/60"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 320, damping: 16 }}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-8 w-8 text-white">
              <path
                d="M7 4h10v3a5 5 0 0 1-10 0V4Z"
                fill="currentColor"
                fillOpacity="0.95"
              />
              <path
                d="M6 5H4.5A1.5 1.5 0 0 0 3 6.5C3 9 5 10 7 10M18 5h1.5A1.5 1.5 0 0 1 21 6.5C21 9 19 10 17 10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M12 12v4m-3 4h6m-5-4h4l.6 2.2a1 1 0 0 1-1 1.3h-3.2a1 1 0 0 1-1-1.3L10 16Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <h2
            id="game-over-title"
            className="bg-[linear-gradient(90deg,#6d28d9,#d946ef_50%,#0891b2)] bg-clip-text text-4xl font-black tracking-wide text-transparent">
            GAME OVER
          </h2>

          {isNewRecord ? (
            <motion.p
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black tracking-wide text-amber-800 uppercase ring-1 ring-amber-300"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 380, damping: 16 }}>
              ¡Nuevo récord!
            </motion.p>
          ) : null}

          <p className="my-5 text-2xl font-black text-violet-900">Score: {score}</p>

          {bestScore > 0 ? (
            <p className="-mt-3 mb-5 text-sm font-bold text-violet-600/80">
              Récord: {bestScore}
            </p>
          ) : null}

          <button
            type="button"
            className="rounded-2xl bg-[linear-gradient(120deg,#7c3aed,#d946ef_55%,#0891b2)] px-6 py-3 text-base font-black text-white shadow-glow-violet transition hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
            autoFocus
            onClick={onOk}>
            New game!
          </button>
        </div>
      </motion.div>
    </dialog>
  );
}
