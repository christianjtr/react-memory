import type { Contributor } from '@/features/contributors/types';
import { shuffle } from '@/lib/shuffle';
import type { GameCard } from '../types';

export function buildDeck(
  contributors: readonly Contributor[],
  numberOfPairs: number,
): GameCard[] {
  if (!Number.isInteger(numberOfPairs) || numberOfPairs < 1) {
    throw new RangeError('La cantidad de pares debe ser un entero positivo.');
  }

  const uniqueContributors = [
    ...new Map(
      contributors.map((contributor) => [contributor.id, contributor] as const),
    ).values(),
  ];

  if (uniqueContributors.length < numberOfPairs) {
    throw new RangeError(
      `Se necesitan al menos ${numberOfPairs} contribuyentes para iniciar la partida.`,
    );
  }

  const selectedContributors = shuffle(uniqueContributors).slice(0, numberOfPairs);
  const pairedContributors = selectedContributors.flatMap((contributor) => [
    contributor,
    contributor,
  ]);

  return shuffle(pairedContributors).map((contributor, cardId) => ({
    cardId,
    contributor,
    isFaceDown: true,
    isMatched: false,
  }));
}
