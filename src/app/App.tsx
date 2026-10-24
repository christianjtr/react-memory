import type { ReactElement } from 'react';
import { MotionConfig } from 'motion/react';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { GameProvider } from '@/features/game/context/GameContext';
import { GameBoard } from '@/features/game/components/GameBoard';

export function App(): ReactElement {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatedBackground />
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </MotionConfig>
  );
}

export default App;
