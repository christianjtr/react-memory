import React from 'react';
import { useGameContext } from '../../hooks';

const GameBoardFooter = (): React.ReactElement | null => {
  const {
    state: { score, timer },
  } = useGameContext();

  if (timer === undefined) return null;

  return (
    <div className="md:flex w-full my-5 text-xl font-med">
      <div className="md:flex-1">{`Time: ${timer}`}</div>
      <div className="md:flex-1 md:text-right">{`Score: ${score}`}</div>
    </div>
  );
};

export default GameBoardFooter;
