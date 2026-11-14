import type { RoundResult } from '@/features/game/lib/roundResult';
import { getDifficulty } from '@/features/game/lib/difficulty';
import type { ShareOutcome, SharePayload } from '../types';

export const REPOSITORY_URL = 'https://github.com/christianjtr/react-memory';

export const DEMO_URL = 'https://christianjtr.github.io/react-memory';

export const PREVIEW_IMAGE_URL =
  'https://opengraph.githubassets.com/1/christianjtr/react-memory';

const SHARE_TITLE = 'Github Memory';

export function buildSharePayload(
  result: RoundResult,
  nickname: string,
): SharePayload {
  const difficultyLabel = getDifficulty(result.difficulty).label;
  const player = nickname.length > 0 ? nickname : 'Un jugador';

  return {
    title: `${SHARE_TITLE} — ${player} sacó ${result.score} puntos`,
    text: [
      `En Github Memory saqué ${result.score} puntos en ${difficultyLabel} (${result.accuracy}% de precisión, mejor racha ×${result.bestStreak}).`,
      `Jugá el reto: ${DEMO_URL}`,
    ].join('\n'),
    url: REPOSITORY_URL,
    imageUrl: PREVIEW_IMAGE_URL,
  };
}

export function isShareSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard?.writeText === 'function'
  );
}

export async function fetchPreviewImage(
  imageUrl: string,
): Promise<File | null> {
  try {
    const response = await fetch(imageUrl, { mode: 'cors' });
    if (!response.ok) return null;

    const blob = await response.blob();

    return new File([blob], 'github-memory.png', {
      type: blob.type.length > 0 ? blob.type : 'image/png',
    });
  } catch {
    return null;
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (!isClipboardSupported()) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function sharePayload(payload: SharePayload): Promise<ShareOutcome> {
  if (isShareSupported()) {
    try {
      const image = await fetchPreviewImage(payload.imageUrl);

      if (image !== null && navigator.canShare?.({ files: [image] })) {
        await navigator.share({
          title: payload.title,
          text: payload.text,
          url: payload.url,
          files: [image],
        });

        return { status: 'shared' };
      }

      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });

      return { status: 'shared' };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { status: 'cancelled' };
      }

      const copied = await copyToClipboard(`${payload.text}\n${payload.url}`);

      return copied
        ? { status: 'copied' }
        : { status: 'failed', message: 'No se pudo compartir el resultado.' };
    }
  }

  const copied = await copyToClipboard(`${payload.text}\n${payload.url}`);

  return copied
    ? { status: 'copied' }
    : { status: 'failed', message: 'No se pudo copiar el enlace.' };
}
