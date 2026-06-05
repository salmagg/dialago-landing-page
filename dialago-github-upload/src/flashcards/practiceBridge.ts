import type { FlashcardDeck } from './types';

export function getPracticeScenarioForDeck(deck: FlashcardDeck): string {
  return deck.practiceScenarioId;
}
