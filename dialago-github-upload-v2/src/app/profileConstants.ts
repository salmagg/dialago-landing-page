export type Option = { id: string; labelKey: string };

export const MANUAL_ID = '__manual__';

export const PROFESSIONS: Option[] = [
  { id: 'healthcare', labelKey: 'profile.prof.healthcare' },
  { id: 'business', labelKey: 'profile.prof.business' },
  { id: 'hospitality', labelKey: 'profile.prof.hospitality' },
  { id: 'education', labelKey: 'profile.prof.education' },
];

export const LOCATIONS: Option[] = [
  { id: 'nyc', labelKey: 'profile.loc.nyc' },
  { id: 'la', labelKey: 'profile.loc.la' },
  { id: 'miami', labelKey: 'profile.loc.miami' },
  { id: 'madrid', labelKey: 'profile.loc.madrid' },
];

export const NATIVE_LANGS: Option[] = [
  { id: 'spanish', labelKey: 'profile.lang.spanish' },
  { id: 'mandarin', labelKey: 'profile.lang.mandarin' },
  { id: 'arabic', labelKey: 'profile.lang.arabic' },
  { id: 'hindi', labelKey: 'profile.lang.hindi' },
  { id: 'portuguese', labelKey: 'profile.lang.portuguese' },
];

export const FOCUSES: Option[] = [
  { id: 'communication', labelKey: 'profile.focus.communication' },
  { id: 'workplace', labelKey: 'profile.focus.workplace' },
  { id: 'interviews', labelKey: 'profile.focus.interviews' },
  { id: 'daily', labelKey: 'profile.focus.daily' },
];

export const GOALS: Option[] = [
  { id: 'career', labelKey: 'profile.goal.career' },
  { id: 'fluency', labelKey: 'profile.goal.fluency' },
  { id: 'integration', labelKey: 'profile.goal.integration' },
  { id: 'client', labelKey: 'profile.goal.client' },
];

export const VOCAB_QUESTIONS = [
  {
    promptKey: 'profile.vocab.q1',
    optionKeys: ['profile.vocab.q1a', 'profile.vocab.q1b', 'profile.vocab.q1c', 'profile.vocab.q1d'],
    correctIndex: 1,
  },
  {
    promptKey: 'profile.vocab.q2',
    optionKeys: ['profile.vocab.q2a', 'profile.vocab.q2b', 'profile.vocab.q2c', 'profile.vocab.q2d'],
    correctIndex: 0,
  },
  {
    promptKey: 'profile.vocab.q3',
    optionKeys: ['profile.vocab.q3a', 'profile.vocab.q3b', 'profile.vocab.q3c', 'profile.vocab.q3d'],
    correctIndex: 2,
  },
] as const;

export const ANALYSIS_CHECK_KEYS = [
  'profile.analysis.check1',
  'profile.analysis.check2',
  'profile.analysis.check3',
  'profile.analysis.check4',
  'profile.analysis.check5',
] as const;

/** All profiles use the same four scenario-learning decks. */
export const SCENARIO_KEYS: Record<string, string[]> = {
  healthcare: ['profile.scenario.hos1', 'profile.scenario.hos2', 'profile.scenario.hos3', 'profile.scenario.hos4'],
  business: ['profile.scenario.hos1', 'profile.scenario.hos2', 'profile.scenario.hos3', 'profile.scenario.hos4'],
  hospitality: ['profile.scenario.hos1', 'profile.scenario.hos2', 'profile.scenario.hos3', 'profile.scenario.hos4'],
  education: ['profile.scenario.hos1', 'profile.scenario.hos2', 'profile.scenario.hos3', 'profile.scenario.hos4'],
  default: ['profile.scenario.hos1', 'profile.scenario.hos2', 'profile.scenario.hos3', 'profile.scenario.hos4'],
};

export const LANG_PROGRESS_METRICS = [
  { key: 'profile.metric.speaking', pct: 78 },
  { key: 'profile.metric.listening', pct: 72 },
  { key: 'profile.metric.vocabulary', pct: 81 },
  { key: 'profile.metric.scenarios', pct: 68 },
] as const;

export const DEFAULT_PROFILE = {
  profession: { presetId: 'hospitality', manual: false, customText: '' },
  location: { presetId: 'nyc', manual: false, customText: '' },
  nativeLanguage: { presetId: 'spanish', manual: false, customText: '' },
  focus: { presetId: 'communication', manual: false, customText: '' },
  goal: { presetId: 'career', manual: false, customText: '' },
};

export const PRACTICE_SCENARIOS = [
  { id: 'hos1', titleKey: 'practice.hos1.title', descKey: 'flash.deck.hos1.desc' },
  { id: 'hos2', titleKey: 'practice.hos2.title', descKey: 'flash.deck.hos2.desc' },
  { id: 'hos3', titleKey: 'practice.hos3.title', descKey: 'flash.deck.hos3.desc' },
  { id: 'hos4', titleKey: 'practice.hos4.title', descKey: 'flash.deck.hos4.desc' },
] as const;
