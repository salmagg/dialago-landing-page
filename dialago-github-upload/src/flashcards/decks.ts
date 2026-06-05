import type { FlashcardDeck } from './types';

/** Legacy static deck for the marketing-site live demo. */
export const DENTAL_PHRASES_DECK: FlashcardDeck = {
  id: 'healthcare-hc1',
  titleKey: 'flash.deck.hc1.title',
  descKey: 'flash.deck.hc1.desc',
  scenarioKey: 'profile.scenario.hc1',
  scenarioLabelKey: 'flash.scenarioLabel.hc1',
  professionCategory: 'healthcare',
  professionLabelKey: 'profile.prof.healthcare',
  practiceScenarioId: 'doctor',
  cards: [
    {
      id: 'fc1',
      termKey: 'liveDemo.fc1Term',
      defKey: 'liveDemo.fc1Def',
      exKey: 'liveDemo.fc1Ex',
      contextKey: 'flash.hc1.c1.context',
    },
    {
      id: 'fc2',
      termKey: 'liveDemo.fc2Term',
      defKey: 'liveDemo.fc2Def',
      exKey: 'liveDemo.fc2Ex',
      contextKey: 'flash.hc1.c2.context',
    },
    {
      id: 'fc3',
      termKey: 'liveDemo.fc3Term',
      defKey: 'liveDemo.fc3Def',
      exKey: 'liveDemo.fc3Ex',
      contextKey: 'flash.hc1.c3.context',
    },
    {
      id: 'fc4',
      termKey: 'flash.fc4Term',
      defKey: 'flash.fc4Def',
      exKey: 'flash.fc4Ex',
      contextKey: 'flash.hc1.c4.context',
    },
    {
      id: 'fc5',
      termKey: 'flash.fc5Term',
      defKey: 'flash.fc5Def',
      exKey: 'flash.fc5Ex',
      contextKey: 'flash.hc1.c5.context',
    },
    {
      id: 'fc6',
      termKey: 'flash.fc6Term',
      defKey: 'flash.fc6Def',
      exKey: 'flash.fc6Ex',
      contextKey: 'flash.hc1.c6.context',
    },
  ],
};

export const FLASHCARD_DECKS: FlashcardDeck[] = [DENTAL_PHRASES_DECK];

export function getDeckById(id: string): FlashcardDeck | undefined {
  return FLASHCARD_DECKS.find((deck) => deck.id === id);
}
