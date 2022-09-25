type GameConfig = {
    timeInSeconds: number;
    pairsOfCards: number;
}

export interface GameStateInterface {
    score: number;
    // addToScore: () => void;
    // initGame: (config: GameConfig) => void;
}

const GameState: GameStateInterface = {
  score: 0,
  // addToScore: () => ({}),
  // initGame: (config: GameConfig) => ({}),
};

export default GameState;