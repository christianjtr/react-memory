import { Contributor } from './Contributor';

export type GameConfig = {
    durationInSeconds?: number;
    pairsOfCards?: number;
    scoreMultiplier?: number;
    timeUntilFaceDownCardsInSeconds?: number;

}

export type GameCard = {
    data: Contributor;
    id: number;
    isFaceDown: boolean;
}
