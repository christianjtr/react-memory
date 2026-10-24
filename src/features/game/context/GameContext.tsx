import { useReducer, type PropsWithChildren, type ReactElement } from 'react';
import { GameDispatchContext, GameStateContext } from './gameContexts';
import { gameReducer } from './gameReducer';
import { INITIAL_GAME_STATE } from './gameState';

export function GameProvider({ children }: PropsWithChildren): ReactElement {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}
