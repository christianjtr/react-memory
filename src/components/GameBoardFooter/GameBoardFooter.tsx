import React from 'react';
import { useGameContext } from '../../hooks';

const GameBoardFooter = (): React.ReactElement => {
  const {
    state: {
      score,
      config: { durationInSeconds },
    },
  } = useGameContext();

  return (
    <div className="flex my-5">
      <div className="w-1/2 font-medium">{`Time: ${durationInSeconds}`}</div>
      <div className="w-1/2 text-right font-medium">{`Score: ${score}`}</div>
    </div>
  );
};

export default GameBoardFooter;
