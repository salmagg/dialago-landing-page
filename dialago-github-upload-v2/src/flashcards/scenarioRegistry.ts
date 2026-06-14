export type ScenarioSlug =
  | 'hc1'
  | 'hc2'
  | 'hc3'
  | 'hc4'
  | 'biz1'
  | 'biz2'
  | 'biz3'
  | 'biz4'
  | 'hos1'
  | 'hos2'
  | 'hos3'
  | 'hos4'
  | 'edu1'
  | 'edu2'
  | 'edu3'
  | 'edu4'
  | 'def1'
  | 'def2'
  | 'def3'
  | 'def4';

export type ScenarioMeta = {
  slug: ScenarioSlug;
  scenarioKey: string;
  deckTitleKey: string;
  deckDescKey: string;
  scenarioLabelKey: string;
  practiceScenarioId: string;
  professionLabelKey?: string;
};

export const SCENARIO_REGISTRY: Record<ScenarioSlug, ScenarioMeta> = {
  hc1: {
    slug: 'hc1',
    scenarioKey: 'profile.scenario.hc1',
    deckTitleKey: 'flash.deck.hc1.title',
    deckDescKey: 'flash.deck.hc1.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hc1',
    practiceScenarioId: 'doctor',
  },
  hc2: {
    slug: 'hc2',
    scenarioKey: 'profile.scenario.hc2',
    deckTitleKey: 'flash.deck.hc2.title',
    deckDescKey: 'flash.deck.hc2.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hc2',
    practiceScenarioId: 'doctor',
  },
  hc3: {
    slug: 'hc3',
    scenarioKey: 'profile.scenario.hc3',
    deckTitleKey: 'flash.deck.hc3.title',
    deckDescKey: 'flash.deck.hc3.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hc3',
    practiceScenarioId: 'customer',
  },
  hc4: {
    slug: 'hc4',
    scenarioKey: 'profile.scenario.hc4',
    deckTitleKey: 'flash.deck.hc4.title',
    deckDescKey: 'flash.deck.hc4.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hc4',
    practiceScenarioId: 'doctor',
  },
  biz1: {
    slug: 'biz1',
    scenarioKey: 'profile.scenario.biz1',
    deckTitleKey: 'flash.deck.biz1.title',
    deckDescKey: 'flash.deck.biz1.desc',
    scenarioLabelKey: 'flash.scenarioLabel.biz1',
    practiceScenarioId: 'workplace',
  },
  biz2: {
    slug: 'biz2',
    scenarioKey: 'profile.scenario.biz2',
    deckTitleKey: 'flash.deck.biz2.title',
    deckDescKey: 'flash.deck.biz2.desc',
    scenarioLabelKey: 'flash.scenarioLabel.biz2',
    practiceScenarioId: 'workplace',
  },
  biz3: {
    slug: 'biz3',
    scenarioKey: 'profile.scenario.biz3',
    deckTitleKey: 'flash.deck.biz3.title',
    deckDescKey: 'flash.deck.biz3.desc',
    scenarioLabelKey: 'flash.scenarioLabel.biz3',
    practiceScenarioId: 'workplace',
  },
  biz4: {
    slug: 'biz4',
    scenarioKey: 'profile.scenario.biz4',
    deckTitleKey: 'flash.deck.biz4.title',
    deckDescKey: 'flash.deck.biz4.desc',
    scenarioLabelKey: 'flash.scenarioLabel.biz4',
    practiceScenarioId: 'workplace',
  },
  hos1: {
    slug: 'hos1',
    scenarioKey: 'profile.scenario.hos1',
    deckTitleKey: 'flash.deck.hos1.title',
    deckDescKey: 'flash.deck.hos1.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hos1',
    practiceScenarioId: 'hos1',
    professionLabelKey: 'profile.prof.healthcare',
  },
  hos2: {
    slug: 'hos2',
    scenarioKey: 'profile.scenario.hos2',
    deckTitleKey: 'flash.deck.hos2.title',
    deckDescKey: 'flash.deck.hos2.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hos2',
    practiceScenarioId: 'hos2',
    professionLabelKey: 'profile.prof.janitorial',
  },
  hos3: {
    slug: 'hos3',
    scenarioKey: 'profile.scenario.hos3',
    deckTitleKey: 'flash.deck.hos3.title',
    deckDescKey: 'flash.deck.hos3.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hos3',
    practiceScenarioId: 'hos3',
    professionLabelKey: 'profile.prof.construction',
  },
  hos4: {
    slug: 'hos4',
    scenarioKey: 'profile.scenario.hos4',
    deckTitleKey: 'flash.deck.hos4.title',
    deckDescKey: 'flash.deck.hos4.desc',
    scenarioLabelKey: 'flash.scenarioLabel.hos4',
    practiceScenarioId: 'hos4',
    professionLabelKey: 'profile.prof.agriculture',
  },
  edu1: {
    slug: 'edu1',
    scenarioKey: 'profile.scenario.edu1',
    deckTitleKey: 'flash.deck.edu1.title',
    deckDescKey: 'flash.deck.edu1.desc',
    scenarioLabelKey: 'flash.scenarioLabel.edu1',
    practiceScenarioId: 'customer',
  },
  edu2: {
    slug: 'edu2',
    scenarioKey: 'profile.scenario.edu2',
    deckTitleKey: 'flash.deck.edu2.title',
    deckDescKey: 'flash.deck.edu2.desc',
    scenarioLabelKey: 'flash.scenarioLabel.edu2',
    practiceScenarioId: 'workplace',
  },
  edu3: {
    slug: 'edu3',
    scenarioKey: 'profile.scenario.edu3',
    deckTitleKey: 'flash.deck.edu3.title',
    deckDescKey: 'flash.deck.edu3.desc',
    scenarioLabelKey: 'flash.scenarioLabel.edu3',
    practiceScenarioId: 'workplace',
  },
  edu4: {
    slug: 'edu4',
    scenarioKey: 'profile.scenario.edu4',
    deckTitleKey: 'flash.deck.edu4.title',
    deckDescKey: 'flash.deck.edu4.desc',
    scenarioLabelKey: 'flash.scenarioLabel.edu4',
    practiceScenarioId: 'workplace',
  },
  def1: {
    slug: 'def1',
    scenarioKey: 'profile.scenario.def1',
    deckTitleKey: 'flash.deck.def1.title',
    deckDescKey: 'flash.deck.def1.desc',
    scenarioLabelKey: 'flash.scenarioLabel.def1',
    practiceScenarioId: 'workplace',
  },
  def2: {
    slug: 'def2',
    scenarioKey: 'profile.scenario.def2',
    deckTitleKey: 'flash.deck.def2.title',
    deckDescKey: 'flash.deck.def2.desc',
    scenarioLabelKey: 'flash.scenarioLabel.def2',
    practiceScenarioId: 'customer',
  },
  def3: {
    slug: 'def3',
    scenarioKey: 'profile.scenario.def3',
    deckTitleKey: 'flash.deck.def3.title',
    deckDescKey: 'flash.deck.def3.desc',
    scenarioLabelKey: 'flash.scenarioLabel.def3',
    practiceScenarioId: 'workplace',
  },
  def4: {
    slug: 'def4',
    scenarioKey: 'profile.scenario.def4',
    deckTitleKey: 'flash.deck.def4.title',
    deckDescKey: 'flash.deck.def4.desc',
    scenarioLabelKey: 'flash.scenarioLabel.def4',
    practiceScenarioId: 'workplace',
  },
};

const PROFESSION_LABEL_KEYS: Record<string, string> = {
  healthcare: 'profile.prof.healthcare',
  business: 'profile.prof.business',
  hospitality: 'profile.prof.hospitality',
  education: 'profile.prof.education',
  janitorial: 'profile.prof.janitorial',
  construction: 'profile.prof.construction',
  agriculture: 'profile.prof.agriculture',
  default: 'flash.prof.general',
};

export function getScenarioMeta(slug: string): ScenarioMeta {
  return SCENARIO_REGISTRY[slug as ScenarioSlug] ?? SCENARIO_REGISTRY.def1;
}

export function getProfessionLabelKey(category: string): string {
  return PROFESSION_LABEL_KEYS[category] ?? PROFESSION_LABEL_KEYS.default;
}

export function getCardContextKey(card: { contextKey?: string; exKey: string }): string {
  return card.contextKey ?? card.exKey;
}
