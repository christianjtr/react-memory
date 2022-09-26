import React, { useEffect } from 'react';
import { useGameContext, useGithubContributors } from '../../hooks';
import { GAME_ACTION_TYPES } from '../../contexts/action-types';

const Gameboard = (): React.ReactElement => {
  const {
    dispatch,
    state: { cards },
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
    <div>
      <h1>Gameboard</h1>
      <h5>{cards.length}</h5>
    </div>
  );
};

export default Gameboard;
