import { motion, useReducedMotion } from 'motion/react';
import type { ReactElement } from 'react';

export interface TimerRingProps {
  timer: number;
  total: number;
  isRunning: boolean;
}

const SIZE = 108;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function TimerRing({ timer, total, isRunning }: TimerRingProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const safeTotal = total > 0 ? total : 1;
  const ratio = Math.max(0, Math.min(1, timer / safeTotal));
  const dashOffset = CIRCUMFERENCE * (1 - ratio);
  const isCritical = timer <= 10;
  const colorClass = isCritical
    ? 'stroke-rose-500'
    : ratio <= 0.35
      ? 'stroke-amber-500'
      : 'stroke-violet-500';

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      {isCritical && isRunning ? (
        <span
          aria-hidden="true"
          className="absolute inset-2 rounded-full border-2 border-rose-400/70 animate-pulse-ring"
        />
      ) : null}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-full w-full -rotate-90">
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-violet-200"
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          className={colorClass}
          initial={false}
          animate={{ strokeDashoffset: dashOffset }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 90, damping: 20 }
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="text-[0.6rem] font-bold tracking-[0.22em] text-violet-500 uppercase">
          Tiempo
        </span>
        <p
          className={`text-sm font-black tabular-nums ${isCritical ? 'text-rose-600' : 'text-ink'}`}
          aria-live="polite">
          Time: {timer}
        </p>
      </div>
    </div>
  );
}
