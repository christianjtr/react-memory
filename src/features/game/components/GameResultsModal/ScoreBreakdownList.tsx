import type { ReactElement } from 'react';
import type { RoundResult } from '../../lib/roundResult';

export interface ScoreBreakdownListProps {
  readonly result: RoundResult;
}

interface BreakdownRow {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  readonly tone: 'positive' | 'negative' | 'neutral';
}

export function ScoreBreakdownList({ result }: ScoreBreakdownListProps): ReactElement {
  const rows: BreakdownRow[] = [
    {
      key: 'base',
      label: 'Parejas encontradas',
      value: `+${result.base}`,
      tone: 'positive',
    },
    {
      key: 'streak',
      label: `Bonus de racha (×${result.bestStreak})`,
      value: `+${result.streakBonus}`,
      tone: 'positive',
    },
    {
      key: 'time',
      label: 'Bonus de tiempo',
      value: `+${result.timeBonus}`,
      tone: 'positive',
    },
    {
      key: 'errors',
      label: `Penalización (${result.errors} ${result.errors === 1 ? 'error' : 'errores'})`,
      value: `−${result.errorPenalty}`,
      tone: 'negative',
    },
  ];

  return (
    <ul className="mx-auto w-full max-w-sm space-y-1.5 text-sm">
      {rows.map((row) => (
        <li
          key={row.key}
          className="flex items-center justify-between rounded-xl bg-white/70 px-3.5 py-2 ring-1 ring-violet-200/70">
          <span className="font-semibold text-violet-700/85">{row.label}</span>
          <span
            className={`font-black tabular-nums ${
              row.tone === 'negative'
                ? 'text-rose-600'
                : row.tone === 'positive'
                  ? 'text-emerald-600'
                  : 'text-violet-900'
            }`}>
            {row.value}
          </span>
        </li>
      ))}
      <li className="flex items-center justify-between rounded-xl bg-violet-100/80 px-3.5 py-2.5 ring-1 ring-violet-300">
        <span className="text-[0.65rem] font-bold tracking-[0.18em] text-violet-700 uppercase">
          Total
        </span>
        <span className="text-lg font-black text-violet-900 tabular-nums">
          {result.score}
        </span>
      </li>
    </ul>
  );
}
