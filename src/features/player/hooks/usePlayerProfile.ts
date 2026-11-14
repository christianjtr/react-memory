import { useCallback, useState } from 'react';
import { readPlayerProfile, writePlayerProfile } from '../lib/playerStore';
import type { PlayerProfile } from '../types';

export function usePlayerProfile() {
  const [profile, setProfile] = useState<PlayerProfile>(readPlayerProfile);

  const saveNickname = useCallback((nickname: string): void => {
    setProfile(writePlayerProfile(nickname));
  }, []);

  return { profile, saveNickname };
}
