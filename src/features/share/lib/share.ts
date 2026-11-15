import type { RoundResult } from '@/features/game/lib/roundResult';
import { getDifficulty } from '@/features/game/lib/difficulty';
import {
  buildDailyShareCardModel,
  buildDailyShareRequest,
  renderDailyShareCard,
} from './dailyShareCard';
import type { ShareChannel, SharePayload } from '../types';

export const REPOSITORY_URL = 'https://github.com/christianjtr/react-memory';

export const DEMO_URL = 'https://christianjtr.github.io/react-memory';

export const PREVIEW_IMAGE_URL =
  'https://opengraph.githubassets.com/1/christianjtr/react-memory';

const SHARE_TITLE = 'Github Memory';

export function buildSharePayload(result: RoundResult, nickname: string): SharePayload {
  const difficultyLabel = getDifficulty(result.difficulty).label;
  const player = nickname.length > 0 ? nickname : 'Un jugador';

  return {
    title: `${SHARE_TITLE} — ${player} sacó ${result.score} puntos`,
    text: [
      `En Github Memory saqué ${result.score} puntos en ${difficultyLabel} (${result.accuracy}% de precisión, mejor racha ×${result.bestStreak}).`,
      `Jugá el reto: ${DEMO_URL}`,
    ].join('\n'),
    url: REPOSITORY_URL,
  };
}

export interface DailySharePrepared {
  readonly payload: SharePayload;
  readonly card: Blob | null;
  readonly cardFileName: string;
}

export async function buildDailyShare(result: RoundResult): Promise<DailySharePrepared> {
  const model = buildDailyShareCardModel(result);
  const card = await renderDailyShareCard(model);

  return {
    payload: buildDailyShareRequest(model),
    card,
    cardFileName: `github-memory-daily-${model.dateKey}.png`,
  };
}

export function buildShareText(payload: SharePayload): string {
  return `${payload.text}\n${payload.url}`;
}

const CHANNEL_BUILDERS: Record<ShareChannel, (payload: SharePayload) => string> = {
  whatsapp: (payload) =>
    `https://wa.me/?text=${encodeURIComponent(buildShareText(payload))}`,
  facebook: (payload) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url)}&quote=${encodeURIComponent(payload.text)}`,
  x: (payload) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(payload.text)}&url=${encodeURIComponent(payload.url)}`,
  telegram: (payload) =>
    `https://t.me/share/url?url=${encodeURIComponent(payload.url)}&text=${encodeURIComponent(payload.text)}`,
  linkedin: (payload) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(payload.url)}`,
};

export function buildChannelUrl(channel: ShareChannel, payload: SharePayload): string {
  return CHANNEL_BUILDERS[channel](payload);
}

export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard?.writeText === 'function'
  );
}

export async function copyShareText(payload: SharePayload): Promise<boolean> {
  if (!isClipboardSupported()) return false;

  try {
    await navigator.clipboard.writeText(buildShareText(payload));
    return true;
  } catch {
    return false;
  }
}

export function downloadBlob(blobUrl: string, fileName: string): void {
  const anchor = document.createElement('a');

  anchor.href = blobUrl;
  anchor.download = fileName;
  anchor.click();
}
