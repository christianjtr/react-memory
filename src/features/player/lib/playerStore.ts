import { isPlainObject, STORAGE_KEYS, readJson, writeJson } from '@/lib/storage';
import { DEFAULT_NICKNAME, MAX_NICKNAME_LENGTH, type PlayerProfile } from '../types';

export function sanitizeNickname(value: string): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, MAX_NICKNAME_LENGTH);
}

function isPlayerProfile(value: unknown): value is PlayerProfile {
  return (
    isPlainObject(value) &&
    typeof value.nickname === 'string' &&
    typeof value.createdAt === 'number'
  );
}

export function createDefaultProfile(): PlayerProfile {
  return { nickname: DEFAULT_NICKNAME, createdAt: 0 };
}

export function readPlayerProfile(): PlayerProfile {
  const stored = readJson<PlayerProfile>(
    STORAGE_KEYS.player,
    createDefaultProfile(),
    isPlayerProfile,
  );

  const nickname = sanitizeNickname(stored.nickname);

  return {
    nickname: nickname.length > 0 ? nickname : DEFAULT_NICKNAME,
    createdAt: stored.createdAt,
  };
}

export function writePlayerProfile(nickname: string): PlayerProfile {
  const sanitized = sanitizeNickname(nickname);
  const profile: PlayerProfile = {
    nickname: sanitized.length > 0 ? sanitized : DEFAULT_NICKNAME,
    createdAt: Date.now(),
  };

  writeJson(STORAGE_KEYS.player, profile);

  return profile;
}
