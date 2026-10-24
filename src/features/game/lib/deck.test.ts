import { describe, expect, it } from 'vitest';
import { contributorsFixture } from '@/test/fixtures/contributors';
import { buildDeck } from './deck';

describe('buildDeck', () => {
  it('creates two cards per selected contributor', () => {
    const deck = buildDeck(contributorsFixture, 6);

    expect(deck).toHaveLength(12);
    expect(deck.map((card) => card.cardId)).toEqual(
      Array.from({ length: 12 }, (_value, index) => index),
    );
    expect(deck.every((card) => card.isFaceDown && !card.isMatched)).toBe(true);

    for (const contributor of contributorsFixture) {
      expect(deck.filter((card) => card.contributor.id === contributor.id)).toHaveLength(
        2,
      );
    }
  });

  it('limits the deck to the requested number of pairs', () => {
    const deck = buildDeck(contributorsFixture, 2);

    expect(deck).toHaveLength(4);
    expect(new Set(deck.map((card) => card.contributor.id)).size).toBe(2);
  });

  it('deduplicates contributors before building the deck', () => {
    const deck = buildDeck([...contributorsFixture, contributorsFixture[0]!], 6);

    expect(deck).toHaveLength(12);
    expect(new Set(deck.map((card) => card.contributor.id)).size).toBe(6);
  });

  it('rejects invalid pair counts', () => {
    expect(() => buildDeck(contributorsFixture, 0)).toThrow(
      'La cantidad de pares debe ser un entero positivo.',
    );
    expect(() => buildDeck(contributorsFixture, 1.5)).toThrow(
      'La cantidad de pares debe ser un entero positivo.',
    );
  });

  it('rejects decks without enough contributors', () => {
    expect(() => buildDeck(contributorsFixture.slice(0, 2), 3)).toThrow(
      'Se necesitan al menos 3 contribuyentes para iniciar la partida.',
    );
  });
});
