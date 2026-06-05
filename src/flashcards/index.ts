export {
  applyRating,
  applySwipeOutcome,
  getAverageScore,
  getCardWeight,
  getLearningStatus,
  pickInitialCardId,
  pickWeightedCardId,
  RATING_POINTS,
} from './cardProgress';
export { DENTAL_PHRASES_DECK, FLASHCARD_DECKS, getDeckById } from './decks';
export { findGeneratedDeck, generateDecksForProfile } from './generateDecks';
export { getPracticeScenarioForDeck } from './practiceBridge';
export { getProfessionLabelKey, getScenarioMeta, getCardContextKey, SCENARIO_REGISTRY } from './scenarioRegistry';
export {
  getCardContext,
  getCardDef,
  getCardEx,
  getCardTerm,
  getDeckDesc,
  getDeckProfessionLabel,
  getDeckScenarioLabel,
  getDeckTitle,
} from './cardText';
export { GenerateScenarioCards } from './GenerateScenarioCards';
export {
  appendCustomDeck,
  buildGeneratedDeck,
  clearCustomDecks,
  mockGenerateScenarioDeck,
  readCustomDecks,
} from './mockScenarioGenerator';
export { SessionCompleteScreen } from './SessionCompleteScreen';
export { SpeakItSection } from './SpeakItSection';
export { SwipeFlashcardTrainer } from './SwipeFlashcardTrainer';
export { FlashcardView } from './FlashcardView';
export type {
  CardProgress,
  CardReviewState,
  CardSwipeStatus,
  Flashcard,
  FlashcardDeck,
  FlashcardLiteral,
  LearningStatus,
  ReviewRating,
  SessionProgress,
  SwipeOutcome,
} from './types';
export { clearAllCardProgress, useCardProgress } from './useCardProgress';
export { useFlashcardSession } from './useFlashcardSession';
export { useSwipeGesture } from './useSwipeGesture';
export { useSwipeSession } from './useSwipeSession';
export {
  computeSwipeTransform,
  getSwipeIntent,
  overlayOpacity,
  SWIPE_COMMIT_PX,
  SWIPE_EXIT_MS,
} from './swipeGesture';
