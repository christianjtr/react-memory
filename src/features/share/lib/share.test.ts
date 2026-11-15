import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RoundResult } from '@/features/game/lib/roundResult';
import {
  DEMO_URL,
  REPOSITORY_URL,
  buildChannelUrl,
  buildDailyShare,
  buildSharePayload,
  buildShareText,
  copyShareText,
} from './share';

const classicResult: RoundResult = {
  mode: 'classic',
  difficulty: 'normal',
  repositoryLabel: 'facebook/react',
  outcome: 'won',
  score: 1160,
  base: 900,
  streakBonus: 75,
  errorPenalty: 25,
  timeBonus: 210,
  pairsFound: 6,
  errors: 1,
  moves: 7,
  bestStreak: 6,
  accuracy: 86,
  elapsedSeconds: 18,
};

describe('share', () => {
  describe('buildSharePayload', () => {
    it('composes the text with score, accuracy, streak and the demo url', () => {
      const payload = buildSharePayload(classicResult, 'ada');

      expect(payload.title).toContain('ada sacó 1160 puntos');
      expect(payload.text).toContain('1160 puntos');
      expect(payload.text).toContain('Normal');
      expect(payload.text).toContain('86%');
      expect(payload.text).toContain('×6');
      expect(payload.text).toContain(DEMO_URL);
      expect(payload.url).toBe(REPOSITORY_URL);
    });

    it('falls back to an anonymous player label', () => {
      expect(buildSharePayload(classicResult, '').title).toContain('Un jugador sacó');
    });
  });

  describe('buildDailyShare', () => {
    it('builds the daily payload with the invitation text', async () => {
      const prepared = await buildDailyShare({
        ...classicResult,
        mode: 'daily',
        repositoryLabel: 'oven-sh/bun',
      });

      expect(prepared.payload.title).toContain('Reto diario');
      expect(prepared.payload.text).toContain('1160 puntos');
      expect(prepared.payload.text).toContain('mismo tablero');
      expect(prepared.cardFileName).toMatch(
        /^github-memory-daily-\d{4}-\d{2}-\d{2}\.png$/,
      );
    });

    it('returns a null card when canvas rendering is not available', async () => {
      const prepared = await buildDailyShare({
        ...classicResult,
        mode: 'daily',
      });

      expect(prepared.card).toBeNull();
      expect(prepared.payload.text).toContain('mismo tablero');
    });
  });

  describe('buildChannelUrl', () => {
    const payload = {
      title: 'Github Memory',
      text: 'Saqué 1160 puntos',
      url: REPOSITORY_URL,
    };

    it('builds the whatsapp intent with the encoded text and link', () => {
      expect(buildChannelUrl('whatsapp', payload)).toBe(
        `https://wa.me/?text=${encodeURIComponent(`Saqué 1160 puntos\n${REPOSITORY_URL}`)}`,
      );
    });

    it('builds the facebook sharer url with the link and quote', () => {
      expect(buildChannelUrl('facebook', payload)).toBe(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(REPOSITORY_URL)}&quote=${encodeURIComponent('Saqué 1160 puntos')}`,
      );
    });

    it('builds the x intent with the text and link', () => {
      expect(buildChannelUrl('x', payload)).toBe(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent('Saqué 1160 puntos')}&url=${encodeURIComponent(REPOSITORY_URL)}`,
      );
    });

    it('builds the telegram share url with the link and text', () => {
      expect(buildChannelUrl('telegram', payload)).toBe(
        `https://t.me/share/url?url=${encodeURIComponent(REPOSITORY_URL)}&text=${encodeURIComponent('Saqué 1160 puntos')}`,
      );
    });

    it('builds the linkedin share url with the link', () => {
      expect(buildChannelUrl('linkedin', payload)).toBe(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(REPOSITORY_URL)}`,
      );
    });
  });

  describe('copyShareText', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('copies the text and the link to the clipboard', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText },
        configurable: true,
      });

      const copied = await copyShareText({
        title: 'Github Memory',
        text: 'Saqué 1160 puntos',
        url: REPOSITORY_URL,
      });

      expect(copied).toBe(true);
      expect(writeText).toHaveBeenCalledWith(`Saqué 1160 puntos\n${REPOSITORY_URL}`);
    });

    it('reports failure when the clipboard is not available', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      });

      const copied = await copyShareText({
        title: 'Github Memory',
        text: 'text',
        url: REPOSITORY_URL,
      });

      expect(copied).toBe(false);
    });
  });

  describe('buildShareText', () => {
    it('joins the text and the url', () => {
      expect(buildShareText({ title: 't', text: 'text', url: REPOSITORY_URL })).toBe(
        `text\n${REPOSITORY_URL}`,
      );
    });
  });
});
