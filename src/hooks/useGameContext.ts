import { useContext } from 'react';
import { GameContext, GameContextType } from '../contexts/GameContext/GameContext';

const useGameContext = (): GameContextType => {
  const gameContext = useContext(GameContext);
  if (gameContext === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  
  return gameContext;
};

export { useGameContext };