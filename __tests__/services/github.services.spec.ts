import { GithubContributor } from '../../src/types/Contributor';
import response from '../../__responses__/githubcontributors';

import { fetchRepositoryContributors, BASE_API_URL } from '../../src/services/github.services';

describe('github.services', () => {

  const githubContributors: GithubContributor[] = response;

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(githubContributors),
    }),
  ) as jest.Mock;  
  
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('fetchRepositoryContributors service', () => {
    it('should fetch contributors', async () => {
    
      const result = await fetchRepositoryContributors();
    
      expect(result).toStrictEqual(githubContributors);
      expect(fetch).toHaveBeenCalledWith(`${BASE_API_URL}/facebook/react/contributors`);
    });
    
    it('should fetch contributors given arguments', async () => {
        
      const result = await fetchRepositoryContributors('owner', 'repository');
    
      expect(result).toStrictEqual(githubContributors);
      expect(fetch).toHaveBeenCalledWith(`${BASE_API_URL}/owner/repository/contributors`);
    });

    it('sad path: should fetch contributors given arguments', async () => {
      const customError = new Error('API is down');        

      (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(customError));
      
      expect(async () => await fetchRepositoryContributors()).rejects.toThrowError(customError);
    });

  });
  
  
});
