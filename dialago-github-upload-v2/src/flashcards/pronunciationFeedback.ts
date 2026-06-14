import type { Flashcard } from './types';

export type SimulatedPronunciationFeedback = {
  score: number;
  strengthKey: string;
  improvementKey: string;
  improvementWord: string;
};

const STRENGTH_KEYS = [
  'flash.speak.strength.pacing',
  'flash.speak.strength.clarity',
  'flash.speak.strength.intonation',
  'flash.speak.strength.volume',
] as const;

const IMPROVEMENT_KEYS = [
  'flash.speak.improve.stress',
  'flash.speak.improve.vowel',
  'flash.speak.improve.endings',
  'flash.speak.improve.linking',
] as const;

function hashCardId(id: string): number {
  return id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickStressWord(term: string): string {
  const words = term.replace(/[“”"']/g, '').trim().split(/\s+/);
  if (words.length === 0) return term;
  return words[Math.min(1, words.length - 1)] ?? words[0];
}

export function simulatePronunciationFeedback(card: Flashcard, termText: string): SimulatedPronunciationFeedback {
  const hash = hashCardId(card.id);
  const score = 72 + (hash % 23);
  const strengthKey = STRENGTH_KEYS[hash % STRENGTH_KEYS.length];
  const improvementKey = IMPROVEMENT_KEYS[hash % IMPROVEMENT_KEYS.length];
  const improvementWord = pickStressWord(termText);

  return { score, strengthKey, improvementKey, improvementWord };
}
