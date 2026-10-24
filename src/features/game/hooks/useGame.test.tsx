import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { contributorsFixture } from '@/test/fixtures/contributors';
import { GameProvider } from '../context/GameContext';
import { useGame } from './useGame';
import { useGameDispatch, useGameState } from './useGameContext';

function wrapper({ children }: PropsWithChildren): ReactElement {
  return <GameProvider>{children}</GameProvider>;
}

function renderGame() {
  return renderHook(() => ({ game: useGame(), state: useGameState() }), {
    wrapper,
  });
}

describe('useGame', () => {
  it('requires a game provider', () => {
    expect(() => renderHook(() => useGameState())).toThrow(
      'useGameState must be used within a GameProvider',
    );
    expect(() => renderHook(() => useGameDispatch())).toThrow(
      'useGameDispatch must be used within a GameProvider',
    );
  });

  it('starts a game with a custom configuration', () => {
    const { result } = renderGame();

    act(() => {
      result.current.game.startGame(contributorsFixture.slice(0, 2), {
        pairsOfCards: 2,
        durationInSeconds: 2,
        scoreMultiplier: 10,
        timeUntilFaceDownCardsInSeconds: 0.01,
      });
    });

    expect(result.current.state).toMatchObject({
      status: 'playing',
      timer: 2,
      score: 0,
      isGameOver: false,
    });
    expect(result.current.state.cards).toHaveLength(4);
    expect(result.current.game.selectedCardIds).toEqual([]);
    expect(result.current.game.isMovePending).toBe(false);
  });

  it('resolves a matching pair', () => {
    const { result } = renderGame();

    act(() => {
      result.current.game.startGame(contributorsFixture.slice(0, 2), {
        pairsOfCards: 2,
        durationInSeconds: 2,
        scoreMultiplier: 10,
        timeUntilFaceDownCardsInSeconds: 0.01,
      });
    });

    const contributorId = result.current.state.cards[0]?.contributor.id;
    const pair = result.current.state.cards.filter(
      (card) => card.contributor.id === contributorId,
    );

    act(() => {
      result.current.game.selectCard(pair[0]!.cardId);
      result.current.game.selectCard(pair[1]!.cardId);
    });

    expect(result.current.state.foundContributorIds).toEqual([contributorId]);
    expect(result.current.state.score).toBe(10);
    expect(result.current.state.selectedCardIds).toEqual([]);
  });

  it('flips mismatched cards after the configured delay', async () => {
    vi.useFakeTimers();

    try {
      const { result } = renderGame();

      act(() => {
        result.current.game.startGame(contributorsFixture.slice(0, 2), {
          pairsOfCards: 2,
          durationInSeconds: 2,
          scoreMultiplier: 10,
          timeUntilFaceDownCardsInSeconds: 0.01,
        });
      });

      const firstCard = result.current.state.cards[0]!;
      const secondCard = result.current.state.cards.find(
        (card) => card.contributor.id !== firstCard.contributor.id,
      )!;

      act(() => {
        result.current.game.selectCard(firstCard.cardId);
        result.current.game.selectCard(secondCard.cardId);
      });

      expect(result.current.game.isMovePending).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10);
      });

      expect(result.current.game.isMovePending).toBe(false);
      expect(result.current.state.cards[firstCard.cardId]?.isFaceDown).toBe(true);
      expect(result.current.state.cards[secondCard.cardId]?.isFaceDown).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('counts down and ends the game', async () => {
    vi.useFakeTimers();

    try {
      const { result } = renderGame();

      act(() => {
        result.current.game.startGame(contributorsFixture.slice(0, 2), {
          pairsOfCards: 2,
          durationInSeconds: 2,
          scoreMultiplier: 10,
          timeUntilFaceDownCardsInSeconds: 0.01,
        });
      });

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      expect(result.current.state.timer).toBe(1);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });

      expect(result.current.state.timer).toBe(0);
      expect(result.current.state.status).toBe('finished');
      expect(result.current.state.isGameOver).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects games without enough contributors', () => {
    const { result } = renderGame();

    expect(() => {
      act(() => {
        result.current.game.startGame(contributorsFixture.slice(0, 1), {
          pairsOfCards: 2,
        });
      });
    }).toThrow('Se necesitan al menos 2 contribuyentes para iniciar la partida.');
  });
});
