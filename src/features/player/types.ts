export interface PlayerProfile {
  readonly nickname: string;
  readonly createdAt: number;
}

export const MAX_NICKNAME_LENGTH = 18;

export const DEFAULT_NICKNAME = 'Jugador';
