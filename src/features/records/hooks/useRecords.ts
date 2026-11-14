import { useCallback, useEffect, useState } from 'react';
import { clearLegacyBestScore, STORAGE_KEYS, writeJson } from '@/lib/storage';
import { applyRound, readRecords, type RoundSummary } from '../lib/recordsStore';
import type { RecordsState } from '../types';

export function useRecords() {
  const [records, setRecords] = useState<RecordsState>(() => readRecords());

  useEffect(() => {
    if (writeJson(STORAGE_KEYS.records, records)) {
      clearLegacyBestScore();
    }
  }, [records]);

  const saveRound = useCallback((round: RoundSummary): void => {
    setRecords((current) => applyRound(current, round).records);
  }, []);

  return { records, saveRound };
}
