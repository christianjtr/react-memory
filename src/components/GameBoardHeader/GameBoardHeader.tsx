import React from 'react';

export interface GameBoardHeaderInterface {
  title?: string;
}

const GameBoardHeader: React.FC<GameBoardHeaderInterface> = (
  props: GameBoardHeaderInterface,
): React.ReactElement => {
  const { title = 'Github Memory' } = props;

  return <h1 className="my-5 text-3xl text-center">{title}</h1>;
};

export default GameBoardHeader;
