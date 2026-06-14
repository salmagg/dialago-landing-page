import type { Lang } from '../i18n';
import { t } from '../i18n';
import type { Flashcard, FlashcardDeck } from './types';

export function getCardTerm(lang: Lang, card: Flashcard): string {
  return card.literal?.term ?? t(lang, card.termKey);
}

export function getCardDef(lang: Lang, card: Flashcard): string {
  return card.literal?.def ?? t(lang, card.defKey);
}

export function getCardEx(lang: Lang, card: Flashcard): string {
  return card.literal?.ex ?? t(lang, card.exKey);
}

export function getCardContext(lang: Lang, card: Flashcard): string {
  return card.literal?.context ?? t(lang, card.contextKey ?? card.exKey);
}

export function getDeckTitle(lang: Lang, deck: FlashcardDeck): string {
  return deck.displayTitle ?? t(lang, deck.titleKey);
}

export function getDeckDesc(lang: Lang, deck: FlashcardDeck): string {
  return deck.displayDesc ?? t(lang, deck.descKey);
}

export function getDeckProfessionLabel(lang: Lang, deck: FlashcardDeck): string {
  return deck.displayProfessionLabel ?? t(lang, deck.professionLabelKey);
}

export function getDeckScenarioLabel(lang: Lang, deck: FlashcardDeck): string {
  return deck.displayScenarioLabel ?? t(lang, deck.scenarioLabelKey);
}
