import { describe, expect, it } from 'vitest';
import { githubContributorsFixture } from '@/test/fixtures/contributors';
import { adaptGithubContributors } from './contributor';

describe('adaptGithubContributors', () => {
  it('maps valid github contributors', () => {
    expect(adaptGithubContributors(githubContributorsFixture)).toEqual(
      githubContributorsFixture.map(({ id, login, avatar_url }) => ({
        id,
        loginName: login,
        avatarURL: avatar_url,
      })),
    );
  });

  it('trims logins and removes duplicates', () => {
    const result = adaptGithubContributors([
      {
        id: 1,
        login: '  octocat  ',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      },
      {
        id: 1,
        login: 'octocat-duplicate',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      },
    ]);

    expect(result).toEqual([
      {
        id: 1,
        loginName: 'octocat',
        avatarURL: 'https://avatars.githubusercontent.com/u/1?v=4',
      },
    ]);
  });

  it('filters empty logins and unsafe avatars', () => {
    const result = adaptGithubContributors([
      { id: 1, login: '   ', avatar_url: 'https://avatars.githubusercontent.com/u/1' },
      { id: 2, login: 'http', avatar_url: 'http://avatars.githubusercontent.com/u/2' },
      { id: 3, login: 'evil', avatar_url: 'https://evil.example/avatar.png' },
      { id: 4, login: 'invalid', avatar_url: 'not-a-url' },
    ]);

    expect(result).toEqual([]);
  });
});
