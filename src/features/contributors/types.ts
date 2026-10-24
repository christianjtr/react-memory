export interface GithubContributor {
  readonly id: number;
  readonly login: string;
  readonly avatar_url: string;
}

export interface Contributor {
  readonly id: number;
  readonly loginName: string;
  readonly avatarURL: string;
}

export interface Repository {
  readonly owner: string;
  readonly name: string;
}
