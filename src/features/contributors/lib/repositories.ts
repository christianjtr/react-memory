import type { Repository } from '../types';

export const REPOSITORY_POOL: readonly Repository[] = [
  { owner: 'facebook', name: 'react' },
  { owner: 'vercel', name: 'next.js' },
  { owner: 'microsoft', name: 'vscode' },
  { owner: 'tailwindlabs', name: 'tailwindcss' },
  { owner: 'vitejs', name: 'vite' },
  { owner: 'sveltejs', name: 'svelte' },
  { owner: 'vuejs', name: 'core' },
  { owner: 'angular', name: 'angular' },
  { owner: 'denoland', name: 'deno' },
  { owner: 'oven-sh', name: 'bun' },
  { owner: 'prisma', name: 'prisma' },
  { owner: 'axios', name: 'axios' },
  { owner: 'remix-run', name: 'react-router' },
  { owner: 'rust-lang', name: 'rust' },
  { owner: 'golang', name: 'go' },
  { owner: 'nodejs', name: 'node' },
  { owner: 'microsoft', name: 'TypeScript' },
  { owner: 'jestjs', name: 'jest' },
];

export function formatRepository(repository: Repository): string {
  return `${repository.owner}/${repository.name}`;
}

export function isSameRepository(first: Repository, second: Repository): boolean {
  return first.owner === second.owner && first.name === second.name;
}

export function pickRandomRepository(exclude?: Repository): Repository {
  const candidates =
    exclude === undefined
      ? REPOSITORY_POOL
      : REPOSITORY_POOL.filter((repository) => !isSameRepository(repository, exclude));
  const pool = candidates.length > 0 ? candidates : REPOSITORY_POOL;

  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function getInitialRepository(): Repository {
  const owner = import.meta.env.VITE_REPO_OWNER?.trim();
  const name = import.meta.env.VITE_REPO_NAME?.trim();

  if (owner !== undefined && owner.length > 0 && name !== undefined && name.length > 0) {
    return { owner, name };
  }

  return pickRandomRepository();
}
