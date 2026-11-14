import { useCallback, useState } from 'react';
import type { RoundResult } from '@/features/game/lib/roundResult';
import { buildSharePayload, sharePayload } from '../lib/share';
import type { ShareStatus } from '../types';

export function useShare() {
  const [status, setStatus] = useState<ShareStatus>('idle');

  const share = useCallback(async (result: RoundResult, nickname: string) => {
    setStatus('sharing');

    const outcome = await sharePayload(buildSharePayload(result, nickname));

    setStatus(outcome.status);

    return outcome;
  }, []);

  const reset = useCallback((): void => {
    setStatus('idle');
  }, []);

  return { status, share, reset };
}
