import React from 'react';

import { GameProvider } from './contexts/GameContext/GameContext';
import { Gameboard, Modal } from './components';

const App: React.FC = (): React.ReactElement => {
  return (
    <GameProvider>
      <Gameboard />
      <Modal />
    </GameProvider>
  );
};

export default App;
