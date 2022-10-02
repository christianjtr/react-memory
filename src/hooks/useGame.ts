import { useState, useEffect } from 'react';
import useGithubContributors from './useGithubContributors';
import useGameContext from './useGameContext';
import { GAME_ACTION_TYPES } from '../contexts/action-types';
import { GameConfig } from '../types';

interface GameHookInterface {
    isValidGameMove: boolean | undefined;
    gameCardIds: number[];
    addGameCardId: (cardId: number) => void;
    faceDownCards: () => void;
    faceUpCard: (cardId: number) => void;
    addToFoundPairs: (cardId: number) => void;
    initGameMove: () => void;
    startGame: (config?: GameConfig) => Promise<void>;
}

const useGame = (): GameHookInterface => {

  const NUMBER_OF_CARDS_TO_VALIDATE = 2;

  const { contributors, fetchData } = useGithubContributors();
  const { dispatch, state: { config: { timeUntilFaceDownCardsInSeconds, pairsOfCards }, foundPairs } } = useGameContext();
  
  const [isValidGameMove, setIsValidGameMove] = useState<boolean | undefined>(undefined);
  const [gameCardIds, setGameCardIds] = useState<number[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig | undefined>(undefined);

  const validateGameMove = (): void => {
    const [firstCard, secondCard] = gameCardIds;
    setIsValidGameMove(firstCard === secondCard);
  };

  const addGameCardId = (gameCardId: number): void => {
    if(gameCardIds.length === NUMBER_OF_CARDS_TO_VALIDATE) return;
    setGameCardIds((prevGameCardIds) => [...prevGameCardIds, gameCardId]);
  };

  const faceDownCards = (): void => {
    setTimeout(() => {
      dispatch({ type: GAME_ACTION_TYPES.FACE_DOWN_CARDS });
    }, timeUntilFaceDownCardsInSeconds * 500);
  };

  const faceUpCard = (cardId: number): void => {
    dispatch({ type: GAME_ACTION_TYPES.FACE_UP_CARD, payload: { cardId } });
  };

  const addToFoundPairs = (cardId: number): void => {
    dispatch({ type: GAME_ACTION_TYPES.ADD_TO_FOUND_PAIRS, payload: { cardId } });
  };

  const initGameMove = (): void => {
    setGameCardIds([]);
    setIsValidGameMove(undefined);
  };

  const startGame = async (config?: GameConfig): Promise<void> => {
    setGameConfig(config);
    fetchData();
  };

  useEffect(() => {
    if(contributors.length > 0) {
      dispatch({ type: GAME_ACTION_TYPES.INIT_GAME, payload: { data: contributors, config: gameConfig } });
    }
  }, [contributors]);
  
  
  useEffect(() => {
    if(gameCardIds.length === NUMBER_OF_CARDS_TO_VALIDATE) {
      validateGameMove();
    }
  }, [gameCardIds]);

  useEffect(() => {
    if(foundPairs.length === pairsOfCards) {
      dispatch({ type: GAME_ACTION_TYPES.SET_GAME_OVER });
    }
  }, [foundPairs]);

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
