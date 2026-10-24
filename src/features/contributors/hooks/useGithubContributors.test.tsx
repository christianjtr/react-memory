import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  contributorsFixture,
  githubContributorsFixture,
} from '@/test/fixtures/contributors';
import type { GithubContributor } from '../types';
import { useGithubContributors } from './useGithubContributors';
import * as githubApi from '../api/github';

vi.mock('../api/github', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/github')>();

  return {
    ...actual,
    fetchRepositoryContributors: vi.fn(),
  };
});

const fetchRepositoryContributorsMock = vi.mocked(githubApi.fetchRepositoryContributors);

describe('useGithubContributors', () => {
  beforeEach(() => {
    fetchRepositoryContributorsMock.mockReset();
  });

  it('starts with an empty state', () => {
    const { result } = renderHook(() => useGithubContributors());

    expect(result.current).toMatchObject({
      contributors: [],
      isLoading: false,
      error: null,
    });
  });

  it('loads and adapts contributors', async () => {
    fetchRepositoryContributorsMock.mockResolvedValue(githubContributorsFixture);

    const { result } = renderHook(() => useGithubContributors());
    const repository = { owner: 'facebook', name: 'react' };

    await act(async () => {
      await result.current.fetchData(repository);
    });

    expect(fetchRepositoryContributorsMock).toHaveBeenCalledWith(
      repository,
      expect.any(AbortSignal),
    );
    expect(result.current).toMatchObject({
      contributors: contributorsFixture,
      isLoading: false,
      error: null,
    });
  });

  it('reports when no valid contributors are available', async () => {
    fetchRepositoryContributorsMock.mockResolvedValue([]);

    const { result } = renderHook(() => useGithubContributors());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.contributors).toEqual([]);
    expect(result.current.error).toBe(
      'No se encontraron contribuyentes válidos para este repositorio.',
    );
  });

  it('reports API failures', async () => {
    fetchRepositoryContributorsMock.mockRejectedValue(
      new githubApi.GithubApiError('GitHub no está disponible.'),
    );

    const { result } = renderHook(() => useGithubContributors());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current).toMatchObject({
      contributors: [],
      isLoading: false,
      error: 'GitHub no está disponible.',
    });
  });

  it('uses a generic message for unknown failures', async () => {
    fetchRepositoryContributorsMock.mockRejectedValue('unexpected');

    const { result } = renderHook(() => useGithubContributors());

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.error).toBe('No se pudieron cargar los contribuyentes.');
  });

  it('ignores stale responses when a new request starts', async () => {
    let resolveFirstRequest: (value: GithubContributor[]) => void = () => undefined;
    const firstRequest = new Promise<GithubContributor[]>((resolve) => {
      resolveFirstRequest = resolve;
    });

    fetchRepositoryContributorsMock
      .mockReturnValueOnce(firstRequest)
      .mockResolvedValueOnce(githubContributorsFixture);

    const { result } = renderHook(() => useGithubContributors());
    let firstCall: Promise<void> = Promise.resolve();

    act(() => {
      firstCall = result.current.fetchData();
    });

    await act(async () => {
      await result.current.fetchData();
    });

    expect(result.current.contributors).toHaveLength(contributorsFixture.length);

    resolveFirstRequest([githubContributorsFixture[0]!]);

    await act(async () => {
      await firstCall;
    });

    expect(result.current.contributors).toHaveLength(contributorsFixture.length);
  });

  it('aborts the active request on unmount', async () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    let resolveRequest: (value: GithubContributor[]) => void = () => undefined;

    fetchRepositoryContributorsMock.mockReturnValue(
      new Promise<GithubContributor[]>((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { result, unmount } = renderHook(() => useGithubContributors());
    let request: Promise<void> = Promise.resolve();

    act(() => {
      request = result.current.fetchData();
    });

    unmount();

    expect(abortSpy).toHaveBeenCalled();

    resolveRequest(githubContributorsFixture);

    await act(async () => {
      await request;
    });
  });
});
