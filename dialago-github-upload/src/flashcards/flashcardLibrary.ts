import type { Flashcard } from './types';

type CardRef = {
  idSuffix: string;
  termKey: string;
  defKey: string;
  exKey: string;
  contextKey?: string;
};

function card(slug: string, n: number, context?: string): CardRef {
  const id = `c${n}`;
  const exKey = `flash.${slug}.${id}.ex`;
  return {
    idSuffix: id,
    termKey: `flash.${slug}.${id}.term`,
    defKey: `flash.${slug}.${id}.def`,
    exKey,
    contextKey: context ? `flash.${slug}.${id}.context` : exKey,
  };
}

function deckCards(slug: string, count = 4): CardRef[] {
  return Array.from({ length: count }, (_, i) => card(slug, i + 1));
}

const HC1_CARDS: CardRef[] = [
  { idSuffix: 'c1', termKey: 'liveDemo.fc1Term', defKey: 'liveDemo.fc1Def', exKey: 'liveDemo.fc1Ex', contextKey: 'flash.hc1.c1.context' },
  { idSuffix: 'c2', termKey: 'liveDemo.fc2Term', defKey: 'liveDemo.fc2Def', exKey: 'liveDemo.fc2Ex', contextKey: 'flash.hc1.c2.context' },
  { idSuffix: 'c3', termKey: 'liveDemo.fc3Term', defKey: 'liveDemo.fc3Def', exKey: 'liveDemo.fc3Ex', contextKey: 'flash.hc1.c3.context' },
  { idSuffix: 'c4', termKey: 'flash.fc4Term', defKey: 'flash.fc4Def', exKey: 'flash.fc4Ex', contextKey: 'flash.hc1.c4.context' },
  { idSuffix: 'c5', termKey: 'flash.fc5Term', defKey: 'flash.fc5Def', exKey: 'flash.fc5Ex', contextKey: 'flash.hc1.c5.context' },
  { idSuffix: 'c6', termKey: 'flash.fc6Term', defKey: 'flash.fc6Def', exKey: 'flash.fc6Ex', contextKey: 'flash.hc1.c6.context' },
];

/** Scenario slug → card templates (maps to profile.scenario.* keys). */
export const SCENARIO_CARD_LIBRARY: Record<string, CardRef[]> = {
  hc1: HC1_CARDS,
  hc2: deckCards('hc2'),
  hc3: deckCards('hc3'),
  hc4: deckCards('hc4'),
  biz1: deckCards('biz1'),
  biz2: deckCards('biz2'),
  biz3: deckCards('biz3'),
  biz4: deckCards('biz4'),
  hos1: deckCards('hos1'),
  hos2: deckCards('hos2'),
  hos3: deckCards('hos3'),
  hos4: deckCards('hos4'),
  edu1: deckCards('edu1'),
  edu2: deckCards('edu2'),
  edu3: deckCards('edu3'),
  edu4: deckCards('edu4'),
  def1: deckCards('def1'),
  def2: deckCards('def2'),
  def3: deckCards('def3'),
  def4: deckCards('def4'),
};

export function scenarioSlugFromKey(scenarioKey: string): string {
  return scenarioKey.replace('profile.scenario.', '');
}

export function buildCardsForScenario(professionCategory: string, scenarioKey: string): Flashcard[] {
  const slug = scenarioSlugFromKey(scenarioKey);
  const templates = SCENARIO_CARD_LIBRARY[slug] ?? SCENARIO_CARD_LIBRARY.def1;
  return templates.map((tpl) => ({
    id: `${professionCategory}-${slug}-${tpl.idSuffix}`,
    termKey: tpl.termKey,
    defKey: tpl.defKey,
    exKey: tpl.exKey,
    contextKey: tpl.contextKey,
  }));
}
