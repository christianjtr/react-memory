import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import { motion } from 'motion/react';
import { useGithubContributors } from '@/features/contributors/hooks/useGithubContributors';
import { BoardSkeleton } from '../BoardSkeleton/BoardSkeleton';
import { Card } from '../Card/Card';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { GameBoardFooter } from '../GameBoardFooter/GameBoardFooter';
import { GameBoardHeader } from '../GameBoardHeader/GameBoardHeader';
import { GameOverModal } from '../GameOverModal/GameOverModal';
import { useGame } from '../../hooks/useGame';
import { useBestScore } from '../../hooks/useBestScore';
import { useGameState } from '../../hooks/useGameContext';
import {
  DEFAULT_DIFFICULTY,
  getDifficulty,
  type DifficultyId,
} from '../../lib/difficulty';

export function GameBoard(): ReactElement {
  const {
    cards,
    status,
    score,
    isGameOver,
    pendingResolution,
    selectedCardIds,
  } = useGameState();
  const { contributors, isLoading, error, fetchData } = useGithubContributors();
  const { selectCard, startGame, isMovePending } = useGame();
  const { bestScore, submitScore } = useBestScore();
  const [gameError, setGameError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyId>(DEFAULT_DIFFICULTY);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const previousBestScore = useRef(bestScore);

  const startNewGame = useCallback((): void => {
    try {
      startGame(contributors, getDifficulty(difficulty).config);
      setGameError(null);
    } catch (caught) {
      setGameError(
        caught instanceof Error ? caught.message : 'No se pudo iniciar la partida.',
      );
    }
  }, [contributors, difficulty, startGame]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (contributors.length === 0) return;

    startNewGame();
  }, [contributors, startNewGame]);

  useEffect(() => {
    if (!isGameOver) {
      previousBestScore.current = bestScore;
      setIsNewRecord(false);
      return;
    }

    const isRecord = score > previousBestScore.current;
    setIsNewRecord(isRecord);

    if (isRecord) {
      submitScore(score);
    }
  }, [bestScore, isGameOver, score, submitScore]);

  const handleRetry = (): void => {
    void fetchData();
  };

  const handleDifficultyChange = (nextDifficulty: DifficultyId): void => {
    setDifficulty(nextDifficulty);
  };

  const isBoardDisabled = isMovePending || status !== 'playing';
  const mismatchCardIds = pendingResolution === 'mismatch' ? selectedCardIds : [];
  const pairCount = getDifficulty(difficulty).config.pairsOfCards;

  const renderContent = (): ReactElement => {
    if (isLoading && cards.length === 0) {
      return (
        <div role="status" className="py-2">
          <p className="mb-4 text-center text-sm font-bold text-violet-600">
            Cargando contribuyentes...
          </p>
          <BoardSkeleton count={pairCount * 2} />
        </div>
      );
    }

    if (error !== null || gameError !== null) {
      return (
        <motion.div
          role="alert"
          className="rounded-3xl border border-rose-200 bg-rose-50/90 p-6 text-center shadow-card"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
          <p className="text-lg font-bold text-rose-800">{error ?? gameError}</p>
          <button
            type="button"
            className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 font-black text-white shadow-[0_14px_30px_-14px_rgb(225_29_72_/_0.9)] transition hover:bg-rose-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-700"
            onClick={handleRetry}>
            Reintentar
          </button>
        </motion.div>
      );
    }

    if (cards.length === 0) {
      return (
        <p role="status" className="py-10 text-center text-lg font-bold text-violet-700">
          No hay contribuyentes disponibles.
        </p>
      );
    }

    return (
      <div
        role="group"
        aria-label="Tablero de memoria"
        className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4">
        {cards.map((card, index) => (
          <Card
            key={card.cardId}
            card={card}
            index={index}
            disabled={isBoardDisabled}
            isMismatched={mismatchCardIds.includes(card.cardId)}
            onSelect={selectCard}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pb-4">
        <GameBoardHeader />

        <div className="mb-4 flex flex-col items-center gap-1.5">
          <DifficultySelector
            value={difficulty}
            disabled={isLoading || contributors.length === 0}
            onChange={handleDifficultyChange}
          />
          <p className="text-[0.65rem] font-semibold text-violet-500/80">
            Cambiar la dificultad reinicia la partida
          </p>
        </div>

        <section
          aria-label="Zona de juego"
          className="rounded-[2rem] border border-white/70 bg-white/50 p-3 shadow-[0_34px_80px_-46px_rgb(76_29_149_/_0.85)] backdrop-blur-xl sm:p-5">
          {renderContent()}
        </section>

        <GameBoardFooter bestScore={bestScore} />
      </main>

      <GameOverModal
        onOk={startNewGame}
        bestScore={bestScore}
        isNewRecord={isNewRecord}
      />
    </div>
  );
}
