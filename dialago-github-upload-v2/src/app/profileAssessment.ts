export type EnglishLevel = 'A2' | 'B1' | 'B2' | 'C1';

export type AssessmentSnapshot = {
  vocabCorrect: number;
  vocabAnswered: number;
  writingComplete: boolean;
  speakingComplete: boolean;
  englishLevel: EnglishLevel;
  assessedAt: number;
};

export type AssessmentInput = {
  vocabCorrect: number;
  vocabAnswered: number;
  writingComplete: boolean;
  speakingComplete: boolean;
};

export function computeAssessment(input: AssessmentInput): AssessmentSnapshot {
  const accuracy = input.vocabAnswered > 0 ? input.vocabCorrect / input.vocabAnswered : 0;
  let englishLevel: EnglishLevel = 'A2';

  if (accuracy >= 0.95 && input.writingComplete && input.speakingComplete && input.vocabCorrect >= 3) {
    englishLevel = 'C1';
  } else if (accuracy >= 0.85 && input.writingComplete && input.speakingComplete) {
    englishLevel = 'B2';
  } else if (accuracy >= 0.55 && input.writingComplete) {
    englishLevel = 'B1';
  }

  return {
    ...input,
    englishLevel,
    assessedAt: Date.now(),
  };
}

const LEVEL_BASE_PCT: Record<EnglishLevel, number> = {
  A2: 54,
  B1: 67,
  B2: 78,
  C1: 88,
};

export function deriveProgressMetrics(assessment: AssessmentSnapshot | undefined) {
  const base = assessment ? LEVEL_BASE_PCT[assessment.englishLevel] : 72;
  return [
    { key: 'profile.metric.speaking', pct: Math.min(96, base + 4) },
    { key: 'profile.metric.listening', pct: Math.min(94, base - 2) },
    { key: 'profile.metric.vocabulary', pct: Math.min(97, base + 6) },
    { key: 'profile.metric.scenarios', pct: Math.min(92, base - 6) },
  ] as const;
}

export function englishLevelLabelKey(level: EnglishLevel): string {
  return `profile.assessment.level.${level}`;
}

export function cardsPerDeckForLevel(level: EnglishLevel | undefined): number {
  switch (level) {
    case 'A2':
      return 4;
    case 'B1':
      return 5;
    case 'B2':
      return 6;
    case 'C1':
      return 7;
    default:
      return 5;
  }
}
