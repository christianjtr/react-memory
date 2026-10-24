import type { ReactElement } from 'react';

export interface GameBoardHeaderProps {
  title?: string;
}

export function GameBoardHeader({
  title = 'Github Memory',
}: GameBoardHeaderProps): ReactElement {
  return (
    <header className="py-5">
      <h1 className="text-center text-3xl font-bold text-slate-900">{title}</h1>
    </header>
  );
}
