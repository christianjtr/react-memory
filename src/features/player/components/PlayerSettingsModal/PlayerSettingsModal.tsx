import { useEffect, useRef, useState, type ReactElement, type SyntheticEvent } from 'react';
import { motion } from 'motion/react';
import { MAX_NICKNAME_LENGTH } from '../../types';

export interface PlayerSettingsModalProps {
  readonly open: boolean;
  readonly nickname: string;
  readonly onClose: () => void;
  readonly onSave: (nickname: string) => void;
}

export function PlayerSettingsModal({
  open,
  nickname,
  onClose,
  onSave,
}: PlayerSettingsModalProps): ReactElement | null {
  const [draft, setDraft] = useState(nickname);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    setDraft(nickname);
  }, [nickname, open]);

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

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSave(draft);
    onClose();
  };

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>): void => {
    event.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[calc(100%-2rem)] max-w-md border-0 bg-transparent p-0 text-ink backdrop:bg-violet-950/45 backdrop:backdrop-blur-sm"
      aria-labelledby="player-settings-title"
      onCancel={handleCancel}>
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-violet-200/70 bg-violet-50/95 p-6 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -right-16 h-44 w-44 rounded-full bg-cyan-300/40 blur-2xl"
        />

        <div className="relative">
          <h2
            id="player-settings-title"
            className="bg-[linear-gradient(90deg,#6d28d9,#d946ef_50%,#0891b2)] bg-clip-text text-2xl font-black tracking-wide text-transparent">
            Tu identidad
          </h2>
          <p className="mt-1 text-sm font-semibold text-violet-600/80">
            El apodo aparece en tus resultados y al compartir.
          </p>

          <form onSubmit={handleSubmit} className="mt-5">
            <label
              htmlFor="nickname"
              className="text-[0.65rem] font-bold tracking-[0.22em] text-violet-500 uppercase">
              Apodo
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              value={draft}
              maxLength={MAX_NICKNAME_LENGTH}
              autoComplete="nickname"
              placeholder="Tu apodo"
              onChange={(event) => setDraft(event.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-violet-200 bg-white/85 px-4 py-3 text-lg font-bold text-violet-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-300/70"
            />

            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="rounded-2xl border border-violet-300 bg-white/80 px-5 py-2.5 text-sm font-black text-violet-800 transition hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600"
                onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[linear-gradient(120deg,#5b21b6,#a21caf_55%,#0e7490)] px-5 py-2.5 text-sm font-black text-white shadow-glow-violet transition hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </dialog>
  );
}
