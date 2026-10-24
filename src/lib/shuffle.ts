export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = result[index];
    const random = result[randomIndex];

    if (current === undefined || random === undefined) continue;

    result[index] = random;
    result[randomIndex] = current;
  }

  return result;
}
