import type { CardProgress, CardSwipeStatus, LearningStatus, ReviewRating, SwipeOutcome } from './types';

export const RATING_POINTS: Record<ReviewRating, number> = {
  again: 0,
  hard: 1,
  good: 2,
};

export function createEmptyProgress(): CardProgress {
  return {
    correctCount: 0,
    difficultyScore: 0,
    lastReviewed: null,
    reviewCount: 0,
  };
}

export function applySwipeOutcome(progress: CardProgress | undefined, outcome: SwipeOutcome): CardProgress {
  const base = progress ?? createEmptyProgress();
  const status: CardSwipeStatus = outcome === 'known' ? 'known' : 'learning';

  return {
    correctCount: base.correctCount + (outcome === 'known' ? 1 : 0),
    difficultyScore: base.difficultyScore + (outcome === 'known' ? 2 : 0),
    lastReviewed: Date.now(),
    reviewCount: base.reviewCount + 1,
    lastRating: outcome === 'known' ? 'good' : 'again',
    status,
  };
}

export function applyRating(progress: CardProgress | undefined, rating: ReviewRating): CardProgress {
  const base = progress ?? createEmptyProgress();
  const points = RATING_POINTS[rating];

  return {
    correctCount: base.correctCount + (rating === 'good' ? 1 : 0),
    difficultyScore: base.difficultyScore + points,
    lastReviewed: Date.now(),
    reviewCount: base.reviewCount + 1,
    lastRating: rating,
  };
}

export function getAverageScore(progress: CardProgress | undefined): number {
  if (!progress || progress.reviewCount === 0) return 0;
  return progress.difficultyScore / progress.reviewCount;
}

export function getLearningStatus(progress: CardProgress | undefined): LearningStatus {
  if (!progress || progress.reviewCount === 0) return 'needs_practice';

  if (progress.status === 'known' && progress.correctCount >= 1) return 'mastered';
  if (progress.status === 'learning') return 'needs_practice';

  const avg = getAverageScore(progress);

  if (avg >= 1.65 && progress.correctCount >= 2) return 'mastered';
  if (progress.lastRating === 'again' && avg < 1.2) return 'needs_practice';
  if (avg >= 0.75 || progress.correctCount >= 1) return 'improving';
  return 'needs_practice';
}

/** Higher weight → selected more often in adaptive queue. */
export function getCardWeight(progress: CardProgress | undefined): number {
  if (!progress || progress.reviewCount === 0) return 9;

  const avg = getAverageScore(progress);
  let weight = Math.max(1.2, 11 - avg * 4.5);

  if (progress.lastRating === 'again') weight *= 1.85;
  else if (progress.lastRating === 'hard') weight *= 1.25;

  const hoursSinceReview = progress.lastReviewed
    ? (Date.now() - progress.lastReviewed) / (1000 * 60 * 60)
    : 999;
  if (hoursSinceReview > 24 && avg < 1.5) weight *= 1.15;

  return weight;
}

export function pickWeightedCardId(
  cardIds: string[],
  getProgress: (id: string) => CardProgress | undefined,
  excludeId?: string,
): string {
  if (cardIds.length === 0) return '';
  if (cardIds.length === 1) return cardIds[0];

  const pool = excludeId ? cardIds.filter((id) => id !== excludeId) : cardIds;
  const candidates = pool.length > 0 ? pool : cardIds;

  const weights = candidates.map((id) => getCardWeight(getProgress(id)));
  const total = weights.reduce((sum, w) => sum + w, 0);
  let roll = Math.random() * total;

  for (let i = 0; i < candidates.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return candidates[i];
  }

  return candidates[candidates.length - 1];
}

export function pickInitialCardId(
  cardIds: string[],
  getProgress: (id: string) => CardProgress | undefined,
): string {
  return pickWeightedCardId(cardIds, getProgress);
}
