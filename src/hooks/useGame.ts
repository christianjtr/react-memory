import { useState, useEffect } from 'react';

interface GameHookInterface {
    isValidGameMove: boolean | undefined;
    gameCardIds: number[];
    addGameCardId: (cardId: number) => void;
    faceDownCards: (callBack: () => void, time: number) => void;
    initGameMove: () => void;
}

const useGame = (): GameHookInterface => {

  const NUMBER_OF_CARDS_TO_VALIDATE = 2;
  
  const [isValidGameMove, setIsValidGameMove] = useState<boolean | undefined>(undefined);
  const [gameCardIds, setGameCardIds] = useState<number[]>([]);

  const validateGameMove = (): void => {
    const [firstCard, secondCard] = gameCardIds;
    console.log('IS VALID:', firstCard === secondCard);
    setIsValidGameMove(firstCard === secondCard);
  };

  const addGameCardId = (gameCardId: number): void => {
    if(gameCardIds.length === NUMBER_OF_CARDS_TO_VALIDATE) return;
    setGameCardIds((prevGameCardIds) => [...prevGameCardIds, gameCardId]);
  };

  const faceDownCards = (callBack: () => void, time: number): void => {
    setTimeout(() => {
      callBack();
    }, time * 500);
  };

  const initGameMove = (): void => {
    setGameCardIds([]);
    setIsValidGameMove(undefined);
  };

  useEffect(() => {
    if(gameCardIds.length === NUMBER_OF_CARDS_TO_VALIDATE) {
      validateGameMove();
    }
  }, [gameCardIds]);

  return {
    isValidGameMove,
    gameCardIds,
    addGameCardId,
    faceDownCards,
    initGameMove,
  };
};

export default useGame;
