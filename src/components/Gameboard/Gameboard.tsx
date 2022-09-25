import React from 'react';
import { useGameContext } from '../../hooks/useGameContext';

const Gameboard = (): React.ReactElement => {
  const {
    state: { score },
  } = useGameContext();

  return (
    <div>
      <h1>Gameboard</h1>
      <h5>{score}</h5>
    </div>
  );
};

export default Gameboard;
