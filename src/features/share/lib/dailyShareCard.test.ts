import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RoundResult } from '@/features/game/lib/roundResult';
import { DEMO_URL, REPOSITORY_URL } from './share';
import {
  SHARE_CARD_HEIGHT,
  SHARE_CARD_WIDTH,
  buildDailyShareCardModel,
  buildDailyShareRequest,
  renderDailyShareCard,
  type DailyShareCardModel,
} from './dailyShareCard';
import { applyDailyResult, createEmptyDailyState } from '@/features/daily/lib/dailyStore';

const result: RoundResult = {
  mode: 'daily',
  difficulty: 'normal',
  repositoryLabel: 'oven-sh/bun',
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

const DATE_KEY = '2026-11-15';

function dailyStateWithHistory() {
  let state = createEmptyDailyState();

  for (const [dateKey, elapsedSeconds] of [
    ['2026-11-14', 41],
    [DATE_KEY, 18],
  ] as const) {
    state = applyDailyResult(state, dateKey, {
      score: 1160,
      elapsedSeconds,
      won: true,
    }).state;
  }

  return state;
}

function createFakeContext() {
  const gradient = { addColorStop: vi.fn() };

  const context = {
    canvas: { width: SHARE_CARD_WIDTH, height: SHARE_CARD_HEIGHT },
    createLinearGradient: vi.fn(() => gradient),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  } as unknown as CanvasRenderingContext2D;

  return context;
}

describe('dailyShareCard', () => {
  describe('buildDailyShareCardModel', () => {
    it('builds the card model with score, streak, best time and invitation', () => {
      const model = buildDailyShareCardModel(result, DATE_KEY, dailyStateWithHistory());

      expect(model).toMatchObject({
        dateKey: DATE_KEY,
        repositoryLabel: 'oven-sh/bun',
        score: 1160,
        streak: 2,
        streakLabel: 'Racha: 2 días',
        bestTimeInSeconds: 18,
        bestTimeLabel: 'Mejor tiempo: 18s',
        invitation: '¿Podés superar esta marca con el mismo tablero?',
        callUrl: DEMO_URL,
      });
    });

    it('formats singular streak and missing best time', () => {
      const model = buildDailyShareCardModel(result, DATE_KEY, createEmptyDailyState());

      expect(model.streak).toBe(0);
      expect(model.streakLabel).toBe('Racha: 0 días');
      expect(model.bestTimeInSeconds).toBeNull();
      expect(model.bestTimeLabel).toBe('Mejor tiempo: —');
    });
  });

  describe('buildDailyShareRequest', () => {
    it('composes the share text with the exact score, streak and seed date', () => {
      const model = buildDailyShareCardModel(result, DATE_KEY, dailyStateWithHistory());
      const request = buildDailyShareRequest(model);

      expect(request.title).toBe(`Github Memory — Reto diario ${DATE_KEY}`);
      expect(request.text).toContain('1160 puntos');
      expect(request.text).toContain(DATE_KEY);
      expect(request.text).toContain('Racha: 2 días');
      expect(request.text).toContain('Mejor tiempo: 18s');
      expect(request.text).toContain('mismo tablero');
      expect(request.text).toContain(DEMO_URL);
      expect(request.url).toBe(REPOSITORY_URL);
    });
  });

  describe('renderDailyShareCard', () => {
    let context: CanvasRenderingContext2D;

    beforeEach(() => {
      context = createFakeContext();

      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
      vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((callback) => {
        callback?.(new Blob(['png-bytes'], { type: 'image/png' }));
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('draws the card and exports a png blob', async () => {
      const model: DailyShareCardModel = buildDailyShareCardModel(
        result,
        DATE_KEY,
        dailyStateWithHistory(),
      );

      const blob = await renderDailyShareCard(model);

      expect(blob).not.toBeNull();
      expect(blob?.type).toBe('image/png');
      expect(context.fillText).toHaveBeenCalledWith(
        '1160',
        SHARE_CARD_WIDTH / 2,
        expect.any(Number),
      );
      expect(context.fillText).toHaveBeenCalledWith(
        model.invitation,
        expect.any(Number),
        expect.any(Number),
      );
    });

    it('returns null when canvas rendering is not available', async () => {
      vi.restoreAllMocks();

      const model = buildDailyShareCardModel(result, DATE_KEY, createEmptyDailyState());

      expect(await renderDailyShareCard(model)).toBeNull();
    });
  });
});
