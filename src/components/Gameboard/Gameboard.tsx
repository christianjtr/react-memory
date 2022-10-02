import React, { useEffect } from 'react';
import { useGameContext, useGame, useGithubContributors } from '../../hooks';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import GameBoardHeader from '../GameBoardHeader/GameBoardHeader';
import GameBoardFooter from '../GameBoardFooter/GameBoardFooter';

const Gameboard = (): React.ReactElement | null => {
  const {
    state: { cards },
  } = useGameContext();

  const { contributors, isLoading, fetchData } = useGithubContributors();
  const { isValidGameMove, gameCardIds, ...GameFunctionalities } = useGame();

  const handleClickOnCard = (gameCardId: number, uniqueId: number): void => {
    GameFunctionalities.addGameCardId(uniqueId);
    if (isValidGameMove === undefined) GameFunctionalities.faceUpCard(gameCardId);
  };

  useEffect(() => {
    if (typeof isValidGameMove === 'boolean') {
      if (isValidGameMove) {
        GameFunctionalities.addToFoundPairs(gameCardIds[0]);
      } else {
        GameFunctionalities.faceDownCards();
      }
      GameFunctionalities.initGameMove();
    }
  }, [isValidGameMove]);

  const initGameboard = (): void => {
    fetchData();
  };

  useEffect(() => {
    if (contributors.length > 0) {
      GameFunctionalities.startGame(contributors);
    }
  }, [contributors]);

  useEffect(() => {
    initGameboard();
  }, []);

  if (isLoading) return null;

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
      <Modal onOk={initGameboard} />
    </div>
  );
};

export default Gameboard;
