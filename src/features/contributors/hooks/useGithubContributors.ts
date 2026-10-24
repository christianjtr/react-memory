import { useCallback, useEffect, useRef, useState } from 'react';
import { adaptGithubContributors } from '../adapters/contributor';
import { fetchRepositoryContributors, GithubApiError } from '../api/github';
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

export function useGithubContributors() {
  const [state, setState] = useState<GithubContributorsState>(INITIAL_STATE);
  const activeRequest = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (repository?: Repository): Promise<void> => {
    activeRequest.current?.abort();

    const controller = new AbortController();
    activeRequest.current = controller;

    setState((current) => ({ ...current, isLoading: true, error: null }));

    try {
      const data = await fetchRepositoryContributors(repository, controller.signal);

      if (controller.signal.aborted) return;

      const contributors = adaptGithubContributors(data);

      if (contributors.length === 0) {
        throw new GithubApiError(
          'No se encontraron contribuyentes válidos para este repositorio.',
        );
      }

      setState({ contributors, isLoading: false, error: null });
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
