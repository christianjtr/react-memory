import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import type { ShareChannel, SharePayload, ShareStatus } from '../../types';

export interface ShareMenuProps {
  readonly payload: SharePayload | null;
  readonly cardUrl: string | null;
  readonly status: ShareStatus;
  readonly onShareTo: (channel: ShareChannel) => void;
  readonly onCopy: () => void;
  readonly onDownload: () => void;
  readonly onClose: () => void;
}

interface ShareMenuOption {
  readonly key: string;
  readonly label: string;
  readonly icon: ReactElement;
  readonly action: () => void;
  readonly disabled?: boolean;
}

const CHANNEL_ICONS: Record<ShareChannel, ReactElement> = {
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6a11.6 11.6 0 0 1-4.4-3.9c-.3-.5-.9-1.4-.9-2.6 0-1.2.6-1.8.9-2 .2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2c.1.2.1.4 0 .6l-.4.6-.3.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4.1.1.1.7-.2 1.3Z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M14 8.5V7a1 1 0 0 1 1-1h1.5V3H14a4 4 0 0 0-4 4v1.5H8V12h2v9h4v-9h2.3l.7-3.5H14Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M17.5 3h3.1l-6.8 7.8L21.9 21h-6.2l-4.9-6.4L5.2 21H2.1l7.3-8.3L2.4 3h6.4l4.4 5.8L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.8l10.6 14.3Z" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M21.9 4.3 19 19.4c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.9.4l.3-4.6 8.4-7.6c.4-.3-.1-.5-.5-.2L7.7 13.4l-4.4-1.4c-1-.3-1-1 .2-1.4l17-6.6c.8-.3 1.5.2 1.4 1.3Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6.5 8.8H3.4V21h3.1V8.8ZM5 3a1.9 1.9 0 1 0 0 3.8A1.9 1.9 0 0 0 5 3Zm9 8.3c0-1.2.6-2.1 2-2.1 1.3 0 1.9 1 1.9 2.1V21h3.1v-9.7c0-3-1.6-4.9-4.2-4.9-1.9 0-3 1-3.5 1.9V8.8h-2.4V21H14v-9.7Z" />
    </svg>
  ),
};

export function ShareMenu({
  payload,
  cardUrl,
  status,
  onShareTo,
  onCopy,
  onDownload,
  onClose,
}: ShareMenuProps): ReactElement {
  const channels: readonly ShareChannel[] = [
    'whatsapp',
    'facebook',
    'x',
    'telegram',
    'linkedin',
  ];

  const copyIcon: ReactElement = (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M9 9V5.5A1.5 1.5 0 0 1 10.5 4h8A1.5 1.5 0 0 1 20 5.5v8a1.5 1.5 0 0 1-1.5 1.5H15m-9.5 0v-8A1.5 1.5 0 0 1 7 5.5h5.5A1.5 1.5 0 0 1 14 7v11a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 3 18v-.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
  const downloadIcon: ReactElement = (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const options: readonly ShareMenuOption[] = [
    ...channels.map((channel) => ({
      key: channel,
      label:
        channel === 'x'
          ? 'Compartir en X'
          : `Compartir en ${channel.charAt(0).toUpperCase()}${channel.slice(1)}`,
      icon: CHANNEL_ICONS[channel],
      action: () => onShareTo(channel),
    })),
    {
      key: 'copy',
      label: status === 'copied' ? '¡Enlace copiado!' : 'Copiar enlace y texto',
      icon: copyIcon,
      action: onCopy,
      disabled: status === 'copied',
    },
    {
      key: 'download',
      label: 'Descargar tarjeta PNG',
      icon: downloadIcon,
      action: onDownload,
      disabled: cardUrl === null,
    },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar opciones de compartir"
        className="fixed inset-0 z-30 cursor-default"
        onClick={onClose}
      />
      <motion.div
        role="menu"
        aria-label="Opciones para compartir"
        className="absolute bottom-full left-1/2 z-40 mb-2 w-60 -translate-x-1/2 rounded-2xl border border-violet-200 bg-white p-2 shadow-xl"
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}>
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-bold text-violet-900 transition hover:bg-violet-100 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={option.disabled === true}
            onClick={option.action}>
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              {option.icon}
            </span>
            {option.label}
          </button>
        ))}
        {payload === null ? (
          <p className="px-3 pb-1 pt-1.5 text-xs font-semibold text-violet-500">
            Preparando el resultado...
          </p>
        ) : null}
      </motion.div>
    </>
  );
}
