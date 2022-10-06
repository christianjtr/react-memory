import { useState, useEffect } from 'react';
import useGameContext from './useGameContext';
import { GAME_ACTION_TYPES } from '../contexts/action-types';
import { GameConfig, Contributor } from '../types';

interface GameHookInterface {
    isValidGameMove: boolean | undefined;
    gameCardIds: number[];
    addGameCardId: (cardId: number) => void;
    faceDownCards: () => void;
    faceUpCard: (cardId: number) => void;
    addToFoundPairs: (cardId: number) => void;
    initGameMove: () => void;
    startGame: (data: Contributor[], config?: GameConfig) => Promise<void>;
}

let INTERVAL: number | undefined;

const useGame = (): GameHookInterface => {

  const NUMBER_OF_CARDS_TO_VALIDATE = 2;

  const { 
    dispatch, 
    state: { 
      config: { 
        timeUntilFaceDownCardsInSeconds, 
        pairsOfCards, 
        durationInSeconds 
      }, 
      foundPairs } 
  } = useGameContext();
  
  const [gameTimer, setGameTimer] = useState<number | undefined>(undefined);
  const [isValidGameMove, setIsValidGameMove] = useState<boolean | undefined>(undefined);
  const [gameCardIds, setGameCardIds] = useState<number[]>([]);

  const addGameCardId = (gameCardId: number): void => {
    if(gameCardIds.length === NUMBER_OF_CARDS_TO_VALIDATE) return;
    setGameCardIds((prevGameCardIds) => [...prevGameCardIds, gameCardId]);
  };

  const faceDownCards = (): void => {
    setTimeout(() => {
      dispatch({ type: GAME_ACTION_TYPES.FACE_DOWN_CARDS });
    }, (timeUntilFaceDownCardsInSeconds as number) * 500);
  };

  const faceUpCard = (cardId: number): void => {
    dispatch({ type: GAME_ACTION_TYPES.FACE_UP_CARD, payload: { cardId } });
  };

  const addToFoundPairs = (cardId: number): void => {
    dispatch({ type: GAME_ACTION_TYPES.ADD_TO_FOUND_PAIRS, payload: { cardId } });
  };

  const validateGameMove = (): void => {
    const [firstCard, secondCard] = gameCardIds;
    setIsValidGameMove(firstCard === secondCard);
  };

  const initGameMove = (): void => {
    setGameCardIds([]);
    setIsValidGameMove(undefined);
  };

  const clearGameInterval = (): void => {
    if(INTERVAL) {
      clearInterval(INTERVAL);
      INTERVAL = undefined;
    }
  };
  
  const startTimer = (): void => {
    let timeLeft = gameTimer as number;
    INTERVAL = setInterval(() => {
      if(timeLeft <= 0) return;
      else {
        timeLeft -= 1;
        setGameTimer(timeLeft);
      }
    }, 1000) as unknown as number;
  };

  const endGame = (): void => {
    clearGameInterval();
    dispatch({ type: GAME_ACTION_TYPES.SET_GAME_OVER });
    dispatch({ type: GAME_ACTION_TYPES.SET_COUNT_DOWN_TIME, payload: { timer: durationInSeconds as number } });
  };

  const startGame = async (data: Contributor[], config?: GameConfig): Promise<void> => {
    dispatch({ type: GAME_ACTION_TYPES.INIT_GAME, payload: { data, config } });
    setGameTimer(config?.durationInSeconds || durationInSeconds);
  };

  useEffect(() => {
    if(gameCardIds.length === NUMBER_OF_CARDS_TO_VALIDATE) validateGameMove();
  }, [gameCardIds]);

  useEffect(() => {
    if(foundPairs.length === pairsOfCards) endGame();
  }, [foundPairs]);

  useEffect(() => {
    if(typeof gameTimer === 'number') {
      if(!INTERVAL) startTimer();
      if(gameTimer === 0) endGame();
      else {
        dispatch({type: GAME_ACTION_TYPES.SET_COUNT_DOWN_TIME, payload: { timer: gameTimer as number } });    
      }
    }
  }, [gameTimer]);

  return {
    isValidGameMove,
    gameCardIds,
    addGameCardId,
    faceDownCards,
    faceUpCard,
    addToFoundPairs,
    initGameMove,
    startGame,
  };
};

export default useGame;
