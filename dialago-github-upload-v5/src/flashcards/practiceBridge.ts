import {
  isLearnPracticeId,
  practiceIdFromDeckIndex,
  practiceIdFromDeckSlug,
  type LearnPracticeId,
} from '../app/practiceContent';
import type { FlashcardDeck } from './types';

/** Deck slug suffix → practice scenario (only the four learn scenarios). */
const SLUG_TO_PRACTICE: Record<string, LearnPracticeId> = {
  hos1: 'hos1',
  hos2: 'hos2',
  hos3: 'hos3',
  hos4: 'hos4',
};

export function getPracticeScenarioForDeck(deck: FlashcardDeck, deckIndex = -1): LearnPracticeId {
  if (isLearnPracticeId(deck.practiceScenarioId)) {
    return deck.practiceScenarioId;
  }

  const slug = deck.id.split('-').pop() ?? '';
  if (SLUG_TO_PRACTICE[slug]) return SLUG_TO_PRACTICE[slug];

  const fromSlug = practiceIdFromDeckSlug(slug);
  if (fromSlug) return fromSlug;

  if (deckIndex >= 0) {
    return practiceIdFromDeckIndex(deckIndex);
  }

  return 'hos1';
}
