import { GameConfig, GameCard } from '../../types';

export interface GameStateInterface {
    cards: GameCard[];
    score: number;
    config: GameConfig; 
}

const defaultConfig: GameConfig = {
  durationInSeconds: 60,
  pairsOfCards: 6
};

const GameState: GameStateInterface = {
  cards: [],
  score: 0,
  config: defaultConfig,
};

export default GameState;
