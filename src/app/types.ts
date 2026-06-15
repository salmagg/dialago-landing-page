import type { Lang } from '../i18n';
import type { AssessmentSnapshot } from './profileAssessment';

export type FieldValue = {
  presetId: string;
  manual: boolean;
  customText: string;
};

export type AppProfile = {
  profession: FieldValue;
  location: FieldValue;
  nativeLanguage: FieldValue;
  focus: FieldValue;
  goal: FieldValue;
  age?: number;
  firstName?: string;
  assessment?: AssessmentSnapshot;
};

export type SetupPhase = 'onboarding' | 'assessment' | 'analysis' | 'profile';

export type AppTab = 'home' | 'learn' | 'practice' | 'progress' | 'profile';

export type PracticeLaunch = {
  scenarioId: string;
  deckId?: string;
  deckTitleKey?: string;
  deckIndex?: number;
};

export type VoiceTutorLaunch = { open: true };

export type AppPhase = 'welcome' | 'setup' | 'main';

export type AssessStage = 'age' | 'vocab' | 'writing' | 'speaking';

export type { Lang };
