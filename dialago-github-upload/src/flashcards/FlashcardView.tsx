import React from 'react';
import { getCardContext, getCardDef, getCardEx, getCardTerm } from './cardText';
import { getLearningStatus } from './cardProgress';
import { SpeakItSection } from './SpeakItSection';
import { t, type Lang } from '../i18n';
import type { CardProgress, Flashcard } from './types';

type Props = {
  lang: Lang;
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
  onStartPractice?: () => void;
  professionLabel: string;
  scenarioLabel: string;
  progress?: CardProgress;
  saved?: boolean;
  onSave?: () => void;
  index: number;
  total: number;
  compact?: boolean;
};

const STATUS_CLASS: Record<string, string> = {
  needs_practice: 'flash-status--needs',
  improving: 'flash-status--improving',
  mastered: 'flash-status--mastered',
};

export function FlashcardView({
  lang,
  card,
  flipped,
  onFlip,
  onStartPractice,
  professionLabel,
  scenarioLabel,
  progress,
  saved,
  onSave,
  index,
  total,
  compact = false,
}: Props) {
  const term = getCardTerm(lang, card);
  const definition = getCardDef(lang, card);
  const example = getCardEx(lang, card);
  const contextSentence = getCardContext(lang, card);
  const learningStatus = getLearningStatus(progress);
  const statusLabelKey = `flash.status.${learningStatus}`;

  return (
    <div className={compact ? 'flashcard-stack flashcard-stack--compact' : 'flashcard-stack'}>
      <div className="flash-scenario-badge" aria-label={t(lang, 'flash.scenarioBadgeA11y', { profession: professionLabel, scenario: scenarioLabel })}>
        <span className="flash-scenario-badge__profession">{professionLabel}</span>
        <span className="flash-scenario-badge__sep" aria-hidden="true">
          ›
        </span>
        <span className="flash-scenario-badge__scenario">{scenarioLabel}</span>
      </div>

      <div className="flashcard-stack__meta">
        <span className="flashcard-stack__count">
          {index + 1} / {total}
        </span>
        <div className="flashcard-stack__dots" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`flashcard-stack__dot ${i === index ? 'is-on' : ''}`} />
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`flashcard-flip ${flipped ? 'is-flipped' : ''}`}
        onClick={() => {
          if (!flipped) onFlip();
        }}
        aria-expanded={flipped}
        aria-label={flipped ? undefined : t(lang, 'flash.tapReveal')}
      >
        <span className="flashcard-flip__inner">
          <span className="flashcard-flip__face flashcard-flip__face--front">
            <span className="flashcard-flip__label">{t(lang, 'flash.frontLabel')}</span>
            <span className="flashcard-flip__term">{term}</span>
            <span className="flashcard-flip__hint muted">{t(lang, 'flash.tapReveal')}</span>
          </span>
          <span className="flashcard-flip__face flashcard-flip__face--back">
            <span className="flashcard-flip__label">{t(lang, 'flash.backLabel')}</span>
            <span className="flashcard-flip__term">{term}</span>
            <span className="flashcard-flip__def muted">{definition}</span>
            <span className="flashcard-flip__ex">{example}</span>
          </span>
        </span>
      </button>

      <div className="flash-learning-status">
        <span className="flash-learning-status__label">{t(lang, 'flash.learningStatus')}</span>
        <span className={`flash-status ${STATUS_CLASS[learningStatus] ?? ''}`}>{t(lang, statusLabelKey)}</span>
      </div>

      {flipped ? (
        <section className="flash-source-context" aria-labelledby="flash-source-heading">
          <h2 id="flash-source-heading" className="flash-source-context__heading">
            {t(lang, 'flash.seenInScenario')}
          </h2>
          <dl className="flash-source-context__list">
            <div className="flash-source-context__row">
              <dt>{t(lang, 'flash.contextScenario')}</dt>
              <dd>{scenarioLabel}</dd>
            </div>
            <div className="flash-source-context__row">
              <dt>{t(lang, 'flash.contextSentence')}</dt>
              <dd className="flash-source-context__quote">"{contextSentence}"</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {flipped ? <SpeakItSection lang={lang} card={card} /> : null}

      {flipped && onStartPractice ? (
        <button type="button" className="dialago-btn dialago-btn--ghost flash-practice-cta" onClick={onStartPractice}>
          {t(lang, 'flash.practiceInScenario')}
        </button>
      ) : null}

      {onSave ? (
        <button
          type="button"
          className={`flashcard-stack__save ${saved ? 'is-saved' : ''}`}
          onClick={onSave}
          aria-pressed={!!saved}
        >
          {saved ? t(lang, 'flash.saved') : t(lang, 'liveDemo.savePhrase')}
        </button>
      ) : null}
    </div>
  );
}
