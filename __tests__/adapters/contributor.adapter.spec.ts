import { GithubContributor, Contributor } from '../../src/types/Contributor';
import response from '../../__responses__/githubcontributors';

import { adaptGithubContributors } from '../../src/adapters/contributor.adapter';

describe('contributor.adapter', () => {

  const githubContributors: GithubContributor[] = response;
  const expectedResult: Contributor[] = [
    {
      id: 8445,
      loginName: 'zpao',
      avatarURL: 'https://avatars.githubusercontent.com/u/8445?v=4'
    }
  ];

  it('should map the githubContributors into contributors', () => {
    const result = adaptGithubContributors(githubContributors);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toStrictEqual(expectedResult);
  });

  it('should not map contributors if input is empty', () => {
    const result = adaptGithubContributors([]);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toStrictEqual([]);
  });
});
