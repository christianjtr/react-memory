import {
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type SyntheticEvent,
} from 'react';
import { motion } from 'motion/react';
import { ConfettiBurst } from '@/components/ui/ConfettiBurst';
import { useShare } from '@/features/share/hooks/useShare';
import { useGameState } from '../../hooks/useGameContext';
import { getDifficulty } from '../../lib/difficulty';
import { buildRoundResult } from '../../lib/roundResult';
import { ScoreBreakdownList } from './ScoreBreakdownList';

export interface GameResultsModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onOk: () => void;
  readonly onOpenRecords?: () => void;
  readonly bestScore?: number;
  readonly isNewRecord?: boolean;
  readonly nickname?: string;
}

interface StatItem {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export function GameResultsModal({
  open,
  onClose,
  onOk,
  onOpenRecords,
  bestScore = 0,
  isNewRecord = false,
  nickname,
}: GameResultsModalProps): ReactElement | null {
  const gameState = useGameState();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const result = buildRoundResult(gameState);
  const isVictory = result?.outcome === 'won';
  const { status: shareStatus, copyLink, reset: resetShare } = useShare();
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);

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
      resetShare();
    };
  }, [open, resetShare]);

  if (!open || result === null) return null;

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault();
    onClose();
  };

  const handleShareToggle = (): void => {
    setIsShareMenuOpen((open) => !open);
  };

  const handleCopyLink = async (): Promise<void> => {
    await copyLink();
    setIsShareMenuOpen(false);
  };

  const closeShareMenu = (): void => {
    setIsShareMenuOpen(false);
    resetShare();
  };

  const stats: StatItem[] = [
    {
      key: 'time',
      label: 'Tiempo',
      value: `${result.elapsedSeconds}s`,
    },
    { key: 'errors', label: 'Errores', value: `${result.errors}` },
    { key: 'accuracy', label: 'Precisión', value: `${result.accuracy}%` },
    {
      key: 'pairs',
      label: 'Parejas',
      value: `${result.pairsFound}/${gameState.config.pairsOfCards}`,
    },
    { key: 'streak', label: 'Mejor racha', value: `${result.bestStreak}` },
    {
      key: 'difficulty',
      label: 'Dificultad',
      value: getDifficulty(result.difficulty).label,
    },
    { key: 'repo', label: 'Repositorio', value: result.repositoryLabel },
  ];

  return (
    <dialog
      ref={dialogRef}
      className="m-auto max-h-[92vh] w-[calc(100%-2rem)] max-w-lg border-0 bg-transparent p-0 text-ink backdrop:bg-violet-950/45 backdrop:backdrop-blur-sm"
      aria-labelledby="game-over-title"
      onCancel={handleCancel}>
      <ConfettiBurst active={isVictory} />

      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-violet-200/70 bg-violet-50/95 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.86, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}>
        <button
          type="button"
          aria-label="Cerrar resultados"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-violet-700 shadow-sm transition hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          onClick={onClose}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-16 h-48 w-48 rounded-full bg-fuchsia-300/50 blur-2xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -bottom-24 h-52 w-52 rounded-full bg-cyan-300/50 blur-2xl"
        />

        <div className="relative max-h-[88vh] overflow-y-auto px-6 py-8 text-center">
          <motion.div
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#5b21b6,#a21caf_55%,#0e7490)] shadow-glow-violet ring-1 ring-white/60"
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
            {isVictory ? '¡VICTORIA!' : 'GAME OVER'}
          </h2>

          <p className="mt-2 text-sm font-bold text-violet-600/85">
            {isVictory
              ? 'Completaste todas las parejas a tiempo'
              : 'Se acabó el tiempo, ¡inténtalo de nuevo!'}
          </p>

          {nickname !== undefined && nickname.length > 0 ? (
            <p className="mt-1 text-sm font-black text-violet-900">{nickname}</p>
          ) : null}

          {isNewRecord ? (
            <motion.p
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-black tracking-wide text-amber-800 uppercase ring-1 ring-amber-300"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 380, damping: 16 }}>
              ¡Nuevo récord!
            </motion.p>
          ) : null}

          <p className="my-4 text-3xl font-black text-violet-900">
            Score: {result.score}
          </p>

          {bestScore > 0 ? (
            <p className="-mt-2 mb-4 text-sm font-bold text-violet-600/80">
              Récord: {bestScore}
            </p>
          ) : null}

          <ScoreBreakdownList result={result} />

          <dl className="mx-auto mt-5 grid w-full max-w-sm grid-cols-2 gap-2 text-left sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl bg-white/70 px-3 py-2 ring-1 ring-violet-200/70">
                <dt className="text-[0.6rem] font-bold tracking-[0.16em] text-violet-500 uppercase">
                  {stat.label}
                </dt>
                <dd className="truncate text-sm font-black text-violet-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="relative">
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={isShareMenuOpen}
                className="rounded-2xl border border-violet-300 bg-white/80 px-5 py-3 text-base font-black text-violet-800 transition hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
                onClick={handleShareToggle}>
                Compartir
              </button>
              {isShareMenuOpen ? (
                <>
                  <button
                    type="button"
                    aria-label="Cerrar opciones de compartir"
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={closeShareMenu}
                  />
                  <div
                    role="menu"
                    aria-label="Opciones para compartir"
                    className="absolute bottom-full left-1/2 z-40 mb-2 w-56 -translate-x-1/2 rounded-2xl border border-violet-200 bg-white p-2 shadow-xl">
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold text-violet-900 transition hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                      onClick={() => void handleCopyLink()}>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4">
                        <path
                          d="M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7m2.7 6.4a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Copiar enlace
                    </button>
                  </div>
                </>
              ) : null}
            </div>
            {onOpenRecords !== undefined ? (
              <button
                type="button"
                className="rounded-2xl border border-violet-300 bg-white/80 px-5 py-3 text-base font-black text-violet-800 transition hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
                onClick={onOpenRecords}>
                Récords
              </button>
            ) : null}
            <button
              type="button"
              className="rounded-2xl bg-[linear-gradient(120deg,#5b21b6,#a21caf_55%,#0e7490)] px-6 py-3 text-base font-black text-white shadow-glow-violet transition hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
              autoFocus
              onClick={onOk}>
              New game!
            </button>
          </div>

          <p
            className="mt-3 min-h-5 text-sm font-bold text-violet-600/85"
            aria-live="polite">
            {shareStatus === 'copied' ? 'Enlace copiado al portapapeles.' : null}
            {shareStatus === 'failed'
              ? 'No se pudo copiar el enlace al portapapeles.'
              : null}
          </p>
        </div>
      </motion.div>
    </dialog>
  );
}
