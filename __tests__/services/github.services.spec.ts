import { GithubContributor } from '../../src/types/Contributor';
import { fetchRepositoryContributors, BASE_API_URL } from '../../src/services/github.services';


const response: GithubContributor[] = [
  { 
    'login': 'zpao',
    'id': 8445,
    'node_id': 'MDQ6VXNlcjg0NDU=',
    'avatar_url': 'https://avatars.githubusercontent.com/u/8445?v=4',
    'gravatar_id': '',
    'url': 'https://api.github.com/users/zpao',
    'html_url': 'https://github.com/zpao',
    'followers_url': 'https://api.github.com/users/zpao/followers',
    'following_url': 'https://api.github.com/users/zpao/following{/other_user}',
    'gists_url': 'https://api.github.com/users/zpao/gists{/gist_id}',
    'starred_url': 'https://api.github.com/users/zpao/starred{/owner}{/repo}',
    'subscriptions_url': 'https://api.github.com/users/zpao/subscriptions',
    'organizations_url': 'https://api.github.com/users/zpao/orgs',
    'repos_url': 'https://api.github.com/users/zpao/repos',
    'events_url': 'https://api.github.com/users/zpao/events{/privacy}',
    'received_events_url': 'https://api.github.com/users/zpao/received_events',
    'type': 'User',
    'site_admin': false,
    'contributions': 1778
  }];

describe('github.services', () => {

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(response),
    }),
  ) as jest.Mock;  
  
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('fetchRepositoryContributors service', () => {
    it('should fetch contributors', async () => {
    
      const result = await fetchRepositoryContributors();
    
      expect(result).toStrictEqual(response);
      expect(fetch).toHaveBeenCalledWith(`${BASE_API_URL}/facebook/react/contributors`);
    });
    
    it('should fetch contributors given arguments', async () => {
        
      const result = await fetchRepositoryContributors('owner', 'repository');
    
      expect(result).toStrictEqual(response);
      expect(fetch).toHaveBeenCalledWith(`${BASE_API_URL}/owner/repository/contributors`);
    });

    it('sad path: should fetch contributors given arguments', async () => {
      const customError = new Error('API is down');        

      (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject(customError));
      
      expect(async () => await fetchRepositoryContributors()).rejects.toThrowError(customError);
    });

  });
  
  
});
