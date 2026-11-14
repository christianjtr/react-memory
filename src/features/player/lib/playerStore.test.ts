import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '@/lib/storage';
import { DEFAULT_NICKNAME, MAX_NICKNAME_LENGTH } from '../types';
import { readPlayerProfile, sanitizeNickname, writePlayerProfile } from './playerStore';

describe('playerStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('trims and collapses nicknames', () => {
    expect(sanitizeNickname('  ada   lovelace ')).toBe('ada lovelace');
    expect(sanitizeNickname('ada')).toBe('ada');
  });

  it('caps the nickname length', () => {
    expect(sanitizeNickname('a'.repeat(40))).toHaveLength(MAX_NICKNAME_LENGTH);
  });

  it('falls back to the default nickname', () => {
    expect(readPlayerProfile().nickname).toBe(DEFAULT_NICKNAME);
  });

  it('persists a nickname', () => {
    writePlayerProfile('  ada  ');

    expect(readPlayerProfile().nickname).toBe('ada');
    expect(window.localStorage.getItem(STORAGE_KEYS.player)).not.toBeNull();
  });

  it('falls back when the nickname is empty', () => {
    writePlayerProfile('   ');

    expect(readPlayerProfile().nickname).toBe(DEFAULT_NICKNAME);
  });

  it('drops corrupted profiles', () => {
    window.localStorage.setItem(STORAGE_KEYS.player, '{not json');

    expect(readPlayerProfile().nickname).toBe(DEFAULT_NICKNAME);
    expect(window.localStorage.getItem(STORAGE_KEYS.player)).toBeNull();
  });

  it('drops profiles with an unexpected shape', () => {
    window.localStorage.setItem(STORAGE_KEYS.player, JSON.stringify({ nickname: 42 }));

    expect(readPlayerProfile().nickname).toBe(DEFAULT_NICKNAME);
  });
});
