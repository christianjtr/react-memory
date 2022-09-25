import { useState, useEffect } from 'react';

import { Contributor } from '../types/Contributor';
import { fetchRepositoryContributors } from '../services/github.services';
import { adaptGithubContributors } from '../adapters/contributor.adapter';

interface GithubContributorHookInterface {
  isLoading: boolean;
  contributors: Contributor[];
  fetchData: (repository?: { owner: string; name: string }) => void;
}

const useGithubContributors = (): GithubContributorHookInterface => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);

  async function fetchData(repository?: { owner: string; name: string }): Promise<void> {
    setIsLoading(true);

    const data = await fetchRepositoryContributors(repository?.owner, repository?.name);

    setContributors(adaptGithubContributors(data));
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return {
    isLoading,
    contributors,
    fetchData,
  };
};

export default useGithubContributors;
