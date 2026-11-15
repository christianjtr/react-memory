import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { Contributor, Repository } from '@/features/contributors/types';
import { contributorsFixture } from '@/test/fixtures/contributors';
import { createSeededRandom } from '@/lib/random';
import { GameProvider } from '../context/GameContext';
import type { GameConfig } from '../types';
import { useGame } from './useGame';
import { useGameDispatch, useGameState } from './useGameContext';

const repository: Repository = { owner: 'facebook', name: 'react' };

const testConfig: Partial<GameConfig> = {
  pairsOfCards: 2,
  durationInSeconds: 2,
  scoreMultiplier: 10,
  timeUntilFaceDownCardsInSeconds: 0.01,
};

function wrapper({ children }: PropsWithChildren): ReactElement {
  return <GameProvider>{children}</GameProvider>;
}

function renderGame() {
  return renderHook(() => ({ game: useGame(), state: useGameState() }), {
    wrapper,
  });
}

type GameRenderResult = ReturnType<typeof renderGame>['result'];

function startGame(
  result: GameRenderResult,
  contributors: readonly Contributor[],
  config: Partial<GameConfig> = testConfig,
): void {
  act(() => {
    result.current.game.setRepository(repository);
  });

  act(() => {
    result.current.game.startGame(contributors, { config });
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

  it('requires a selected repository before starting', () => {
    const { result } = renderGame();

    expect(() => {
      act(() => {
        result.current.game.startGame(contributorsFixture.slice(0, 2), {
          config: testConfig,
        });
      });
    }).toThrow('No hay un repositorio seleccionado para iniciar la partida.');
  });

  it('starts a game with a custom configuration', () => {
    const { result } = renderGame();

    startGame(result, contributorsFixture.slice(0, 2));

    expect(result.current.state).toMatchObject({
      status: 'playing',
      timer: 2,
      score: 0,
      isGameOver: false,
      outcome: null,
      moves: 0,
      errors: 0,
      streak: 0,
      bestStreak: 0,
    });
    expect(result.current.state.round).toMatchObject({
      mode: 'classic',
      repository,
    });
    expect(result.current.state.cards).toHaveLength(4);
    expect(result.current.game.selectedCardIds).toEqual([]);
    expect(result.current.game.isMovePending).toBe(false);
  });

  it('resolves a matching pair', () => {
    const { result } = renderGame();

    startGame(result, contributorsFixture.slice(0, 2));

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
    expect(result.current.state.moves).toBe(1);
    expect(result.current.state.errors).toBe(0);
    expect(result.current.state.streak).toBe(1);
    expect(result.current.state.selectedCardIds).toEqual([]);
  });

  it('flips mismatched cards after the configured delay', async () => {
    vi.useFakeTimers();

    try {
      const { result } = renderGame();

      startGame(result, contributorsFixture.slice(0, 2));

      const firstCard = result.current.state.cards[0]!;
      const secondCard = result.current.state.cards.find(
        (card) => card.contributor.id !== firstCard.contributor.id,
      )!;

      act(() => {
        result.current.game.selectCard(firstCard.cardId);
        result.current.game.selectCard(secondCard.cardId);
      });

      expect(result.current.game.isMovePending).toBe(true);
      expect(result.current.state.errors).toBe(1);
      expect(result.current.state.streak).toBe(0);

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

      startGame(result, contributorsFixture.slice(0, 2));

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
      expect(result.current.state.outcome).toBe('lost');
      expect(result.current.state.finalScore).toBe(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('rejects games without enough contributors', () => {
    const { result } = renderGame();

    act(() => {
      result.current.game.setRepository(repository);
    });

    expect(() => {
      act(() => {
        result.current.game.startGame(contributorsFixture.slice(0, 1), {
          config: { pairsOfCards: 2 },
        });
      });
    }).toThrow('Se necesitan al menos 2 contribuyentes para iniciar la partida.');
  });

  it('builds a deterministic deck in daily mode from the state seed', () => {
    const { result } = renderGame();

    act(() => {
      result.current.game.setRepository(repository);
      result.current.game.setMode('daily', 'github-memory:daily:2026-01-01');
    });

    act(() => {
      result.current.game.startGame(contributorsFixture, { config: testConfig });
    });

    const firstDeck = result.current.state.cards.map((card) => card.contributor.id);

    act(() => {
      result.current.game.startGame(contributorsFixture, { config: testConfig });
    });

    const secondDeck = result.current.state.cards.map((card) => card.contributor.id);

    expect(firstDeck).toEqual(secondDeck);
    expect(result.current.state.round).toMatchObject({ mode: 'daily' });
  });

  it('builds a different deck for a different daily seed', () => {
    const { result } = renderGame();

    act(() => {
      result.current.game.setRepository(repository);
      result.current.game.setMode('daily', 'github-memory:daily:2026-01-01');
    });

    act(() => {
      result.current.game.startGame(contributorsFixture, { config: testConfig });
    });

    const firstDeck = result.current.state.cards.map((card) => card.contributor.id);

    act(() => {
      result.current.game.setMode('daily', 'github-memory:daily:2026-01-02');
    });

    act(() => {
      result.current.game.startGame(contributorsFixture, { config: testConfig });
    });

    const secondDeck = result.current.state.cards.map((card) => card.contributor.id);

    expect(firstDeck).not.toEqual(secondDeck);
  });

  it('lets an explicit random source override the daily seed', () => {
    const { result } = renderGame();

    act(() => {
      result.current.game.setRepository(repository);
      result.current.game.setMode('daily', 'github-memory:daily:2026-01-01');
    });

    act(() => {
      result.current.game.startGame(contributorsFixture, {
        config: testConfig,
        random: createSeededRandom(12345),
      });
    });

    const firstDeck = result.current.state.cards.map((card) => card.contributor.id);

    act(() => {
      result.current.game.setMode('daily', 'github-memory:daily:2026-01-02');
    });

    act(() => {
      result.current.game.startGame(contributorsFixture, {
        config: testConfig,
        random: createSeededRandom(12345),
      });
    });

    const secondDeck = result.current.state.cards.map((card) => card.contributor.id);

    expect(firstDeck).toEqual(secondDeck);
  });
});
