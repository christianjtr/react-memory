import { useEffect, useRef, type ReactElement, type SyntheticEvent } from 'react';
import { useGameState } from '../../hooks/useGameContext';

export interface GameOverModalProps {
  onOk: () => void;
}

export function GameOverModal({ onOk }: GameOverModalProps): ReactElement | null {
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
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/75"
      aria-labelledby="game-over-title"
      onCancel={handleCancel}>
      <div className="px-6 py-8 text-center">
        <h2 id="game-over-title" className="text-4xl font-bold tracking-wide">
          GAME OVER
        </h2>
        <p className="my-5 text-2xl">Score: {score}</p>
        <button
          type="button"
          className="rounded-lg bg-sky-600 px-5 py-2.5 font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-900"
          autoFocus
          onClick={onOk}>
          New game!
        </button>
      </div>
    </dialog>
  );
}
