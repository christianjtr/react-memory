import React from 'react';

import './App.css';
import { GameProvider } from './contexts/GameContext/GameContext';
import { Gameboard } from './components';

const App: React.FC = (): React.ReactElement => {
  return (
    <>
      <div>...MEMORY APPLICATION...</div>
      <GameProvider>
        <Gameboard />
      </GameProvider>
    </>
  );
};

export default App;
