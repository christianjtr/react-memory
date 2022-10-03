import { GithubContributor, Contributor } from '../../src/types/Contributor';
import { adaptGithubContributors } from '../../src/adapters/contributor.adapter';

describe('contributor.adapter', () => {

  let githubContributors: GithubContributor[], expectedResult: Contributor[];

  beforeAll(() => {
    githubContributors = [
      { 
        'login': 'zpao',
        'id': 8445,
        'node_id': 'MDQ6VXNlcjg0NDU=',
        'avatar_url': 'https://avatars.githubusercontent.com/u/8445?v=4',
        'gravatar_id': '',
        'url': 'https://api.github.com/users/zpao',
        'html_url': 'https://github.com/zpao',
        'followers_url': 'https://api.github.com/users/zpao/followers',
        'following_url': 'https://api.github.com/users/zpao/following{/other_user}',
        'gists_url': 'https://api.github.com/users/zpao/gists{/gist_id}',
        'starred_url': 'https://api.github.com/users/zpao/starred{/owner}{/repo}',
        'subscriptions_url': 'https://api.github.com/users/zpao/subscriptions',
        'organizations_url': 'https://api.github.com/users/zpao/orgs',
        'repos_url': 'https://api.github.com/users/zpao/repos',
        'events_url': 'https://api.github.com/users/zpao/events{/privacy}',
        'received_events_url': 'https://api.github.com/users/zpao/received_events',
        'type': 'User',
        'site_admin': false,
        'contributions': 1778
      }];
    expectedResult = [
      {
        id: 8445,
        loginName: 'zpao',
        avatarURL: 'https://avatars.githubusercontent.com/u/8445?v=4'
      }
    ];
  });

  it('should map the githubContributors into contributors', () => {
    const result = adaptGithubContributors(githubContributors);

    expect(result).toStrictEqual(expectedResult);
  });

  it('should not map contributors if input is empty', () => {
    const result = adaptGithubContributors([]);

    expect(Array.isArray(result)).toBeTruthy();
    expect(result).toStrictEqual([]);
  });
});
