import type { RandomSource } from './random';

export function shuffle<T>(items: readonly T[], random?: RandomSource): T[] {
  const result = [...items];

  const pickIndex = (maxExclusive: number): number =>
    random === undefined
      ? Math.floor(Math.random() * maxExclusive)
      : random.int(maxExclusive);

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = pickIndex(index + 1);
    const current = result[index];
    const random_ = result[randomIndex];

    if (current === undefined || random_ === undefined) continue;

    result[index] = random_;
    result[randomIndex] = current;
  }

  return result;
}
