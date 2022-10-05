import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';

import Card, { CardProps } from '../../src/components/Card/Card';

describe('Card component', () => {
  const onClickCardCallback = jest.fn();

  const faceDownCardData: CardProps = {
    data: {
      data: {
        id: 1,
        loginName: 'Contributor',
        avatarURL: 'dummy-url',
      },
      isFaceDown: true,
      id: 12345,
    },
    onClick: onClickCardCallback,
    className: 'dummy-class',
  };
  const faceUpCardData: CardProps = {
    data: {
      data: {
        id: 1,
        loginName: 'Contributor',
        avatarURL: 'dummy-url',
      },
      isFaceDown: false,
      id: 12345,
    },
    onClick: onClickCardCallback,
    className: 'dummy-class',
  };

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('should render the component correctly', () => {
    const renderer = createRenderer();
    const component = renderer.render(<Card {...faceDownCardData} />);

    expect(component).toBeDefined();
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should render the image element correctly - faceDown', () => {
    const { container } = render(<Card {...faceDownCardData} />);

    const imageContainer = container.getElementsByClassName('memory-card__overlay');
    const image = screen.getByRole('img');

    expect(imageContainer).toBeDefined();
    expect(imageContainer.length).toBe(1);

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', faceDownCardData.data.data.avatarURL);
    expect(image).toHaveAttribute('alt', faceDownCardData.data.data.loginName);
  });

  it('should render the image element correctly - faceUp', () => {
    const { container } = render(<Card {...faceUpCardData} />);

    const imageContainer = container.getElementsByClassName('memory-card__overlay');
    const image = screen.getByRole('img');

    expect(imageContainer.length).toBe(0);
    expect(image).toBeInTheDocument();
  });

  it('should call the event handler when clicking on the memory card', () => {
    render(<Card {...faceDownCardData} />);

    const divButtonElement = screen.getByRole('button');

    expect(divButtonElement).toBeDefined();
    expect(typeof divButtonElement.onclick === 'function').toBeTruthy();

    act(() => {
      fireEvent.click(divButtonElement);
    });

    expect(onClickCardCallback).toHaveBeenCalled();
  });
});
