import type { ReactElement } from 'react';
import { GameProvider } from '@/features/game/context/GameContext';
import { GameBoard } from '@/features/game/components/GameBoard';

export function App(): ReactElement {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}

export default App;
