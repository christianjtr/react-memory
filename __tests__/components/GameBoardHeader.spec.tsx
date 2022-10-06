import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, cleanup } from '@testing-library/react';
import { createRenderer } from 'react-test-renderer/shallow';

import GameBoardHeader from '../../src/components/GameBoardHeader/GameBoardHeader';

describe('GameBoardHeader component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render the component correctly', () => {
    const renderer = createRenderer();
    const component = renderer.render(<GameBoardHeader />);

    expect(component).toBeDefined();
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });

  it('should have the default title', () => {
    render(<GameBoardHeader />);

    const defaultVale = 'Github Memory';

    const h1Element = screen.getByText(defaultVale);

    expect(h1Element.textContent).toEqual(defaultVale);
  });

  it('should have a custom title', () => {
    const customTitle = 'Custom title';

    render(<GameBoardHeader title={customTitle} />);

    const h1Element = screen.getByText(customTitle);

    expect(h1Element.textContent).toEqual(customTitle);
  });
});
