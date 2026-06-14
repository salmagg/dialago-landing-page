export type PracticeContent = {
  titleKey: string;
  speakerLabelKey: string;
  openingKey: string;
  questionKey: string;
  optionKeys: readonly [string, string, string];
  feedbackKey: string;
  aiOpeningKey: string;
  aiSuggestedReplyKey: string;
};

/** The four scenario-learning practice modules (replaces legacy root-canal / doctor flow). */
export const LEARN_PRACTICE_IDS = ['hos1', 'hos2', 'hos3', 'hos4'] as const;
export type LearnPracticeId = (typeof LEARN_PRACTICE_IDS)[number];

export const PRACTICE_CONTENT: Record<LearnPracticeId, PracticeContent> = {
  hos1: {
    titleKey: 'practice.hos1.title',
    speakerLabelKey: 'practice.hos1.speaker',
    openingKey: 'practice.hos1.opening',
    questionKey: 'practice.hos1.question',
    optionKeys: ['practice.hos1.opt1', 'practice.hos1.opt2', 'practice.hos1.opt3'],
    feedbackKey: 'practice.hos1.feedback',
    aiOpeningKey: 'practice.hos1.aiOpening',
    aiSuggestedReplyKey: 'practice.hos1.aiSuggestedReply',
  },
  hos2: {
    titleKey: 'practice.hos2.title',
    speakerLabelKey: 'practice.hos2.speaker',
    openingKey: 'practice.hos2.opening',
    questionKey: 'practice.hos2.question',
    optionKeys: ['practice.hos2.opt1', 'practice.hos2.opt2', 'practice.hos2.opt3'],
    feedbackKey: 'practice.hos2.feedback',
    aiOpeningKey: 'practice.hos2.aiOpening',
    aiSuggestedReplyKey: 'practice.hos2.aiSuggestedReply',
  },
  hos3: {
    titleKey: 'practice.hos3.title',
    speakerLabelKey: 'practice.hos3.speaker',
    openingKey: 'practice.hos3.opening',
    questionKey: 'practice.hos3.question',
    optionKeys: ['practice.hos3.opt1', 'practice.hos3.opt2', 'practice.hos3.opt3'],
    feedbackKey: 'practice.hos3.feedback',
    aiOpeningKey: 'practice.hos3.aiOpening',
    aiSuggestedReplyKey: 'practice.hos3.aiSuggestedReply',
  },
  hos4: {
    titleKey: 'practice.hos4.title',
    speakerLabelKey: 'practice.hos4.speaker',
    openingKey: 'practice.hos4.opening',
    questionKey: 'practice.hos4.question',
    optionKeys: ['practice.hos4.opt1', 'practice.hos4.opt2', 'practice.hos4.opt3'],
    feedbackKey: 'practice.hos4.feedback',
    aiOpeningKey: 'practice.hos4.aiOpening',
    aiSuggestedReplyKey: 'practice.hos4.aiSuggestedReply',
  },
};

export function isLearnPracticeId(id: string | null | undefined): id is LearnPracticeId {
  return id != null && (LEARN_PRACTICE_IDS as readonly string[]).includes(id);
}

/** Map deck list position (0-based) or slug to one of the four practice scenarios. */
export function practiceIdFromDeckIndex(index: number): LearnPracticeId {
  return LEARN_PRACTICE_IDS[Math.max(0, Math.min(index, 3))];
}

export function practiceIdFromDeckSlug(slug: string | null | undefined): LearnPracticeId | null {
  if (isLearnPracticeId(slug)) return slug;
  return null;
}

export function resolvePracticeScenarioId(
  raw: string | null | undefined,
  deckId?: string | null,
  deckIndex?: number | null,
): LearnPracticeId | null {
  if (isLearnPracticeId(raw)) return raw;

  const slug = deckId?.split('-').pop();
  const fromSlug = practiceIdFromDeckSlug(slug);
  if (fromSlug) return fromSlug;

  if (deckIndex != null && deckIndex >= 0) {
    return practiceIdFromDeckIndex(deckIndex);
  }

  return null;
}

export function getPracticeContent(scenarioId: string | null): PracticeContent | null {
  return isLearnPracticeId(scenarioId) ? PRACTICE_CONTENT[scenarioId] : null;
}
