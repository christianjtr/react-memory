export type ShareStatus =
  'idle' | 'sharing' | 'shared' | 'copied' | 'cancelled' | 'failed';

export interface SharePayload {
  readonly title: string;
  readonly text: string;
  readonly url: string;
  readonly imageUrl: string;
}

export interface ShareOutcome {
  readonly status: Exclude<ShareStatus, 'idle' | 'sharing'>;
  readonly message?: string;
}
