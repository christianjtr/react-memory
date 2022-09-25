import React, { useReducer } from 'react';

import GameState, { GameStateInterface } from './state';
import GameActions, { GameActionsInterface } from './actions';

export type GameContextType = {
  state: GameStateInterface;
  dispatch: React.Dispatch<GameActionsInterface>;
};

type GameProviderProps = {
  children: React.ReactNode;
};

export const GameContext = React.createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
}: GameProviderProps): React.ReactElement => {
  const [state, dispatch] = useReducer(GameActions, GameState);
  const value = { state, dispatch };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
