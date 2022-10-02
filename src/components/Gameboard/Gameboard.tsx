import React, { useEffect } from 'react';
import { useGameContext, useGithubContributors, useGame } from '../../hooks';
import { GAME_ACTION_TYPES } from '../../contexts/action-types';
import Card from '../Card/Card';
import GameBoardHeader from '../GameBoardHeader/GameBoardHeader';
import GameBoardFooter from '../GameBoardFooter/GameBoardFooter';

const Gameboard = (): React.ReactElement => {
  const {
    dispatch,
    state: {
      cards,
      config: { timeUntilFaceDownCardsInSeconds },
    },
  } = useGameContext();

  const { isValidGameMove, gameCardIds, ...GameFunctionalities } = useGame();

  const { contributors, fetchData } = useGithubContributors();

  const handleClickOnCard = (gameCardId: number, uniqueId: number): void => {
    GameFunctionalities.addGameCardId(uniqueId);
    if (isValidGameMove === undefined) {
      dispatch({ type: GAME_ACTION_TYPES.FACE_UP_CARD, payload: { cardId: gameCardId } });
    }
  };

  useEffect(() => {
    if (contributors.length > 0) {
      dispatch({ type: GAME_ACTION_TYPES.INIT_GAME, payload: { data: contributors } });
    }
  }, [contributors]);

  useEffect(() => {
    if (typeof isValidGameMove === 'boolean') {
      if (isValidGameMove) {
        const [cardId] = gameCardIds;
        dispatch({ type: GAME_ACTION_TYPES.ADD_TO_FOUND_PAIRS, payload: { cardId } });
      } else {
        GameFunctionalities.faceDownCards(
          () => dispatch({ type: GAME_ACTION_TYPES.FACE_DOWN_CARDS }),
          timeUntilFaceDownCardsInSeconds,
        );
      }
      GameFunctionalities.initGameMove();
    }
  }, [isValidGameMove]);

  useEffect(() => {
    fetchData();
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
