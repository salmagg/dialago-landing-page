import React from 'react';
import { t, type Lang } from '../../i18n';
import { getOptionAnalysis } from '../practiceAnalysisContent';
import type { LearnPracticeId } from '../practiceContent';

type Props = {
  lang: Lang;
  scenarioId: LearnPracticeId;
  optionIndex: number;
  responseText: string;
  feedbackKey: string;
  onBack: () => void;
  onContinue: () => void;
};

export function DialogueAnalysisView({
  lang,
  scenarioId,
  optionIndex,
  responseText,
  feedbackKey,
  onBack,
  onContinue,
}: Props) {
  const analysis = getOptionAnalysis(scenarioId, optionIndex);

  return (
    <div className="dialago-screen dialago-screen--scroll dialago-dialogue-analysis">
      <header className="dialago-dialogue-analysis__head dialago-screen--pad-h">
        <button type="button" className="dialago-back" onClick={onBack}>
          ← {t(lang, 'practice.analysis.back')}
        </button>
        <h1 className="dialago-screen__title">{t(lang, 'practice.analysis.title')}</h1>
        <p className="dialago-screen__lead muted">{t(lang, 'practice.analysis.sub')}</p>
      </header>

      <div className="dialago-dialogue-analysis__body dialago-screen--pad-h">
        <section className="dialago-analysis-block">
          <h2 className="dialago-analysis-block__title">{t(lang, 'practice.analysis.yourResponse')}</h2>
          <div className="dialago-bubble dialago-bubble--out">
            <p className="dialago-bubble__meta muted">{t(lang, 'practice.bubbleYou')}</p>
            <p>{responseText}</p>
          </div>
          <p className="dialago-analysis-block__feedback">{t(lang, feedbackKey)}</p>
        </section>

        <section className="dialago-analysis-block">
          <h2 className="dialago-analysis-block__title">{t(lang, 'practice.analysis.vocab')}</h2>
          <ul className="dialago-vocab-list">
            {analysis.vocab.map((item) => (
              <li key={item.termKey} className="dialago-vocab-card">
                <p className="dialago-vocab-card__term">{t(lang, item.termKey)}</p>
                <p className="dialago-vocab-card__def muted">{t(lang, item.defKey)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="dialago-analysis-block">
          <h2 className="dialago-analysis-block__title">{t(lang, 'practice.analysis.grammar')}</h2>
          <ul className="dialago-grammar-list">
            {analysis.grammar.map((item) => (
              <li key={item.titleKey} className="dialago-grammar-card">
                <p className="dialago-grammar-card__title">{t(lang, item.titleKey)}</p>
                <p className="dialago-grammar-card__note muted">{t(lang, item.noteKey)}</p>
              </li>
            ))}
          </ul>
        </section>

        <button type="button" className="dialago-btn dialago-btn--primary dialago-dialogue-analysis__cta" onClick={onContinue}>
          {t(lang, 'practice.analysis.continue')}
        </button>
      </div>
    </div>
  );
}
