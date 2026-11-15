export type ShareStatus =
  'idle' | 'sharing' | 'shared' | 'copied' | 'cancelled' | 'failed';

export interface SharePayload {
  readonly title: string;
  readonly text: string;
  readonly url: string;
  readonly imageUrl?: string;
  readonly imageFile?: File | null;
}

export interface ShareOutcome {
  readonly status: Exclude<ShareStatus, 'idle' | 'sharing'>;
  readonly message?: string;
}
