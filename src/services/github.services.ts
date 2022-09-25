/* eslint-disable no-useless-catch */
import {GithubContributor} from '../types/Contributor';

const BASE_API_URL = 'https://api.github.com/repos';

/**
 * @summary Get contributors given the specified owner/repository
 * @param {string} [owner] Repository's owner
 * @param {string} [repository] Repository
 * @returns Collection of github contribuitors
 */
async function fetchRepositoryContributors(owner = 'facebook', repository = 'react'): Promise<GithubContributor[]> {
  try {
    const response = await fetch(`${BASE_API_URL}/${owner}/${repository}/contributors`);
    const contribuitors = response.json();
    return contribuitors;
  } catch(error) {
    // TODO: Add HttpError handler...
    throw error;
  }
}

export {
  fetchRepositoryContributors,
};
