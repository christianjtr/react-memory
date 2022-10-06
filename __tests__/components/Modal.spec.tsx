import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';

import Modal from '../../src/components/Modal/Modal';

jest.mock('../../src/hooks', () => ({
  useGameContext: jest.fn().mockReturnValue({
    state: {
      isGameOver: true,
      score: 100,
    },
  }),
}));

describe('Modal component', () => {
  const handleOnOkCallBack = jest.fn();

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render the component correctly', async () => {
    const renderer = createRenderer();
    const component = renderer.render(<Modal onOk={handleOnOkCallBack} />);

    expect(component).toBeDefined();
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should check elements when the modal has been rendered', async () => {
    const { container } = render(<Modal onOk={handleOnOkCallBack} />);

    const modalElement = container.getElementsByClassName('modal');
    const scoreElement = screen.getByText('Score: 100');

    expect(modalElement.length).toBe(1);
    expect(scoreElement).toBeDefined();
  });

  it('should call handleOnOkCallBack when clicking on the button', async () => {
    render(<Modal onOk={handleOnOkCallBack} />);

    const buttonElement = screen.getByRole('button');

    expect(buttonElement).toBeDefined();
    expect(typeof buttonElement.onclick === 'function').toBeTruthy();

    act(() => {
      fireEvent.click(buttonElement);
    });

    expect(handleOnOkCallBack).toHaveBeenCalled();
  });

  it('should not display the modal if the game is not over', async () => {
    jest.doMock('../../src/hooks');
    const { useGameContext } = await import('../../src/hooks');
    (useGameContext as jest.Mock).mockReturnValue({
      state: {
        isGameOver: false,
        score: 100,
      },
    });

    const { container } = render(<Modal onOk={handleOnOkCallBack} />);
    const modalElement = container.getElementsByClassName('modal');

    expect(modalElement.length).toBe(0);
  });
});
