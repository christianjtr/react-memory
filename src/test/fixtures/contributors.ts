import type { Contributor, GithubContributor } from '@/features/contributors/types';

export const githubContributorsFixture: GithubContributor[] = [
  {
    id: 1,
    login: 'octocat',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
  },
  {
    id: 2,
    login: 'mona',
    avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
  },
  {
    id: 3,
    login: 'hubot',
    avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
  },
  {
    id: 4,
    login: 'copilot',
    avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4',
  },
  {
    id: 5,
    login: 'dependabot',
    avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4',
  },
  {
    id: 6,
    login: 'github-actions',
    avatar_url: 'https://avatars.githubusercontent.com/u/6?v=4',
  },
];

export const contributorsFixture: Contributor[] = githubContributorsFixture.map(
  ({ id, login, avatar_url }) => ({
    id,
    loginName: login,
    avatarURL: avatar_url,
  }),
);
