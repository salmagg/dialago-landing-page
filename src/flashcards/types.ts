/** Swipe outcome for a card in the current session. */
export type SwipeOutcome = 'known' | 'learning';

export type CardSwipeStatus = 'known' | 'learning';

export type FlashcardLiteral = {
  term: string;
  def: string;
  ex: string;
  context: string;
};

export type Flashcard = {
  id: string;
  termKey: string;
  defKey: string;
  exKey: string;
  /** Full original sentence as heard in the scenario dialogue. */
  contextKey?: string;
  /** AI-generated inline copy (bypasses i18n keys). */
  literal?: FlashcardLiteral;
  tags?: string[];
};

export type FlashcardDeck = {
  id: string;
  titleKey: string;
  descKey: string;
  scenarioKey: string;
  scenarioLabelKey: string;
  professionCategory: string;
  professionLabelKey: string;
  practiceScenarioId: string;
  personalized?: boolean;
  isGenerated?: boolean;
  displayTitle?: string;
  displayDesc?: string;
  displayProfessionLabel?: string;
  displayScenarioLabel?: string;
  cards: Flashcard[];
};

/** @deprecated Legacy rating — prefer SwipeOutcome */
export type ReviewRating = 'again' | 'hard' | 'good';

export type LearningStatus = 'needs_practice' | 'improving' | 'mastered';

export type CardProgress = {
  correctCount: number;
  difficultyScore: number;
  lastReviewed: number | null;
  reviewCount: number;
  lastRating?: ReviewRating;
  status?: CardSwipeStatus;
};

export type CardReviewState = {
  rating: ReviewRating;
  reviewedAt: number;
};

export type SwipeDragState = {
  offsetX: number;
  offsetY: number;
  rotation: number;
  intent: SwipeOutcome | null;
};

export type SessionProgress = {
  currentCard: number;
  initialTotal: number;
  mastered: number;
  reviewing: number;
};
