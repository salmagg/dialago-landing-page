import type { AppProfile } from '../app/types';
import { SCENARIO_KEYS } from '../app/profileConstants';
import { scenarioCategory } from '../app/profileUtils';
import { sortDecksByProfile } from '../app/profileRecommendation';
import { buildCardsForScenario, scenarioSlugFromKey } from './flashcardLibrary';
import { getProfessionLabelKey, getScenarioMeta } from './scenarioRegistry';
import type { FlashcardDeck } from './types';

export function generateDecksForProfile(profile: AppProfile): FlashcardDeck[] {
  const category = scenarioCategory(profile.profession);
  const scenarioKeys = SCENARIO_KEYS[category] ?? SCENARIO_KEYS.default;

  const decks = scenarioKeys.map((scenarioKey) => {
    const slug = scenarioSlugFromKey(scenarioKey);
    const meta = getScenarioMeta(slug);
    const cards = buildCardsForScenario(category, scenarioKey);

    return {
      id: `${category}-${slug}`,
      titleKey: meta.deckTitleKey,
      descKey: meta.deckDescKey,
      scenarioKey: meta.scenarioKey,
      scenarioLabelKey: meta.scenarioLabelKey,
      professionCategory: category,
      professionLabelKey: meta.professionLabelKey ?? getProfessionLabelKey(category),
      practiceScenarioId: slug,
      personalized: true,
      cards,
    };
  });

  return sortDecksByProfile(decks, profile);
}

export function findGeneratedDeck(profile: AppProfile, deckId: string): FlashcardDeck | undefined {
  return generateDecksForProfile(profile).find((deck) => deck.id === deckId);
}
