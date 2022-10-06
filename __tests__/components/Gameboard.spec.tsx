import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';

import Modal from '../../src/components/Modal/Modal';
import GameBoardHeader from '../../src/components/GameBoardHeader/GameBoardHeader';
import GameBoardFooter from '../../src/components/GameBoardFooter/GameBoardFooter';

import Gameboard from '../../src/components/Gameboard/Gameboard';

expect;

jest.mock('../../src/hooks', () => ({
  useGameContext: jest.fn().mockReturnValue({
    state: {
      cards: [],
    },
  }),
  useGithubContributors: jest.fn().mockResolvedValue({
    contributors: [],
    isLoading: false,
    fetchData: jest.fn().mockResolvedValue([]),
  }),
  useGame: jest.fn().mockReturnValue({
    isValidGameMove: undefined,
    gameCardIds: [],
    GameFunctionalities: {
      addGameCardId: jest.fn(),
      faceUpCard: jest.fn(),
      addToFoundPairs: jest.fn(),
      faceDownCards: jest.fn(),
      initGameMove: jest.fn(),
      startGame: jest.fn(),
    },
  }),
}));

describe('Gameboard component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the component correctly', () => {
    const renderer = createRenderer();
    const component = renderer.render(<Gameboard />);

    expect(component).toBeDefined();
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should check the children components in shallow mode', () => {
    const renderer = createRenderer();
    renderer.render(<Gameboard />);

    const [firstChildren, modalComponent] = renderer.getRenderOutput().props.children;

    const childrenComponents = [GameBoardHeader, GameBoardFooter];

    childrenComponents.forEach((childComponent) => {
      const child = firstChildren.props.children.find(
        (item: React.ReactElement) => item.type === childComponent,
      );
      expect(child.type).toEqual(childComponent);
    });

    expect(modalComponent.type).toEqual(Modal);
  });
});
