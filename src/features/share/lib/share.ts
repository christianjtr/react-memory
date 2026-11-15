import type { SharePayload } from '../types';

export const REPOSITORY_URL = 'https://github.com/christianjtr/react-memory';

export const DEMO_URL = 'https://christianjtr.github.io/react-memory';

export function buildSharePayload(): SharePayload {
  return { url: REPOSITORY_URL };
}

export function isClipboardSupported(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.clipboard?.writeText === 'function'
  );
}

export async function copyShareLink(payload: SharePayload): Promise<boolean> {
  if (!isClipboardSupported()) return false;

  try {
    await navigator.clipboard.writeText(payload.url);
    return true;
  } catch {
    return false;
  }
}
