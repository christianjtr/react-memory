import { renderHook, act, waitFor } from '@testing-library/react';
import { Contributor } from '../../src/types/Contributor';
import { fetchRepositoryContributors } from '../../src/services/github.services';
import { adaptGithubContributors } from '../../src/adapters/contributor.adapter';
import response from '../../__responses__/githubcontributors';

import useGithubContributors from '../../src/hooks/useGithubContributors';

jest.mock('../../src/services/github.services', () => ({
  fetchRepositoryContributors: jest.fn(),
}));

jest.mock('../../src/adapters/contributor.adapter', () => ({
  adaptGithubContributors: jest.fn(),
}));

describe('useGithubContributors custom hook', () => {

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should has the proper props and functions', () => {
    const { result: { current } } = renderHook(() => useGithubContributors());

    const { isLoading, contributors, fetchData } = current;

    expect(isLoading).toBeFalsy();
    expect(contributors).toStrictEqual([]);
    expect(typeof fetchData === 'function').toBeTruthy();
    
  });

  it('should populate the contributor state property', async () => {

    const expectedResult: Contributor[] = [{
      id: 8445,
      loginName: 'zpao',
      avatarURL: 'https://avatars.githubusercontent.com/u/8445?v=4'
    }];

    (fetchRepositoryContributors as jest.Mock).mockImplementation(() => Promise.resolve(response))();
    (adaptGithubContributors as jest.Mock).mockImplementation(() => expectedResult)();
    
    const { result: { current } } = renderHook(() => useGithubContributors());
    const { fetchData } = current;

    await act(async () => {
      await fetchData();
    });

    expect(fetchRepositoryContributors).toHaveBeenCalled();
    expect(adaptGithubContributors).toHaveBeenCalled();

  });
});
