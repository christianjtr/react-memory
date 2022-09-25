import {GithubContributor, Contributor} from '../types/Contributor';

/**
 * @summary Map github contributors to app's contributors...
 * @param {Array<GithubContributor>} githubContributors - Collection of github contributors
 * @returns Collection of contributors
 */
function adaptGithubContributors(githubContributors: GithubContributor[]): Contributor[] {
  
  if(githubContributors.length === 0) return [];
  
  const contributors = githubContributors.map(({id, login, avatar_url}) => ({
    id: id,
    loginName: login,
    avatarURL: avatar_url,
  }));

  return contributors;
}

export {
  adaptGithubContributors,
};
