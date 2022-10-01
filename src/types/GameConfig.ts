import { Contributor } from './Contributor';

export type GameConfig = {
    durationInSeconds: number;
    pairsOfCards: number;
}

export type GameCard = {
    data: Contributor;
    id: number;
    isFaceDown: boolean;
}
