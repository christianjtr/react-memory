import React from 'react';

import { GameProvider } from './contexts/GameContext/GameContext';
import { Gameboard } from './components';

const App: React.FC = (): React.ReactElement => {
  return (
    <GameProvider>
      <Gameboard />
    </GameProvider>
  );
};

export default App;
