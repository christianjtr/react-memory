import type { Contributor, GithubContributor } from '../types';

const ALLOWED_AVATAR_HOST = 'avatars.githubusercontent.com';

function isSafeAvatarUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === ALLOWED_AVATAR_HOST;
  } catch {
    return false;
  }
}

export function adaptGithubContributors(
  githubContributors: readonly GithubContributor[],
): Contributor[] {
  const seenIds = new Set<number>();

  return githubContributors.flatMap(({ id, login, avatar_url }) => {
    const loginName = login.trim();

    if (seenIds.has(id) || loginName.length === 0 || !isSafeAvatarUrl(avatar_url)) {
      return [];
    }

    seenIds.add(id);

    return [{ id, loginName, avatarURL: avatar_url }];
  });
}
