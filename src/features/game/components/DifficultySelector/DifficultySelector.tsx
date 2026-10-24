import type { ReactElement } from 'react';
import { DIFFICULTIES, type DifficultyId } from '../../lib/difficulty';

export interface DifficultySelectorProps {
  value: DifficultyId;
  disabled?: boolean;
  onChange: (difficulty: DifficultyId) => void;
}

export function DifficultySelector({
  value,
  disabled = false,
  onChange,
}: DifficultySelectorProps): ReactElement {
  const activeIndex = Math.max(
    0,
    DIFFICULTIES.findIndex((difficulty) => difficulty.id === value),
  );

  return (
    <div
      role="group"
      aria-label="Dificultad"
      className="w-full max-w-sm rounded-2xl border border-white/70 bg-white/55 p-1 shadow-card backdrop-blur-md">
      <div className="relative grid grid-cols-3 gap-1">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[calc((100%-0.5rem)/3)] rounded-xl bg-[linear-gradient(120deg,#7c3aed,#c026d3_55%,#0891b2)] shadow-[0_10px_24px_-10px_rgb(124_58_237_/_0.8)] transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 0.25}rem))`,
          }}
        />
        {DIFFICULTIES.map((difficulty) => {
          const isActive = difficulty.id === value;

          return (
            <button
              key={difficulty.id}
              type="button"
              className={`relative z-10 flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive ? 'text-white' : 'text-violet-700 hover:text-violet-900'
              }`}
              aria-pressed={isActive}
              disabled={disabled}
              onClick={() => onChange(difficulty.id)}>
              <span className="text-sm font-black tracking-wide">{difficulty.label}</span>
              <span
                className={`text-[0.6rem] font-semibold ${isActive ? 'text-white/85' : 'text-violet-500/80'}`}>
                {difficulty.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
