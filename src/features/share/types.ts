export type ShareStatus = 'idle' | 'copied' | 'failed';

export type ShareChannel = 'whatsapp' | 'facebook' | 'x' | 'telegram' | 'linkedin';

export interface SharePayload {
  readonly title: string;
  readonly text: string;
  readonly url: string;
}
