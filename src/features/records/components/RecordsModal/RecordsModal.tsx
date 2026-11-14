import { useEffect, useRef, type ReactElement, type SyntheticEvent } from 'react';
import { motion } from 'motion/react';
import { DIFFICULTIES } from '@/features/game/lib/difficulty';
import type { RecordsState } from '../../types';

export interface RecordsModalProps {
  readonly open: boolean;
  readonly records: RecordsState;
  readonly onClose: () => void;
}

function formatSeconds(seconds: number | null): string {
  if (seconds === null) return '—';

  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${minutes}m ${remainder}s`;
}

export function RecordsModal({
  open,
  records,
  onClose,
}: RecordsModalProps): ReactElement | null {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  if (!open) return null;

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault();
    onClose();
  };

  const totalGames = DIFFICULTIES.reduce(
    (total, difficulty) => total + records.byDifficulty[difficulty.id].gamesPlayed,
    0,
  );

  return (
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl border-0 bg-transparent p-0 text-ink backdrop:bg-violet-950/45 backdrop:backdrop-blur-sm"
      aria-labelledby="records-title"
      onCancel={handleCancel}>
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-violet-200/70 bg-violet-50/95 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-16 h-48 w-48 rounded-full bg-fuchsia-300/50 blur-2xl"
        />

        <div className="relative max-h-[86vh] overflow-y-auto px-5 py-7 sm:px-8">
          <h2
            id="records-title"
            className="bg-[linear-gradient(90deg,#6d28d9,#d946ef_50%,#0891b2)] bg-clip-text text-3xl font-black tracking-wide text-transparent">
            Tus récords
          </h2>
          <p className="mt-1 text-sm font-semibold text-violet-600/80">
            {totalGames === 0
              ? 'Todavía no jugaste ninguna partida.'
              : `${totalGames} ${totalGames === 1 ? 'partida jugada' : 'partidas jugadas'} en total.`}
          </p>

          <div className="mt-5 flex items-center justify-between rounded-3xl border border-amber-300/70 bg-amber-50/90 px-5 py-4">
            <span className="text-[0.65rem] font-bold tracking-[0.22em] text-amber-700 uppercase">
              Mejor score global
            </span>
            <span className="text-3xl font-black text-amber-900 tabular-nums">
              {records.globalBestScore > 0 ? records.globalBestScore : '—'}
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {DIFFICULTIES.map((difficulty) => {
              const entry = records.byDifficulty[difficulty.id];

              return (
                <section
                  key={difficulty.id}
                  className="rounded-3xl border border-violet-200/70 bg-white/80 p-4 shadow-sm">
                  <h3 className="text-base font-black text-violet-900">
                    {difficulty.label}
                  </h3>
                  <p className="text-[0.65rem] font-semibold text-violet-500/80">
                    {difficulty.description}
                  </p>

                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-violet-600/80">Mejor score</dt>
                      <dd className="font-black text-violet-900 tabular-nums">
                        {entry.bestScore > 0 ? entry.bestScore : '—'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-violet-600/80">Mejor tiempo</dt>
                      <dd className="font-black text-violet-900 tabular-nums">
                        {formatSeconds(entry.bestTimeInSeconds)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-violet-600/80">Mejor precisión</dt>
                      <dd className="font-black text-violet-900 tabular-nums">
                        {entry.bestAccuracy === null ? '—' : `${entry.bestAccuracy}%`}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-violet-600/80">Mejor racha</dt>
                      <dd className="font-black text-violet-900 tabular-nums">
                        {entry.bestStreak > 0 ? entry.bestStreak : '—'}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-violet-600/80">Partidas</dt>
                      <dd className="font-black text-violet-900 tabular-nums">
                        {entry.gamesPlayed}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="font-semibold text-violet-600/80">Victorias</dt>
                      <dd className="font-black text-violet-900 tabular-nums">
                        {entry.wins}
                      </dd>
                    </div>
                  </dl>
                </section>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-2xl bg-[linear-gradient(120deg,#5b21b6,#a21caf_55%,#0e7490)] px-6 py-3 text-base font-black text-white shadow-glow-violet transition hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
              onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </motion.div>
    </dialog>
  );
}
