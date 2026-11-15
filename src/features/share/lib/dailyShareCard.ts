import type { RoundResult } from '@/features/game/lib/roundResult';
import { computeDailyStreak } from '@/features/daily/lib/dailyChallenge';
import { readDailyState } from '@/features/daily/lib/dailyStore';
import { getDailySeed } from '@/lib/random';
import { DEMO_URL, REPOSITORY_URL } from './share';

export const SHARE_CARD_WIDTH = 1200;
export const SHARE_CARD_HEIGHT = 630;

const FONT_FAMILY = 'system-ui, -apple-system, "Segoe UI", sans-serif';

export interface DailyShareCardModel {
  readonly dateKey: string;
  readonly repositoryLabel: string;
  readonly score: number;
  readonly streak: number;
  readonly streakLabel: string;
  readonly bestTimeInSeconds: number | null;
  readonly bestTimeLabel: string;
  readonly invitation: string;
  readonly callUrl: string;
}

function pluralizeDays(days: number): string {
  return days === 1 ? 'día' : 'días';
}

function formatBestTime(bestTimeInSeconds: number | null): string {
  return bestTimeInSeconds === null ? '—' : `${bestTimeInSeconds}s`;
}

export function buildDailyShareCardModel(
  result: RoundResult,
  dateKey: string = getDailySeed(),
  dailyState = readDailyState(),
): DailyShareCardModel {
  const streak = computeDailyStreak(dailyState, dateKey);

  return {
    dateKey,
    repositoryLabel: result.repositoryLabel,
    score: result.score,
    streak,
    streakLabel: `Racha: ${streak} ${pluralizeDays(streak)}`,
    bestTimeInSeconds: dailyState.bestTimeInSeconds,
    bestTimeLabel: `Mejor tiempo: ${formatBestTime(dailyState.bestTimeInSeconds)}`,
    invitation: '¿Podés superar esta marca con el mismo tablero?',
    callUrl: DEMO_URL,
  };
}

export function buildDailyShareRequest(model: DailyShareCardModel): {
  title: string;
  text: string;
  url: string;
} {
  return {
    title: `Github Memory — Reto diario ${model.dateKey}`,
    text: [
      `Saqué ${model.score} puntos en el reto diario de Github Memory (${model.repositoryLabel}, ${model.dateKey}).`,
      `${model.streakLabel} · ${model.bestTimeLabel}.`,
      `¿Podés superar esta marca con el mismo tablero? Jugá en ${model.callUrl}`,
    ].join('\n'),
    url: REPOSITORY_URL,
  };
}

export async function renderDailyShareCard(
  model: DailyShareCardModel,
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = SHARE_CARD_WIDTH;
  canvas.height = SHARE_CARD_HEIGHT;

  const ctx = canvas.getContext('2d');

  if (ctx === null) return null;

  drawCard(ctx, model);

  return canvasToBlob(canvas);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    } catch {
      resolve(null);
    }
  });
}

function drawCard(ctx: CanvasRenderingContext2D, model: DailyShareCardModel): void {
  const { width, height } = ctx.canvas;

  drawBackground(ctx, width, height);
  drawHeader(ctx, model, width);
  drawScore(ctx, model, width, height);
  drawStats(ctx, model, width, height);
  drawInvitation(ctx, model, width, height);
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const gradient = ctx.createLinearGradient(0, 0, width, height);

  gradient.addColorStop(0, '#5b21b6');
  gradient.addColorStop(0.55, '#a21caf');
  gradient.addColorStop(1, '#0891b2');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(width * 0.12, height * 0.85, 220, 0, Math.PI * 2);
  ctx.arc(width * 0.9, height * 0.18, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawHeader(
  ctx: CanvasRenderingContext2D,
  model: DailyShareCardModel,
  width: number,
): void {
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  ctx.font = `900 46px ${FONT_FAMILY}`;
  ctx.fillText('✦ Github Memory', 64, 110);

  ctx.textAlign = 'right';
  ctx.globalAlpha = 0.92;
  ctx.font = `700 30px ${FONT_FAMILY}`;
  ctx.fillText(`RETO DIARIO · ${model.dateKey}`, width - 64, 108);
  ctx.globalAlpha = 1;
}

function drawScore(
  ctx: CanvasRenderingContext2D,
  model: DailyShareCardModel,
  width: number,
  height: number,
): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(46, 16, 101, 0.45)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 10;

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 176px ${FONT_FAMILY}`;
  ctx.fillText(String(model.score), width / 2, height * 0.52);

  ctx.restore();

  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.85;
  ctx.font = `700 30px ${FONT_FAMILY}`;
  ctx.fillText('P U N T O S', width / 2, height * 0.52 + 44);
  ctx.globalAlpha = 1;
}

function drawStats(
  ctx: CanvasRenderingContext2D,
  model: DailyShareCardModel,
  width: number,
  height: number,
): void {
  const dividerY = height * 0.7;

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(64, dividerY, width - 128, 2);
  ctx.restore();

  const stats: Array<{ label: string; value: string }> = [
    { label: 'RACHA DIARIA', value: `${model.streak} ${pluralizeDays(model.streak)}` },
    { label: 'MEJOR TIEMPO', value: formatBestTime(model.bestTimeInSeconds) },
    { label: 'TABLERO', value: model.repositoryLabel },
  ];

  const slotWidth = (width - 128) / stats.length;

  stats.forEach((stat, index) => {
    const centerX = 64 + slotWidth * index + slotWidth / 2;

    ctx.textAlign = 'center';
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 24px ${FONT_FAMILY}`;
    ctx.fillText(stat.label, centerX, dividerY + 56);

    ctx.globalAlpha = 1;
    ctx.font = `800 40px ${FONT_FAMILY}`;
    ctx.fillText(stat.value, centerX, dividerY + 108);
  });

  ctx.globalAlpha = 1;
}

function drawInvitation(
  ctx: CanvasRenderingContext2D,
  model: DailyShareCardModel,
  width: number,
  height: number,
): void {
  ctx.textAlign = 'center';

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 34px ${FONT_FAMILY}`;
  ctx.fillText(model.invitation, width / 2, height - 96);

  ctx.globalAlpha = 0.88;
  ctx.font = `600 26px ${FONT_FAMILY}`;
  ctx.fillText(model.callUrl, width / 2, height - 52);
  ctx.globalAlpha = 1;
}
