import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { motion } from 'motion/react';
import { useGithubContributors } from '@/features/contributors/hooks/useGithubContributors';
import {
  formatRepository,
  getInitialRepository,
  isSameRepository,
  pickRandomRepository,
} from '@/features/contributors/lib/repositories';
import { DailyChallengePanel } from '@/features/daily/components/DailyChallengePanel';
import { DAILY_DIFFICULTY } from '@/features/daily/lib/dailyChallenge';
import { useDailyChallenge } from '@/features/daily/hooks/useDailyChallenge';
import { PlayerSettingsModal } from '@/features/player/components/PlayerSettingsModal';
import { usePlayerProfile } from '@/features/player/hooks/usePlayerProfile';
import { RecordsModal } from '@/features/records/components/RecordsModal';
import { useRecords } from '@/features/records/hooks/useRecords';
import { BoardSkeleton } from '../BoardSkeleton/BoardSkeleton';
import { Card } from '../Card/Card';
import { DifficultySelector } from '../DifficultySelector/DifficultySelector';
import { GameBoardFooter } from '../GameBoardFooter/GameBoardFooter';
import { GameBoardHeader } from '../GameBoardHeader/GameBoardHeader';
import { GameResultsModal } from '../GameResultsModal/GameResultsModal';
import { useGame } from '../../hooks/useGame';
import { useGameState } from '../../hooks/useGameContext';
import { getDifficulty, type DifficultyId } from '../../lib/difficulty';
import { buildRoundResult } from '../../lib/roundResult';

