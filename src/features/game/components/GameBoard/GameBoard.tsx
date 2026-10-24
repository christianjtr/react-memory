import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { useGithubContributors } from '@/features/contributors/hooks/useGithubContributors';
import { Card } from '../Card/Card';
import { GameBoardFooter } from '../GameBoardFooter/GameBoardFooter';
import { GameBoardHeader } from '../GameBoardHeader/GameBoardHeader';
import { GameOverModal } from '../GameOverModal/GameOverModal';
import { useGame } from '../../hooks/useGame';
import { useGameState } from '../../hooks/useGameContext';

export function GameBoard(): ReactElement {
  const { cards, status } = useGameState();
  const { contributors, isLoading, error, fetchData } = useGithubContributors();
  const { selectCard, startGame, isMovePending } = useGame();
  const [gameError, setGameError] = useState<string | null>(null);

  const startNewGame = useCallback((): void => {
    try {
      startGame(contributors);
      setGameError(null);
    } catch (caught) {
      setGameError(
        caught instanceof Error ? caught.message : 'No se pudo iniciar la partida.',
      );
    }
  }, [contributors, startGame]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (contributors.length === 0) return;

    startNewGame();
  }, [contributors, startNewGame]);

  const handleRetry = (): void => {
    void fetchData();
  };

  const isBoardDisabled = isMovePending || status !== 'playing';

  const renderContent = (): ReactElement => {
    if (isLoading && cards.length === 0) {
      return (
        <p role="status" className="py-10 text-center text-lg text-slate-600">
          Cargando contribuyentes...
        </p>
      );
    }

    if (error !== null || gameError !== null) {
      return (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg text-red-800">{error ?? gameError}</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 font-semibold text-white transition hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
            onClick={handleRetry}>
            Reintentar
          </button>
        </div>
      );
    }

    if (cards.length === 0) {
      return (
        <p role="status" className="py-10 text-center text-lg text-slate-600">
          No hay contribuyentes disponibles.
        </p>
      );
    }

    return (
      <div
        role="group"
        aria-label="Tablero de memoria"
        className="grid grid-cols-3 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.cardId}
            card={card}
            disabled={isBoardDisabled}
            onSelect={selectCard}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
        <GameBoardHeader />
        {renderContent()}
        <GameBoardFooter />
      </main>
      <GameOverModal onOk={startNewGame} />
    </div>
  );
}
