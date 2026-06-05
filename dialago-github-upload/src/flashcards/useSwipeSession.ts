import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Flashcard, SessionProgress, SwipeOutcome } from './types';

type Options = {
  cards: Flashcard[];
  deckId?: string;
  onSwipe: (cardId: string, outcome: SwipeOutcome) => void;
};

function buildInitialQueue(cards: Flashcard[]): string[] {
  return cards.map((card) => card.id);
}

export function useSwipeSession({ cards, deckId, onSwipe }: Options) {
  const cardMap = useMemo(() => new Map(cards.map((card) => [card.id, card])), [cards]);
  const initialTotal = cards.length;

  const [queue, setQueue] = useState<string[]>(() => buildInitialQueue(cards));
  const [flipped, setFlipped] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);
  const [learningIds, setLearningIds] = useState<Set<string>>(() => new Set());
  const [sessionStep, setSessionStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;

  useEffect(() => {
    if (cards.length === 0) return;
    setQueue(buildInitialQueue(cards));
    setFlipped(false);
    setMasteredCount(0);
    setLearningIds(new Set());
    setSessionStep(1);
    setIsComplete(false);
  }, [deckId, cards]);

  const currentId = queue[0] ?? null;
  const card = currentId ? cardMap.get(currentId) : undefined;

  useEffect(() => {
    setFlipped(false);
  }, [currentId]);

  const sessionProgress: SessionProgress = useMemo(
    () => ({
      currentCard: sessionStep,
      initialTotal,
      mastered: masteredCount,
      reviewing: learningIds.size,
    }),
    [sessionStep, initialTotal, masteredCount, learningIds.size],
  );

  const commitSwipe = useCallback(
    (outcome: SwipeOutcome) => {
      if (!currentId || isComplete) return;

      onSwipeRef.current(currentId, outcome);

      if (outcome === 'known') {
        setMasteredCount((count) => count + 1);
        setLearningIds((prev) => {
          const next = new Set(prev);
          next.delete(currentId);
          return next;
        });
        setQueue((prev) => {
          const next = prev.slice(1);
          if (next.length === 0) setIsComplete(true);
          return next;
        });
      } else {
        setLearningIds((prev) => new Set(prev).add(currentId));
        setQueue((prev) => [...prev.slice(1), currentId]);
      }

      setFlipped(false);
      setSessionStep((step) => step + 1);
    },
    [currentId, isComplete],
  );

  const restartDifficult = useCallback(() => {
    const difficult = Array.from(learningIds);
    if (difficult.length === 0) return;
    setQueue(difficult);
    setIsComplete(false);
    setFlipped(false);
    setMasteredCount(0);
    setSessionStep(1);
  }, [learningIds]);

  const skipToNext = useCallback(() => {
    if (!currentId || queue.length <= 1) return;
    setQueue((prev) => [...prev.slice(1), prev[0]]);
    setFlipped(false);
    setSessionStep((step) => step + 1);
  }, [currentId, queue.length]);

  const skipToPrev = useCallback(() => {
    if (queue.length <= 1) return;
    setQueue((prev) => {
      const last = prev[prev.length - 1];
      return [last, ...prev.slice(0, -1)];
    });
    setFlipped(false);
  }, [queue.length]);

  return {
    card,
    currentId,
    flipped,
    setFlipped,
    commitSwipe,
    isComplete,
    learningIds,
    learningCount: learningIds.size,
    sessionProgress,
    restartDifficult,
    skipToNext,
    skipToPrev,
    hasQueue: queue.length > 0,
  };
}
