import React, { useCallback, useEffect, useState } from 'react';
import { getCardContext, getCardDef, getCardEx, getCardTerm } from './cardText';
import { getLearningStatus } from './cardProgress';
import { overlayOpacity } from './swipeGesture';
import { SpeakItSection } from './SpeakItSection';
import { useSwipeGesture } from './useSwipeGesture';
import { t, type Lang } from '../i18n';
import type { CardProgress, Flashcard, SessionProgress, SwipeOutcome } from './types';

type Props = {
  lang: Lang;
  card: Flashcard;
  flipped: boolean;
  onReveal: () => void;
  onFlipBack: () => void;
  onSwipeCommit: (outcome: SwipeOutcome) => void;
  onStartPractice?: () => void;
  professionLabel: string;
  scenarioLabel: string;
  progress?: CardProgress;
  saved?: boolean;
  onSave?: () => void;
  sessionProgress: SessionProgress;
};

const STATUS_CLASS: Record<string, string> = {
  needs_practice: 'flash-status--needs',
  improving: 'flash-status--improving',
  mastered: 'flash-status--mastered',
};

function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconReview() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4v5h5M20 20v-5h-5M20 9a8 8 0 00-14.5-2M4 15a8 8 0 0014.5 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SwipeFlashcardTrainer({
  lang,
  card,
  flipped,
  onReveal,
  onFlipBack,
  onSwipeCommit,
  onStartPractice,
  professionLabel,
  scenarioLabel,
  progress,
  saved,
  onSave,
  sessionProgress,
}: Props) {
  const [hintPulse, setHintPulse] = useState(false);
  const term = getCardTerm(lang, card);
  const definition = getCardDef(lang, card);
  const example = getCardEx(lang, card);
  const contextSentence = getCardContext(lang, card);
  const learningStatus = getLearningStatus(progress);
  const statusLabelKey = `flash.status.${learningStatus}`;

  const handleHintPulse = useCallback(() => {
    setHintPulse(true);
  }, []);

  useEffect(() => {
    if (!hintPulse) return;
    const timer = window.setTimeout(() => setHintPulse(false), 520);
    return () => window.clearTimeout(timer);
  }, [hintPulse]);

  const { drag, exiting, bind } = useSwipeGesture({
    flipped,
    onReveal,
    onFlipBack,
    onHintPulse: handleHintPulse,
    onSwipeCommit,
  });

  const overlays = overlayOpacity(drag.offsetX);
  const cardStyle: React.CSSProperties = {
    transform: `translate3d(${drag.offsetX}px, ${drag.offsetY}px, 0) rotate(${drag.rotation}deg)`,
    transition: exiting ? 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)' : drag.offsetX !== 0 ? 'none' : undefined,
  };

  return (
    <div className="flash-swipe-trainer">
      <div className="flash-scenario-badge" aria-label={t(lang, 'flash.scenarioBadgeA11y', { profession: professionLabel, scenario: scenarioLabel })}>
        <span className="flash-scenario-badge__profession">{professionLabel}</span>
        <span className="flash-scenario-badge__sep" aria-hidden="true">
          ›
        </span>
        <span className="flash-scenario-badge__scenario">{scenarioLabel}</span>
      </div>

      <div className="flash-swipe-progress" aria-live="polite">
        <span className="flash-swipe-progress__count">
          {t(lang, 'flash.swipe.cardProgress', {
            current: String(sessionProgress.currentCard),
            total: String(sessionProgress.initialTotal),
          })}
        </span>
        <div className="flash-swipe-progress__stats">
          <span className="flash-swipe-progress__stat flash-swipe-progress__stat--known">
            {t(lang, 'flash.swipe.mastered', { count: String(sessionProgress.mastered) })}
          </span>
          <span className="flash-swipe-progress__stat flash-swipe-progress__stat--learning">
            {t(lang, 'flash.swipe.reviewing', { count: String(sessionProgress.reviewing) })}
          </span>
        </div>
      </div>

      <div className="flash-swipe-stage">
        <div
          className={`flash-swipe-overlay flash-swipe-overlay--known ${drag.intent === 'known' ? 'is-active' : ''}`}
          style={{ opacity: overlays.known }}
          aria-hidden="true"
        >
          <IconCheck />
          <span>{t(lang, 'flash.swipe.known')}</span>
        </div>
        <div
          className={`flash-swipe-overlay flash-swipe-overlay--learning ${drag.intent === 'learning' ? 'is-active' : ''}`}
          style={{ opacity: overlays.learning }}
          aria-hidden="true"
        >
          <IconReview />
          <span>{t(lang, 'flash.swipe.reviewAgain')}</span>
        </div>

        <div className="flash-swipe-card-wrap" {...bind} aria-label={flipped ? undefined : t(lang, 'flash.tapReveal')}>
          <div className="flash-swipe-card" style={cardStyle}>
            <div className={`flashcard-flip ${flipped ? 'is-flipped' : ''}`}>
              <span className="flashcard-flip__inner">
                <span className="flashcard-flip__face flashcard-flip__face--front">
                  <span className="flashcard-flip__label">{t(lang, 'flash.frontLabel')}</span>
                  <span className="flashcard-flip__term">{term}</span>
                  <span className={`flashcard-flip__hint muted ${hintPulse ? 'is-pulse' : ''}`}>{t(lang, 'flash.tapReveal')}</span>
                </span>
                <span className="flashcard-flip__face flashcard-flip__face--back">
                  <span className="flashcard-flip__label">{t(lang, 'flash.backLabel')}</span>
                  <span className="flashcard-flip__term">{term}</span>
                  <span className="flashcard-flip__def muted">{definition}</span>
                  <span className="flashcard-flip__ex">{example}</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="flash-swipe-hint muted">
        {flipped ? t(lang, 'flash.swipe.gestureHint') : t(lang, 'flash.swipe.revealFirst')}
      </p>

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
