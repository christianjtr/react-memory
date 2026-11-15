import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildSharePayload,
  copyShareLink,
  isClipboardSupported,
  REPOSITORY_URL,
} from './share';

describe('share', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides only the game link to copy', () => {
    expect(buildSharePayload()).toEqual({ url: REPOSITORY_URL });
  });

  it('copies only the link to the clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    expect(isClipboardSupported()).toBe(true);
    expect(await copyShareLink(buildSharePayload())).toBe(true);
    expect(writeText).toHaveBeenCalledExactlyOnceWith(REPOSITORY_URL);
  });

  it('returns false when clipboard access is unavailable', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      configurable: true,
    });

    expect(await copyShareLink(buildSharePayload())).toBe(false);
  });
});
