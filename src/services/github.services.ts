/* eslint-disable no-useless-catch */
import {GithubContributor} from '../types/Contributor';

export const BASE_API_URL = 'https://api.github.com/repos';

/**
 * @summary Get contributors given the specified owner/repository
 * @param {string} [owner] Repository's owner
 * @param {string} [repositoryName] Repository name
 * @returns Collection of github contribuitors
 */
async function fetchRepositoryContributors(owner = 'facebook', repositoryName = 'react'): Promise<GithubContributor[]> {
  try {
    const response = await fetch(`${BASE_API_URL}/${owner}/${repositoryName}/contributors`);
    const contribuitors = response.json();
    return contribuitors;
  } catch(error) {
    throw error;
  }
}

export {
  fetchRepositoryContributors,
};
