import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RoundResult } from '@/features/game/lib/roundResult';
import {
  DEMO_URL,
  PREVIEW_IMAGE_URL,
  REPOSITORY_URL,
  buildSharePayload,
  fetchPreviewImage,
  isClipboardSupported,
  isShareSupported,
  sharePayload,
} from './share';

const result: RoundResult = {
  mode: 'classic',
  difficulty: 'normal',
  repositoryLabel: 'facebook/react',
  outcome: 'won',
  score: 1160,
  base: 900,
  streakBonus: 75,
  errorPenalty: 25,
  timeBonus: 210,
  pairsFound: 6,
  errors: 1,
  moves: 7,
  bestStreak: 6,
  accuracy: 86,
  elapsedSeconds: 18,
};

function installNavigator(options: {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data?: ShareData) => boolean;
  clipboard?: boolean;
} = {}) {
  const share = vi.fn(options.share ?? (async () => undefined));
  const canShare = vi.fn(options.canShare ?? (() => true));
  const writeText = vi.fn(async () => undefined);

  Object.defineProperty(navigator, 'share', {
    value: share,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(navigator, 'canShare', {
    value: canShare,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(navigator, 'clipboard', {
    value: options.clipboard === false ? undefined : { writeText },
    configurable: true,
    writable: true,
  });

  return { share, canShare, writeText };
}

function stubFetch(response: Partial<Response> | Error): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      if (response instanceof Error) throw response;
      return response;
    }),
  );
}

describe('share', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'share');
    Reflect.deleteProperty(navigator, 'canShare');
    Reflect.deleteProperty(navigator, 'clipboard');
  });

  it('builds a payload with the player score and the demo link', () => {
    const payload = buildSharePayload(result, 'ada');

    expect(payload.title).toContain('Github Memory');
    expect(payload.title).toContain('ada');
    expect(payload.title).toContain('1160');
    expect(payload.text).toContain('1160 puntos');
    expect(payload.text).toContain('86%');
    expect(payload.text).toContain(DEMO_URL);
    expect(payload.url).toBe(REPOSITORY_URL);
    expect(payload.imageUrl).toBe(PREVIEW_IMAGE_URL);
  });

  it('falls back to a generic player name', () => {
    expect(buildSharePayload(result, '').title).toContain('Un jugador');
  });

  it('detects the available share APIs', () => {
    installNavigator();
    expect(isShareSupported()).toBe(true);
    expect(isClipboardSupported()).toBe(true);

    installNavigator({ clipboard: false });
    expect(isClipboardSupported()).toBe(false);
  });

  it('downloads the preview image when it is reachable', async () => {
    const blob = new Blob(['image-bytes'], { type: 'image/png' });
    stubFetch({ ok: true, blob: async () => blob });

    const file = await fetchPreviewImage(PREVIEW_IMAGE_URL);

    expect(file).not.toBeNull();
    expect(file?.name).toBe('github-memory.png');
    expect(file?.type).toBe('image/png');
  });

  it('returns null when the image is missing', async () => {
    stubFetch({ ok: false, blob: async () => new Blob([]) });

    expect(await fetchPreviewImage(PREVIEW_IMAGE_URL)).toBeNull();
  });

  it('returns null when the image request fails', async () => {
    stubFetch(new Error('offline'));

    expect(await fetchPreviewImage(PREVIEW_IMAGE_URL)).toBeNull();
  });

  it('shares the payload with the preview image attached', async () => {
    const { share } = installNavigator();
    const blob = new Blob(['image-bytes'], { type: 'image/png' });
    stubFetch({ ok: true, blob: async () => blob });

    const outcome = await sharePayload(buildSharePayload(result, 'ada'));

    expect(outcome.status).toBe('shared');
    expect(share).toHaveBeenCalledTimes(1);
    const data = share.mock.calls[0]?.[0] as ShareData;
    expect(data.url).toBe(REPOSITORY_URL);
    expect(data.files).toHaveLength(1);
  });

  it('shares without files when the image is unreachable', async () => {
    const { share } = installNavigator();
    stubFetch(new Error('offline'));

    const outcome = await sharePayload(buildSharePayload(result, 'ada'));

    expect(outcome.status).toBe('shared');
    const data = share.mock.calls[0]?.[0] as ShareData;
    expect(data.files).toBeUndefined();
  });

  it('shares without files when the platform rejects them', async () => {
    const { share } = installNavigator({ canShare: () => false });
    const blob = new Blob(['image-bytes'], { type: 'image/png' });
    stubFetch({ ok: true, blob: async () => blob });

    const outcome = await sharePayload(buildSharePayload(result, 'ada'));

    expect(outcome.status).toBe('shared');
    const data = share.mock.calls[0]?.[0] as ShareData;
    expect(data.files).toBeUndefined();
  });

  it('reports a cancelled share', async () => {
    installNavigator({
      share: async () => {
        throw new DOMException('cancelled', 'AbortError');
      },
    });
    stubFetch(new Error('offline'));

    const outcome = await sharePayload(buildSharePayload(result, 'ada'));

    expect(outcome.status).toBe('cancelled');
  });

  it('copies the link to the clipboard as a fallback', async () => {
    const { writeText } = installNavigator({ clipboard: true });
    Reflect.deleteProperty(navigator, 'share');

    const outcome = await sharePayload(buildSharePayload(result, 'ada'));

    expect(outcome.status).toBe('copied');
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it('fails when no share or clipboard API is available', async () => {
    installNavigator({ clipboard: false });
    Reflect.deleteProperty(navigator, 'share');

    const outcome = await sharePayload(buildSharePayload(result, 'ada'));

    expect(outcome.status).toBe('failed');
  });
});
