import { useCallback, useEffect, useRef, useState } from 'react';
import type { RoundResult } from '@/features/game/lib/roundResult';
import {
  buildDailyShare,
  buildChannelUrl,
  buildSharePayload,
  copyShareText,
  downloadBlob,
} from '../lib/share';
import type { ShareChannel, SharePayload, ShareStatus } from '../types';

export function useShare() {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [cardFileName, setCardFileName] = useState('github-memory-card.png');
  const [status, setStatus] = useState<ShareStatus>('idle');
  const cardUrlRef = useRef<string | null>(null);

  const setCard = useCallback((blob: Blob | null, fileName: string): void => {
    const nextUrl = blob === null ? null : URL.createObjectURL(blob);

    if (cardUrlRef.current !== null) {
      URL.revokeObjectURL(cardUrlRef.current);
    }

    cardUrlRef.current = nextUrl;
    setCardUrl(nextUrl);
    setCardFileName(fileName);
  }, []);

  useEffect(() => {
    return () => {
      if (cardUrlRef.current !== null) {
        URL.revokeObjectURL(cardUrlRef.current);
      }
    };
  }, []);

  const prepareShare = useCallback(
    async (result: RoundResult, nickname: string): Promise<void> => {
      setStatus('idle');

      if (result.mode === 'daily') {
        const prepared = await buildDailyShare(result);

        setPayload(prepared.payload);
        setCard(prepared.card, prepared.cardFileName);
        return;
      }

      setPayload(buildSharePayload(result, nickname));
      setCard(null, 'github-memory-card.png');
    },
    [setCard],
  );

  const shareTo = useCallback(
    (channel: ShareChannel): void => {
      if (payload === null) return;

      window.open(buildChannelUrl(channel, payload), '_blank', 'noopener,noreferrer');
    },
    [payload],
  );

  const copyLink = useCallback(async (): Promise<void> => {
    if (payload === null) return;

    const copied = await copyShareText(payload);

    setStatus(copied ? 'copied' : 'failed');
  }, [payload]);

  const downloadImage = useCallback((): void => {
    if (cardUrl === null) return;

    downloadBlob(cardUrl, cardFileName);
  }, [cardUrl, cardFileName]);

  const reset = useCallback((): void => {
    setCard(null, 'github-memory-card.png');
    setPayload(null);
    setStatus('idle');
  }, [setCard]);

  return {
    payload,
    cardUrl,
    status,
    prepareShare,
    shareTo,
    copyLink,
    downloadImage,
    reset,
  };
}