export function GameBoard(): ReactElement {
  const gameState = useGameState();
  const {
    cards,
    status,
    isGameOver,
    pendingResolution,
    selectedCardIds,
    difficulty,
    repository,
  } = gameState;
  const { contributors, contributorsRepository, isLoading, error, fetchData } =
    useGithubContributors();
  const { selectCard, startGame, resetGame, setDifficulty, setRepository, setMode, isMovePending } =
    useGame();
  const { profile, saveNickname } = usePlayerProfile();
  const { records, saveRound } = useRecords();
  const {
    challenge,
    hasPlayedToday,
    todayScore,
    bestScore: dailyBestScore,
    secondsUntilNext,
    saveDailyResult,
  } = useDailyChallenge();
  const [gameError, setGameError] = useState<string | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [isPlayerSettingsOpen, setIsPlayerSettingsOpen] = useState(false);
  const [isRecordsOpen, setIsRecordsOpen] = useState(false);
  const previousBestScore = useRef(records.globalBestScore);
  const recordedRoundRef = useRef<number | null>(null);
  const hasInitializedRepository = useRef(false);

  const bestScore = records.globalBestScore;

  useEffect(() => {
    if (hasInitializedRepository.current) return;

    hasInitializedRepository.current = true;
    setRepository(getInitialRepository());
  }, [setRepository]);

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
    if (repository === null) return;

    void fetchData(repository);
  }, [fetchData, repository]);

  useEffect(() => {
    if (contributors.length === 0) return;
    if (contributorsRepository === null || repository === null) return;
    if (!isSameRepository(contributorsRepository, repository)) return;

    startNewGame();
  }, [contributors, contributorsRepository, repository, startNewGame]);

  useEffect(() => {
    if (!isGameOver) {
      recordedRoundRef.current = null;
      previousBestScore.current = bestScore;
      setIsNewRecord(false);
      return;
    }

    const result = buildRoundResult(gameState);
    if (result === null) return;

    const startedAt = gameState.round?.startedAt ?? null;
    if (recordedRoundRef.current === startedAt) return;
    recordedRoundRef.current = startedAt;

    if (result.mode === 'daily') {
      setIsNewRecord(result.score > dailyBestScore);
      saveDailyResult(result.score);
      return;
    }

    setIsNewRecord(result.score > previousBestScore.current);

    saveRound({
      difficulty: result.difficulty,
      score: result.score,
      accuracy: result.accuracy,
      elapsedSeconds: result.elapsedSeconds,
      pairsFound: result.pairsFound,
      errors: result.errors,
      bestStreak: result.bestStreak,
      won: result.outcome === 'won',
    });
  }, [bestScore, dailyBestScore, gameState, isGameOver, saveDailyResult, saveRound]);

  const handleRetry = (): void => {
    if (repository === null) return;

    void fetchData(repository);
  };

  const handleNewRepository = useCallback((): void => {
    resetGame();
    setGameError(null);
    setMode('classic');
    setRepository(pickRandomRepository(repository ?? undefined));
  }, [repository, resetGame, setMode, setRepository]);

  const handlePlayDaily = useCallback((): void => {
    resetGame();
    setGameError(null);
    setMode('daily', challenge.seed);
    setDifficulty(DAILY_DIFFICULTY);
    setRepository(challenge.repository);
  }, [challenge, resetGame, setDifficulty, setMode, setRepository]);

  const handleTryAnotherRepository = (): void => {
    handleNewRepository();
  };

  const handleDifficultyChange = useCallback(
    (nextDifficulty: DifficultyId): void => {
      setDifficulty(nextDifficulty);
    },
    [setDifficulty],
  );

  const isBoardDisabled = isMovePending || status !== 'playing';
  const mismatchCardIds = pendingResolution === 'mismatch' ? selectedCardIds : [];
  const pairCount = getDifficulty(difficulty).config.pairsOfCards;
  const repositoryLabel = repository === null ? '—' : formatRepository(repository);
  const isDailyMode = gameState.mode === 'daily';
  const displayBestScore = isDailyMode ? dailyBestScore : bestScore;

  const renderContent = (): ReactElement => {
    if (error !== null || gameError !== null) {
      return (
        <motion.div
          role="alert"
          className="rounded-3xl border border-rose-300 bg-rose-100/95 p-6 text-center shadow-card"
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
          <button
            type="button"
            className="mt-4 ml-3 rounded-xl border border-rose-300 bg-white/75 px-5 py-2.5 font-black text-rose-800 transition hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-700"
            onClick={handleTryAnotherRepository}>
            Otro repositorio
          </button>
        </motion.div>
      );
    }

    if ((isLoading || status === 'idle') && cards.length === 0) {
      return (
        <div role="status" className="py-2">
          <p className="mb-1 text-center text-sm font-bold text-violet-600">
            Cargando contribuyentes...
          </p>
          <p className="mb-4 text-center text-xs font-semibold text-violet-500/80">
            Repositorio: {repositoryLabel}
          </p>
          <BoardSkeleton count={pairCount * 2} />
        </div>
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
        <GameBoardHeader
          repositoryName={repositoryLabel}
          nickname={profile.nickname}
          isShuffleDisabled={isLoading || status === 'idle'}
          onShuffle={handleNewRepository}
          onOpenSettings={() => setIsPlayerSettingsOpen(true)}
          onOpenRecords={() => setIsRecordsOpen(true)}
        />

        <DailyChallengePanel
          challenge={challenge}
          hasPlayedToday={hasPlayedToday}
          todayScore={todayScore}
          bestScore={dailyBestScore}
          secondsUntilNext={secondsUntilNext}
          isPlayDisabled={isLoading}
          onPlay={handlePlayDaily}
        />

        <div className="mb-4 flex flex-col items-center gap-1.5">
          <DifficultySelector
            value={difficulty}
            disabled={
              isLoading ||
              status === 'idle' ||
              contributors.length === 0 ||
              isDailyMode
            }
            onChange={handleDifficultyChange}
          />
          <p className="text-[0.65rem] font-semibold text-violet-500/80">
            Cambiar la dificultad reinicia la partida
          </p>
        </div>

        <section
          aria-label="Zona de juego"
          className="rounded-[2rem] border border-white/80 bg-violet-50/80 p-3 shadow-[0_34px_80px_-46px_rgb(76_29_149_/_0.85)] backdrop-blur-xl sm:p-5">
          {renderContent()}
        </section>

        <GameBoardFooter bestScore={displayBestScore} />
      </main>

      <GameResultsModal
        onOk={handleNewRepository}
        onOpenRecords={() => setIsRecordsOpen(true)}
        bestScore={displayBestScore}
        isNewRecord={isNewRecord}
        nickname={profile.nickname}
      />

      <PlayerSettingsModal
        open={isPlayerSettingsOpen}
        nickname={profile.nickname}
        onClose={() => setIsPlayerSettingsOpen(false)}
        onSave={saveNickname}
      />

      <RecordsModal
        open={isRecordsOpen}
        records={records}
        onClose={() => setIsRecordsOpen(false)}
      />
    </div>
  );
}
