import { useCallback, useEffect, useRef, useState } from 'react';
import { adaptGithubContributors } from '../adapters/contributor';
import {
  DEFAULT_REPOSITORY,
  fetchRepositoryContributors,
  GithubApiError,
} from '../api/github';
import type { Contributor, Repository } from '../types';

interface GithubContributorsState {
  contributors: Contributor[];
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: GithubContributorsState = {
  contributors: [],
  isLoading: false,
  error: null,
};

const contributorsCache = new Map<string, Contributor[]>();

function getRepositoryKey(repository: Repository): string {
  return `${repository.owner}/${repository.name}`;
}

export function clearGithubContributorsCache(): void {
  contributorsCache.clear();
}

export function useGithubContributors() {
  const [state, setState] = useState<GithubContributorsState>(INITIAL_STATE);
  const activeRequest = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (repository?: Repository): Promise<void> => {
    activeRequest.current?.abort();

    const requestedRepository = repository ?? DEFAULT_REPOSITORY;
    const cachedContributors = contributorsCache.get(
      getRepositoryKey(requestedRepository),
    );

    if (cachedContributors !== undefined) {
      activeRequest.current = null;
      setState({ contributors: [...cachedContributors], isLoading: false, error: null });
      return;
    }

    const controller = new AbortController();
    activeRequest.current = controller;

    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await fetchRepositoryContributors(
        requestedRepository,
        controller.signal,
      );

      if (controller.signal.aborted) return;

      const contributors = adaptGithubContributors(data);

      if (contributors.length === 0) {
        throw new GithubApiError(
          'No se encontraron contribuyentes válidos para este repositorio.',
        );
      }

      contributorsCache.set(getRepositoryKey(requestedRepository), contributors);
      setState({ contributors: [...contributors], isLoading: false, error: null });
    } catch (error) {
      if (controller.signal.aborted) return;

      setState({
        contributors: [],
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los contribuyentes.',
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      activeRequest.current?.abort();
    };
  }, []);

  return { ...state, fetchData };
}
