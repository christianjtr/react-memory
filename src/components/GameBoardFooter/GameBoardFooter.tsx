import React from 'react';
import { useGameContext } from '../../hooks';

const GameBoardFooter = (): React.ReactElement => {
  const {
    state: { score, timer },
  } = useGameContext();

  return (
    <div className="flex my-5 text-xl">
      <div className="w-1/2 font-medium">{`Time: ${timer}`}</div>
      <div className="w-1/2 text-right font-medium">{`Score: ${score}`}</div>
    </div>
  );
};

export default GameBoardFooter;
