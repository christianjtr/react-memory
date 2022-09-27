import React, { useEffect } from 'react';
import { useGameContext, useGithubContributors } from '../../hooks';
import { GAME_ACTION_TYPES } from '../../contexts/action-types';
import Card from '../Card/Card';

const Gameboard = (): React.ReactElement => {
  const {
    dispatch,
    state: {
      cards,
      score,
      config: { durationInSeconds },
    },
  } = useGameContext();

  const { contributors, fetchData } = useGithubContributors();

  useEffect(() => {
    if (contributors.length > 0) {
      dispatch({ type: GAME_ACTION_TYPES.INIT_GAME, payload: { cards: contributors } });
    }
  }, [contributors]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto flex h-screen">
      <div className="w-3/5 m-auto">
        <h1 className="my-5 text-3xl text-center">Github Memory</h1>
        <div className="grid grid-cols-4 gap-4 ">
          {cards.map((card, index) => (
            <Card key={`${card.id}_${index}`} data={card} className="drop-shadow-md" />
          ))}
        </div>
        <div className="flex my-5">
          <div className="w-1/2 font-medium">{`Time: ${durationInSeconds}`}</div>
          <div className="w-1/2 text-right font-medium">{`Score: ${score}`}</div>
        </div>
      </div>
    </div>
  );
};

export default Gameboard;
