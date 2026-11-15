import { useCallback, useState } from 'react';
import { copyShareLink, buildSharePayload } from '../lib/share';
import type { ShareStatus } from '../types';

export function useShare() {
  const [status, setStatus] = useState<ShareStatus>('idle');

  const copyLink = useCallback(async () => {
    const copied = await copyShareLink(buildSharePayload());
    setStatus(copied ? 'copied' : 'failed');
  }, []);

  const reset = useCallback((): void => {
    setStatus('idle');
  }, []);

  return { status, copyLink, reset };
}
