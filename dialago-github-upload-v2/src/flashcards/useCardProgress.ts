import { useCallback, useEffect, useState } from 'react';
import { applyRating, applySwipeOutcome } from './cardProgress';
import type { CardProgress, ReviewRating, SwipeOutcome } from './types';

const STORAGE_KEY = 'dialago-card-progress-v1';

type ProgressMap = Record<string, CardProgress>;

function readProgressMap(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeProgressMap(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function clearAllCardProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function useCardProgress() {
  const [progressMap, setProgressMap] = useState<ProgressMap>(() => readProgressMap());

  useEffect(() => {
    writeProgressMap(progressMap);
  }, [progressMap]);

  const getProgress = useCallback(
    (cardId: string): CardProgress | undefined => progressMap[cardId],
    [progressMap],
  );

  const recordRating = useCallback((cardId: string, rating: ReviewRating) => {
    setProgressMap((prev) => ({
      ...prev,
      [cardId]: applyRating(prev[cardId], rating),
    }));
  }, []);

  const recordSwipe = useCallback((cardId: string, outcome: SwipeOutcome) => {
    setProgressMap((prev) => ({
      ...prev,
      [cardId]: applySwipeOutcome(prev[cardId], outcome),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    clearAllCardProgress();
    setProgressMap({});
  }, []);

  return { getProgress, recordRating, recordSwipe, resetProgress, progressMap };
}
