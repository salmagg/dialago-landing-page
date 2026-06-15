import type { LearnPracticeId } from './practiceContent';
import { displayField, professionDisplay, scenarioCategory } from './profileUtils';
import { FOCUSES, GOALS, PROFESSIONS } from './profileConstants';
import type { AppProfile } from './types';
import type { Lang } from '../i18n';
import type { FlashcardDeck } from '../flashcards/types';

export type ScenarioRecommendation = {
  slug: LearnPracticeId;
  reasonKey: string;
  priority: number;
};

const PROFESSION_DECK_ORDER: Record<string, LearnPracticeId[]> = {
  healthcare: ['hos1', 'hos2', 'hos3', 'hos4'],
  hospitality: ['hos2', 'hos1', 'hos4', 'hos3'],
  business: ['hos3', 'hos1', 'hos2', 'hos4'],
  education: ['hos1', 'hos4', 'hos2', 'hos3'],
  agriculture: ['hos4', 'hos1', 'hos2', 'hos3'],
  construction: ['hos3', 'hos4', 'hos1', 'hos2'],
  janitorial: ['hos2', 'hos1', 'hos3', 'hos4'],
  default: ['hos1', 'hos2', 'hos3', 'hos4'],
};

const FOCUS_BOOST: Record<string, LearnPracticeId> = {
  communication: 'hos1',
  workplace: 'hos3',
  interviews: 'hos1',
  daily: 'hos4',
};

const GOAL_BOOST: Record<string, LearnPracticeId> = {
  career: 'hos3',
  fluency: 'hos1',
  integration: 'hos2',
  client: 'hos1',
};

function slugFromDeckId(deckId: string): LearnPracticeId | null {
  const tail = deckId.split('-').pop();
  if (tail === 'hos1' || tail === 'hos2' || tail === 'hos3' || tail === 'hos4') return tail;
  return null;
}

function topRecommendReasonKey(category: string): string {
  const map: Record<string, string> = {
    default: 'profile.recommend.reason.profile',
    healthcare: 'profile.recommend.reason.healthcare',
    hospitality: 'profile.recommend.reason.hospitality',
    business: 'profile.recommend.reason.business',
    education: 'profile.recommend.reason.education',
    agriculture: 'profile.recommend.reason.agriculture',
    construction: 'profile.recommend.reason.construction',
    janitorial: 'profile.recommend.reason.janitorial',
  };
  return map[category] ?? map.default;
}

export function recommendScenarios(profile: AppProfile): ScenarioRecommendation[] {
  const category = scenarioCategory(profile.profession);
  const baseOrder = PROFESSION_DECK_ORDER[category] ?? PROFESSION_DECK_ORDER.default;
  const focusSlug = FOCUS_BOOST[profile.focus.presetId];
  const goalSlug = GOAL_BOOST[profile.goal.presetId];

  const boosted = new Set<LearnPracticeId>();
  if (focusSlug) boosted.add(focusSlug);
  if (goalSlug) boosted.add(goalSlug);

  const ordered = [...baseOrder].sort((a, b) => {
    const aBoost = boosted.has(a) ? 0 : 1;
    const bBoost = boosted.has(b) ? 0 : 1;
    if (aBoost !== bBoost) return aBoost - bBoost;
    return baseOrder.indexOf(a) - baseOrder.indexOf(b);
  });

  return ordered.map((slug, index) => ({
    slug,
    priority: index,
    reasonKey:
      index === 0
        ? topRecommendReasonKey(category)
        : boosted.has(slug)
          ? 'profile.recommend.reason.focusGoal'
          : 'profile.recommend.reason.profession',
  }));
}

export function sortDecksByProfile(decks: FlashcardDeck[], profile: AppProfile): FlashcardDeck[] {
  const order = recommendScenarios(profile).map((item) => item.slug);
  const rank = new Map(order.map((slug, index) => [slug, index]));

  return [...decks].sort((a, b) => {
    const aSlug = slugFromDeckId(a.id) ?? 'hos1';
    const bSlug = slugFromDeckId(b.id) ?? 'hos1';
    return (rank.get(aSlug) ?? 99) - (rank.get(bSlug) ?? 99);
  });
}

export function topRecommendedSlug(profile: AppProfile): LearnPracticeId {
  return recommendScenarios(profile)[0]?.slug ?? 'hos1';
}

export function getGeneratorPrefill(profile: AppProfile, lang: Lang) {
  const category = scenarioCategory(profile.profession);
  const job = professionDisplay(lang, profile.profession);
  const goal = displayField(lang, GOALS, profile.goal, 'profile.goal');
  const focus = displayField(lang, FOCUSES, profile.focus, 'profile.focus');
  const top = topRecommendedSlug(profile);

  const scenarioBySlug: Record<LearnPracticeId, string> = {
    hos1: 'Renal consultation with a worried patient',
    hos2: 'OR suite sanitization after a pathogen spill',
    hos3: 'Jobsite safety check before structural work',
    hos4: 'Field operations before pesticide application',
  };

  const scenarioTemplates: Record<string, string> = {
    healthcare: 'Patient follow-up about rising creatinine levels',
    hospitality: 'Professional cleaning protocol in a clinical wing',
    business: 'Contractor coordination on a renovation timeline',
    education: 'Parent conference about student progress',
    agriculture: 'Field operations before pesticide application',
    construction: 'Jobsite safety check before structural work',
    janitorial: 'OR suite sanitization after a pathogen spill',
    default: scenarioBySlug[top],
  };

  return {
    job: job || displayField(lang, PROFESSIONS, profile.profession, 'profile.prof'),
    goal: `${goal} · ${focus}`,
    scenario: scenarioTemplates[category] ?? scenarioBySlug[top],
    recommendedSlug: top,
  };
}
