import { motion, useReducedMotion } from 'motion/react';
import type { ReactElement } from 'react';

interface Blob {
  readonly className: string;
  readonly background: string;
  readonly duration: number;
  readonly delay: number;
  readonly x: readonly number[];
  readonly y: readonly number[];
  readonly scale: readonly number[];
}

const BLOBS: readonly Blob[] = [
  {
    className: '-top-32 -left-24 h-[26rem] w-[26rem] sm:h-[34rem] sm:w-[34rem]',
    background:
      'radial-gradient(circle at center, rgb(196 181 253 / 0.85), rgb(196 181 253 / 0) 68%)',
    duration: 16,
    delay: 0,
    x: [0, 34, -18, 0],
    y: [0, 26, -12, 0],
    scale: [1, 1.08, 0.96, 1],
  },
  {
    className: '-top-20 right-[-10%] h-[22rem] w-[22rem] sm:h-[30rem] sm:w-[30rem]',
    background:
      'radial-gradient(circle at center, rgb(103 232 249 / 0.8), rgb(103 232 249 / 0) 70%)',
    duration: 19,
    delay: 1.4,
    x: [0, -28, 14, 0],
    y: [0, 30, 10, 0],
    scale: [1, 0.94, 1.06, 1],
  },
  {
    className: 'bottom-[-18%] left-[8%] h-[24rem] w-[24rem] sm:h-[32rem] sm:w-[32rem]',
    background:
      'radial-gradient(circle at center, rgb(253 186 116 / 0.75), rgb(253 186 116 / 0) 68%)',
    duration: 21,
    delay: 0.8,
    x: [0, 24, -20, 0],
    y: [0, -22, 12, 0],
    scale: [1, 1.05, 0.95, 1],
  },
  {
    className: 'right-[-8%] bottom-[-12%] h-[20rem] w-[20rem] sm:h-[28rem] sm:w-[28rem]',
    background:
      'radial-gradient(circle at center, rgb(249 168 212 / 0.8), rgb(249 168 212 / 0) 70%)',
    duration: 17,
    delay: 2,
    x: [0, -18, 22, 0],
    y: [0, -26, -8, 0],
    scale: [1, 0.97, 1.08, 1],
  },
];

interface Sparkle {
  readonly className: string;
  readonly color: string;
  readonly duration: number;
  readonly delay: number;
}

const SPARKLES: readonly Sparkle[] = [
  {
    className: 'left-[12%] top-[24%] h-3 w-3 rotate-12 rounded-sm',
    color: '#a855f7',
    duration: 5.5,
    delay: 0,
  },
  {
    className: 'right-[16%] top-[18%] h-2.5 w-2.5 -rotate-12 rounded-full',
    color: '#06b6d4',
    duration: 6.5,
    delay: 0.8,
  },
  {
    className: 'left-[22%] bottom-[20%] h-2 w-2 rotate-45 rounded-sm',
    color: '#fb7185',
    duration: 7,
    delay: 1.6,
  },
  {
    className: 'right-[24%] bottom-[26%] h-3.5 w-3.5 rotate-6 rounded-sm',
    color: '#f59e0b',
    duration: 6,
    delay: 0.4,
  },
  {
    className: 'left-[48%] top-[10%] h-2 w-2 rounded-full',
    color: '#8b5cf6',
    duration: 5,
    delay: 2.2,
  },
  {
    className: 'right-[42%] bottom-[12%] h-2.5 w-2.5 rotate-45 rounded-sm',
    color: '#22d3ee',
    duration: 6.8,
    delay: 1.2,
  },
];

export function AnimatedBackground(): ReactElement {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#f2e8fb_0%,#f7f0f8_45%,#e3f5f7_100%)]" />

      <div
        className="absolute inset-0 opacity-45 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(139 92 246 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgb(139 92 246 / 0.16) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />

      {BLOBS.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${blob.className}`}
          style={{ background: blob.background }}
          animate={
            prefersReducedMotion
              ? undefined
              : { x: [...blob.x], y: [...blob.y], scale: [...blob.scale] }
          }
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}

      {SPARKLES.map((sparkle, index) => (
        <motion.span
          key={index}
          className={`absolute ${sparkle.className}`}
          style={{ backgroundColor: sparkle.color }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: [0, -16, 0],
                  rotate: [0, 24, 0],
                  opacity: [0.35, 0.85, 0.35],
                }
          }
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
