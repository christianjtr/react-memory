import React, { useEffect } from 'react';

import './App.css';
import useGithubContributors from './hooks/useGithubContributors';
import { GameProvider } from './contexts/GameContext/GameContext';
import { Gameboard } from './components';

const App: React.FC = (): React.ReactElement => {
  const { isLoading, contributors, fetchData } = useGithubContributors();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.StrictMode>
      <div>...MEMORY APPLICATION...</div>
      <GameProvider>
        <Gameboard />
      </GameProvider>
    </React.StrictMode>
  );
};

export default App;
