import { memo, type ReactElement } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { GameCard } from '../../types';

export interface CardProps {
  card: GameCard;
  index?: number;
  disabled?: boolean;
  isMismatched?: boolean;
  onSelect: (cardId: number) => void;
}

const SHAKE_KEYFRAMES = [0, -7, 7, -5, 5, 0];

export const Card = memo(function Card({
  card,
  index = 0,
  disabled = false,
  isMismatched = false,
  onSelect,
}: CardProps): ReactElement {
  const prefersReducedMotion = useReducedMotion();
  const { cardId, contributor, isFaceDown, isMatched } = card;
  const isFlipped = !isFaceDown;
  const isDisabled = disabled || isMatched || isFlipped;
  const isInteractive = !isDisabled;
  const label = isFaceDown
    ? `Carta ${cardId + 1} boca abajo`
    : isMatched
      ? `${contributor.loginName}, pareja encontrada`
      : `${contributor.loginName}, carta volteada`;

  const handleClick = (): void => {
    onSelect(cardId);
  };

  return (
    <motion.div
      className="w-full"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22, scale: 0.86 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(index * 0.04, 0.45),
        type: 'spring',
        stiffness: 260,
        damping: 24,
      }}>
      <motion.button
        type="button"
        className={`group relative block aspect-square w-full rounded-2xl border text-left [perspective:1000px] transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-600 disabled:cursor-default ${
          isMatched
            ? 'border-emerald-300/80 shadow-[0_0_0_4px_rgb(52_211_153_/_0.18),0_18px_38px_-16px_rgb(16_185_129_/_0.7)]'
            : 'border-violet-200/80 shadow-card'
        }`}
        aria-label={label}
        aria-pressed={isFlipped}
        disabled={isDisabled}
        title={isFaceDown ? 'Voltear carta' : contributor.loginName}
        onClick={handleClick}
        animate={
          isMismatched && !prefersReducedMotion ? { x: SHAKE_KEYFRAMES } : { x: 0 }
        }
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        whileHover={isInteractive ? { y: -5, scale: 1.02 } : undefined}
        whileTap={isInteractive ? { scale: 0.97 } : undefined}>
        <motion.span
          className="relative block h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 210, damping: 22 }}>
          <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl [backface-visibility:hidden]">
            <span className="absolute inset-0 bg-[linear-gradient(135deg,#5b21b6_0%,#a21caf_48%,#0e7490_100%)]" />
            <span className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1.5px,transparent_1.7px)] [background-size:18px_18px]" />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgb(255_255_255_/_0.22),transparent_55%)]" />
            <span className="absolute top-2 left-2 h-1.5 w-1.5 rounded-full bg-white/70" />
            <span className="absolute right-3 bottom-3 h-2 w-2 rotate-45 rounded-sm bg-amber-300/90" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/35 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-white sm:h-7 sm:w-7">
                <path
                  d="M12 2.5 14.2 9l6.3 2.2-6.3 2.2L12 20l-2.2-6.6L3.5 11.2 9.8 9 12 2.5Z"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
              </svg>
            </span>
          </span>

          <span className="absolute inset-0 overflow-hidden rounded-2xl bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <img
              src={contributor.avatarURL}
              alt=""
              className="h-full w-full rounded-2xl object-cover"
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {isMatched ? (
              <span className="absolute inset-0 flex items-end justify-end bg-gradient-to-t from-emerald-500/25 to-transparent p-2">
                <motion.span
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18 }}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4">
                    <path
                      d="m5 10.5 3.2 3.2L15 7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </span>
            ) : null}
          </span>
        </motion.span>

        {isMatched ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-emerald-300/70"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.8, 0, 0.8], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}
      </motion.button>
    </motion.div>
  );
});
