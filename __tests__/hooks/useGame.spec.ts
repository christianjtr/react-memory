import { renderHook, act } from '@testing-library/react';

import useGame from '../../src/hooks/useGame';


const dispatchMock = jest.fn();
const timeUntilFaceDownCardsInSeconds = 2500;

jest.mock('../../src/hooks/useGameContext', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    dispatch: () => dispatchMock(), 
    state: { 
      config: { 
        timeUntilFaceDownCardsInSeconds: 5, 
        pairsOfCards: [], 
        durationInSeconds : 60
      }, 
      foundPairs: [] 
    }
  })
}));


describe('useGame custom hook', () => {
    
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should has the proper props and functions', () => {

    const {
      result: { current },
    } = renderHook(() => useGame());
    
    const {
      isValidGameMove,
      gameCardIds,
      addGameCardId,
      faceDownCards,
      faceUpCard,
      addToFoundPairs,
      initGameMove,
      startGame,
    } = current;

    expect(isValidGameMove).toBeUndefined();
    expect(gameCardIds).toStrictEqual([]);
    expect(typeof addGameCardId === 'function').toBeTruthy();
    expect(typeof faceDownCards === 'function').toBeTruthy();
    expect(typeof faceUpCard === 'function').toBeTruthy();
    expect(typeof addToFoundPairs === 'function').toBeTruthy();
    expect(typeof initGameMove === 'function').toBeTruthy();
    expect(typeof startGame === 'function').toBeTruthy();
  });

  describe('addGameCardId', () => {

    const {
      result: { current },
    } = renderHook(() => useGame());

    it('should execute the function properly', async () => {

      expect(current.gameCardIds).toEqual([]);
      
      act(() => {
        current.addGameCardId(1);
      });

      setTimeout(() => {
        expect(current.gameCardIds).toEqual([1]);
      }, 0);
    });
  });

  describe('faceUpCard', () => {
    
    const {
      result: { current },
    } = renderHook(() => useGame());
    
    it('should execute the function properly', () => {
      act(() => {
        current.faceUpCard(1);
      });

      expect(dispatchMock).toHaveBeenCalled();
    });
  });

  describe('addToFoundPairs', () => {
    
    const {
      result: { current },
    } = renderHook(() => useGame());
    
    it('should execute the function properly', () => {
      act(() => {
        current.addToFoundPairs(1);
      });

      expect(dispatchMock).toHaveBeenCalled();
    });
  });

  describe('faceDownCards', () => {
    
    const {
      result: { current },
    } = renderHook(() => useGame());
    
    it('should execute the function properly', () => {
      
      jest.useFakeTimers();
      
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
      
      act(() => {
        current.faceDownCards();
      });
      
      expect(setTimeoutSpy).toHaveBeenCalled();
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), timeUntilFaceDownCardsInSeconds);
      setTimeoutSpy.mockClear();
    });
  });

  describe('startGame', () => {
    
    const {
      result: { current },
    } = renderHook(() => useGame());
    
    it('should execute the function properly', () => {
      
      const dummyData = Array.from(Array(6).keys()).map((i) => ({id: i, loginName: 'name', avatarURL: 'dummy-url'}));
      
      act(() => {
        current.startGame(dummyData);
      });

      expect(dispatchMock).toHaveBeenCalled();
      
    });
  });

  describe('initGameMove', () => {
    
    const {
      result: { current },
    } = renderHook(() => useGame());
    
    it('should execute the function properly', () => {
      
      act(() => {
        current.initGameMove();
      });

      expect(current.gameCardIds).toEqual([]);
      expect(current.isValidGameMove).toEqual(undefined);
    });
  });
});
