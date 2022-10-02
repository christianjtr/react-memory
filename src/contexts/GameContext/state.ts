import { GameConfig, GameCard, Contributor } from '../../types';

export interface GameStateInterface {
    cards: GameCard[];
    foundPairs: Contributor['id'][];
    score: number;
    config: GameConfig; 
    isGameOver: boolean;
}

const defaultConfig: GameConfig = {
  durationInSeconds: 60,
  pairsOfCards: 6,
  scoreMultiplier: 100,
  timeUntilFaceDownCardsInSeconds: 1,
};

const GameState: GameStateInterface = {
  cards: [],
  foundPairs: [],
  score: 0,
  config: defaultConfig,
  isGameOver: false,
};

export default GameState;
