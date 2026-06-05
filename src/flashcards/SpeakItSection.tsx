import React, { useEffect, useRef, useState } from 'react';
import { t, type Lang } from '../i18n';
import { getCardTerm } from './cardText';
import { simulatePronunciationFeedback } from './pronunciationFeedback';
import type { Flashcard } from './types';

type Phase = 'idle' | 'recording' | 'analyzing' | 'feedback';

const RECORD_MS = 2200;
const ANALYZE_MS = 900;

function IconMic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zM6 11v1a6 6 0 0012 0v-1M12 18v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Props = {
  lang: Lang;
  card: Flashcard;
};

export function SpeakItSection({ lang, card }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const recordTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyzeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const termText = getCardTerm(lang, card);
  const feedback = simulatePronunciationFeedback(card, termText);

  useEffect(() => {
    setPhase('idle');
  }, [card.id]);

  useEffect(
    () => () => {
      if (recordTimer.current) clearTimeout(recordTimer.current);
      if (analyzeTimer.current) clearTimeout(analyzeTimer.current);
    },
    [],
  );

  const startRecording = () => {
    if (phase === 'recording' || phase === 'analyzing') return;
    setPhase('recording');
    if (recordTimer.current) clearTimeout(recordTimer.current);
    recordTimer.current = setTimeout(() => {
      setPhase('analyzing');
      if (analyzeTimer.current) clearTimeout(analyzeTimer.current);
      analyzeTimer.current = setTimeout(() => setPhase('feedback'), ANALYZE_MS);
    }, RECORD_MS);
  };

  const retry = () => setPhase('idle');

  return (
    <section className="flash-speak-it" aria-labelledby="flash-speak-heading">
      <h2 id="flash-speak-heading" className="flash-speak-it__heading">
        {t(lang, 'flash.speakIt')}
      </h2>

      {phase === 'idle' || phase === 'recording' ? (
        <div className="flash-speak-it__controls">
          <button
            type="button"
            className={`flash-speak-it__mic ${phase === 'recording' ? 'is-recording' : ''}`}
            onClick={startRecording}
            disabled={phase === 'recording'}
            aria-label={t(lang, 'flash.speakMicAria')}
            aria-pressed={phase === 'recording'}
          >
            <IconMic />
          </button>
          <div className={`flash-speak-it__wave ${phase === 'recording' ? 'is-active' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : null}

      <p className="flash-speak-it__hint muted">
        {phase === 'idle' && t(lang, 'flash.speakTapMic')}
        {phase === 'recording' && t(lang, 'flash.speakRecording')}
        {phase === 'analyzing' && t(lang, 'flash.speakAnalyzing')}
      </p>

      {phase === 'feedback' ? (
        <div className="flash-speak-feedback" role="status">
          <p className="flash-speak-feedback__title">{t(lang, 'flash.speakFeedbackTitle')}</p>

          <div className="flash-speak-feedback__score">
            <span className="flash-speak-feedback__scoreLabel">{t(lang, 'flash.speakScoreLabel')}</span>
            <span className="flash-speak-feedback__scoreValue">{t(lang, 'flash.speakScore', { score: String(feedback.score) })}</span>
            <div className="flash-speak-feedback__bar" aria-hidden="true">
              <span className="flash-speak-feedback__barFill" style={{ width: `${feedback.score}%` }} />
            </div>
          </div>

          <div className="flash-speak-feedback__block flash-speak-feedback__block--good">
            <p className="flash-speak-feedback__blockLabel">{t(lang, 'flash.speakStrengths')}</p>
            <p className="flash-speak-feedback__blockText">{t(lang, feedback.strengthKey)}</p>
          </div>

          <div className="flash-speak-feedback__block flash-speak-feedback__block--improve">
            <p className="flash-speak-feedback__blockLabel">{t(lang, 'flash.speakNeedsImprovement')}</p>
            <p className="flash-speak-feedback__blockText">
              {t(lang, feedback.improvementKey, { word: feedback.improvementWord })}
            </p>
          </div>

          <button type="button" className="dialago-link-btn flash-speak-feedback__retry" onClick={retry}>
            {t(lang, 'flash.speakTryAgain')}
          </button>
        </div>
      ) : null}
    </section>
  );
}
