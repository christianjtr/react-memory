import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';

import GameBoardFooter from '../../src/components/GameBoardFooter/GameBoardFooter';

jest.mock('../../src/hooks', () => ({
  useGameContext: jest.fn().mockReturnValue({
    state: {
      timer: 60,
      score: 100,
    },
  }),
}));

describe('GameBoardFooter component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the component correctly', () => {
    const renderer = createRenderer();
    const component = renderer.render(<GameBoardFooter />);

    expect(component).toBeDefined();
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should render the correct info', () => {
    render(<GameBoardFooter />);

    const timerElement = screen.getByText('Time: 60');
    const scoreElement = screen.getByText('Score: 100');

    expect(timerElement).toBeDefined();
    expect(scoreElement).toBeDefined();
  });
});
