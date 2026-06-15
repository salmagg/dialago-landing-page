import type { LearnPracticeId } from './practiceContent';

export type AnalysisVocabItem = {
  termKey: string;
  defKey: string;
};

export type AnalysisGrammarItem = {
  titleKey: string;
  noteKey: string;
};

export type OptionAnalysis = {
  vocab: readonly AnalysisVocabItem[];
  grammar: readonly AnalysisGrammarItem[];
};

const THREE_OPTS = [0, 1, 2] as const;
export type OptionIndex = (typeof THREE_OPTS)[number];

function opt(scenario: LearnPracticeId, index: OptionIndex): OptionAnalysis {
  const n = index as 0 | 1 | 2;
  return {
    vocab: [
      { termKey: `practice.${scenario}.a${n}.v1.term`, defKey: `practice.${scenario}.a${n}.v1.def` },
      { termKey: `practice.${scenario}.a${n}.v2.term`, defKey: `practice.${scenario}.a${n}.v2.def` },
      { termKey: `practice.${scenario}.a${n}.v3.term`, defKey: `practice.${scenario}.a${n}.v3.def` },
    ],
    grammar: [
      { titleKey: `practice.${scenario}.a${n}.g1.title`, noteKey: `practice.${scenario}.a${n}.g1.note` },
      { titleKey: `practice.${scenario}.a${n}.g2.title`, noteKey: `practice.${scenario}.a${n}.g2.note` },
    ],
  };
}

export const PRACTICE_ANALYSIS: Record<LearnPracticeId, readonly [OptionAnalysis, OptionAnalysis, OptionAnalysis]> = {
  hos1: [opt('hos1', 0), opt('hos1', 1), opt('hos1', 2)],
  hos2: [opt('hos2', 0), opt('hos2', 1), opt('hos2', 2)],
  hos3: [opt('hos3', 0), opt('hos3', 1), opt('hos3', 2)],
  hos4: [opt('hos4', 0), opt('hos4', 1), opt('hos4', 2)],
};

export function getOptionAnalysis(scenarioId: LearnPracticeId, optionIndex: number): OptionAnalysis {
  const idx = Math.max(0, Math.min(optionIndex, 2)) as OptionIndex;
  return PRACTICE_ANALYSIS[scenarioId][idx];
}
