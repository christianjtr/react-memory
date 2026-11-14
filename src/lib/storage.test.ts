import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LEGACY_BEST_SCORE_KEY,
  STORAGE_KEYS,
  clearLegacyBestScore,
  isPlainObject,
  readJson,
  readLegacyBestScore,
  readNumber,
  readString,
  removeStoredItem,
  writeJson,
  writeNumber,
} from './storage';

describe('storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('exposes namespaced versioned keys', () => {
    expect(STORAGE_KEYS.player).toBe('github-memory:v2:player');
    expect(STORAGE_KEYS.records).toBe('github-memory:v2:records');
    expect(STORAGE_KEYS.daily).toBe('github-memory:v2:daily');
  });

  it('returns the fallback when the key is missing', () => {
    expect(readJson('missing', { value: 1 })).toEqual({ value: 1 });
    expect(readString('missing')).toBeNull();
    expect(readNumber('missing')).toBeNull();
  });

  it('reads and writes JSON values', () => {
    expect(writeJson('profile', { nickname: 'ada' })).toBe(true);
    expect(readJson('profile', { nickname: '' })).toEqual({ nickname: 'ada' });
  });

  it('drops corrupted JSON and falls back', () => {
    window.localStorage.setItem('broken', '{not json');

    expect(readJson('broken', { ok: true })).toEqual({ ok: true });
    expect(window.localStorage.getItem('broken')).toBeNull();
  });

  it('drops values that fail validation', () => {
    writeJson('profile', { nickname: 42 });

    const isProfile = (value: unknown): value is { nickname: string } =>
      isPlainObject(value) && typeof value.nickname === 'string';

    expect(readJson('profile', { nickname: '' }, isProfile)).toEqual({
      nickname: '',
    });
    expect(window.localStorage.getItem('profile')).toBeNull();
  });

  it('reads and writes plain numbers', () => {
    expect(writeNumber('score', 250)).toBe(true);
    expect(readNumber('score')).toBe(250);
  });

  it('rejects non finite numbers', () => {
    expect(writeNumber('score', Number.NaN)).toBe(false);
    expect(readNumber('score')).toBeNull();
  });

  it('removes stored items', () => {
    writeNumber('score', 10);

    removeStoredItem('score');

    expect(window.localStorage.getItem('score')).toBeNull();
  });

  it('reads and clears the legacy best score', () => {
    window.localStorage.setItem(LEGACY_BEST_SCORE_KEY, '450');

    expect(readLegacyBestScore()).toBe(450);

    clearLegacyBestScore();

    expect(readLegacyBestScore()).toBe(0);
    expect(window.localStorage.getItem(LEGACY_BEST_SCORE_KEY)).toBeNull();
  });

  it('ignores invalid legacy best scores', () => {
    window.localStorage.setItem(LEGACY_BEST_SCORE_KEY, 'not-a-number');
    expect(readLegacyBestScore()).toBe(0);

    window.localStorage.setItem(LEGACY_BEST_SCORE_KEY, '-10');
    expect(readLegacyBestScore()).toBe(0);
  });

  it('survives a storage that throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });

    expect(readJson('profile', { nickname: 'fallback' })).toEqual({
      nickname: 'fallback',
    });
    expect(readString('profile')).toBeNull();
    expect(readNumber('profile')).toBeNull();
    expect(readLegacyBestScore()).toBe(0);
    expect(writeJson('profile', { nickname: 'ada' })).toBe(false);
    expect(writeNumber('profile', 10)).toBe(false);
    expect(() => {
      removeStoredItem('profile');
    }).not.toThrow();
  });
});
