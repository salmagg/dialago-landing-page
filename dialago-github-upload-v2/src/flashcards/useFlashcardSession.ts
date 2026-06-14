import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { applyRating, pickInitialCardId, pickWeightedCardId } from './cardProgress';
import type { CardProgress, Flashcard, ReviewRating } from './types';

type SessionOptions = {
  cards: Flashcard[];
  deckId?: string;
  getProgress: (cardId: string) => CardProgress | undefined;
  onRate: (cardId: string, rating: ReviewRating) => void;
};

export function useFlashcardSession({ cards, deckId, getProgress, onRate }: SessionOptions) {
  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);
  const [currentId, setCurrentId] = useState(() => pickInitialCardId(cardIds, getProgress));
  const [flipped, setFlipped] = useState(false);
  const [sessionRatedIds, setSessionRatedIds] = useState<Set<string>>(() => new Set());
  const [history, setHistory] = useState<string[]>([]);
  const getProgressRef = useRef(getProgress);
  getProgressRef.current = getProgress;

  useEffect(() => {
    if (cardIds.length === 0) return;
    setCurrentId(pickInitialCardId(cardIds, (id) => getProgressRef.current(id)));
    setFlipped(false);
    setSessionRatedIds(new Set());
    setHistory([]);
  }, [deckId, cardIds]);

  const total = cards.length;
  const index = Math.max(0, cards.findIndex((c) => c.id === currentId));
  const card = cards[index >= 0 ? index : 0];

  useEffect(() => {
    setFlipped(false);
  }, [currentId]);

  const goToCard = useCallback(
    (cardId: string, pushHistory = true) => {
      if (!cardIds.includes(cardId)) return;
      if (pushHistory && currentId) {
        setHistory((prev) => [...prev, currentId]);
      }
      setCurrentId(cardId);
    },
    [cardIds, currentId],
  );

  const next = useCallback(() => {
    if (total === 0) return;
    const nextId = pickWeightedCardId(cardIds, getProgress, currentId);
    goToCard(nextId);
  }, [total, cardIds, getProgress, currentId, goToCard]);

  const prev = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const previousId = prevHistory[prevHistory.length - 1];
      setCurrentId(previousId);
      return prevHistory.slice(0, -1);
    });
  }, []);

  const toggleFlip = useCallback(() => setFlipped((value) => !value), []);

  const rateCard = useCallback(
    (rating: ReviewRating) => {
      if (!card) return;
      const updated = applyRating(getProgress(card.id), rating);
      onRate(card.id, rating);
      setSessionRatedIds((prev) => new Set(prev).add(card.id));
      const progressLookup = (id: string) => (id === card.id ? updated : getProgress(id));
      const nextId = pickWeightedCardId(cardIds, progressLookup, card.id);
      goToCard(nextId, true);
    },
    [card, onRate, cardIds, getProgress, goToCard],
  );

  const reviewedCount = sessionRatedIds.size;

  return {
    index: index >= 0 ? index : 0,
    total,
    card,
    flipped,
    setFlipped,
    toggleFlip,
    next,
    prev,
    ratings: sessionRatedIds,
    rateCard,
    reviewedCount,
    getProgress,
  };
}
