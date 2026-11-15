export type ShareStatus = 'idle' | 'copied' | 'failed';

export interface SharePayload {
  readonly url: string;
}
