import React, { useEffect } from 'react';
import { useGameContext, useGame } from '../../hooks';
import Card from '../Card/Card';
import GameBoardHeader from '../GameBoardHeader/GameBoardHeader';
import GameBoardFooter from '../GameBoardFooter/GameBoardFooter';

const Gameboard = (): React.ReactElement => {
  const {
    state: { cards },
  } = useGameContext();

  const { isValidGameMove, gameCardIds, ...GameFunctionalities } = useGame();

  const handleClickOnCard = (gameCardId: number, uniqueId: number): void => {
    GameFunctionalities.addGameCardId(uniqueId);
    if (isValidGameMove === undefined) GameFunctionalities.faceUpCard(gameCardId);
  };

  useEffect(() => {
    if (typeof isValidGameMove === 'boolean') {
      if (isValidGameMove) {
        const [cardId] = gameCardIds;
        GameFunctionalities.addToFoundPairs(cardId);
      } else {
        GameFunctionalities.faceDownCards();
      }
      GameFunctionalities.initGameMove();
    }
  }, [isValidGameMove]);

  useEffect(() => {
    GameFunctionalities.startGame();
  }, []);

  return (
    <div className="container mx-auto flex h-screen">
      <div className="w-3/5 m-auto">
        <GameBoardHeader />
        <div className="grid grid-cols-4 gap-4 ">
          {cards.map((card, index) => (
            <Card
              key={`${card.data.id}_${index}`}
              data={card}
              onClick={handleClickOnCard}
            />
          ))}
        </div>
        <GameBoardFooter />
      </div>
    </div>
  );
};

export default Gameboard;
