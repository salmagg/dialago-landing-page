import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { t, type Lang } from '../i18n';

type Step = 1 | 2 | 3 | 4;

type Props = { lang: Lang };

const OPTION_KEYS = ['liveDemo.opt1', 'liveDemo.opt2', 'liveDemo.opt3'] as const;

const S4_OPTION_KEYS = ['liveDemo.s4opt1', 'liveDemo.s4opt2', 'liveDemo.s4opt3'] as const;
const S4_FEEDBACK_KEYS = ['liveDemo.s4fb1', 'liveDemo.s4fb2', 'liveDemo.s4fb3'] as const;

const FLASHCARDS = [
  { term: 'liveDemo.fc1Term', def: 'liveDemo.fc1Def', ex: 'liveDemo.fc1Ex' },
  { term: 'liveDemo.fc2Term', def: 'liveDemo.fc2Def', ex: 'liveDemo.fc2Ex' },
  { term: 'liveDemo.fc3Term', def: 'liveDemo.fc3Def', ex: 'liveDemo.fc3Ex' },
] as const;

const BULLET_KEYS = ['liveDemo.bullet1', 'liveDemo.bullet2', 'liveDemo.bullet3'] as const;

function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.9 5.9H20l-5 3.6 1.9 5.9L12 15.8 7.1 18.4 9 12.5 4 8.9h6.1L12 3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconReply({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 17H7a2 2 0 01-2-2v-2M9 17v2.5M9 17l4-4-4-4M15 7h2a2 2 0 012 2v2"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InteractiveScenarioDemo({ lang }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [appliedSel, setAppliedSel] = useState<number | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [savedByCard, setSavedByCard] = useState<Record<number, boolean>>({});

  const phoneRef = useRef<HTMLDivElement | null>(null);
  const feedbackId = useId();
  const feedback4Id = useId();

  const resetPersona = useCallback(() => {
    setStep(1);
    setSelected(null);
    setAppliedSel(null);
    setCardIndex(0);
    setSavedByCard({});
  }, []);

  const goConversation = useCallback(() => {
    setStep(2);
    setSelected(null);
  }, []);

  const goFlashcards = useCallback(() => {
    setStep(3);
  }, []);

  const goApplied = useCallback(() => {
    setStep(4);
    setAppliedSel(null);
  }, []);

  const startFromLanding = useCallback(() => {
    resetPersona();
    requestAnimationFrame(() => {
      phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }, [resetPersona]);

  useEffect(() => {
    if (step === 1) {
      setSelected(null);
      setAppliedSel(null);
    }
  }, [step]);

  const onSavePhrase = () => {
    setSavedByCard((s) => ({ ...s, [cardIndex]: !s[cardIndex] }));
  };

  const nextPhrase = () => {
    setCardIndex((i) => (i + 1) % FLASHCARDS.length);
  };

  const fc = FLASHCARDS[cardIndex];

  return (
    <div className="liveDemo">
      <div className="liveDemo__intro">
        <p className="liveDemo__eyebrow">{t(lang, 'liveDemo.eyebrow')}</p>
        <h2 className="h2 liveDemo__headline">{t(lang, 'liveDemo.headline')}</h2>
        <p className="liveDemo__subhead muted">{t(lang, 'liveDemo.subhead')}</p>
        <p className="p muted liveDemo__body">{t(lang, 'liveDemo.body')}</p>
        <ul className="liveDemo__bullets" aria-label={t(lang, 'liveDemo.bulletsAria')}>
          {BULLET_KEYS.map((key) => (
            <li key={key} className="liveDemo__bullet">
              {t(lang, key)}
            </li>
          ))}
        </ul>
        <button type="button" className="btn btn--primary liveDemo__cta" onClick={startFromLanding}>
          {t(lang, 'liveDemo.cta')}
        </button>
      </div>

      <div className="liveDemo__deviceCol">
        <div ref={phoneRef} className="liveDemoPhone" aria-label={t(lang, 'a11y.liveDemoPhone')}>
          <div className="liveDemoPhone__rail" aria-hidden="true" />
          <div className="liveDemoPhone__body">
            <div className="liveDemoPhone__notch" aria-hidden="true" />
            <div className="liveDemoPhone__inner">
              <div className={`liveDemoPane liveDemoPane--1 ${step === 1 ? 'is-active' : ''}`} aria-hidden={step !== 1}>
                <div className="liveDemoStatus" aria-hidden="true">
                  <span>9:41</span>
                </div>
                <div className="liveDemoAppHeader">{t(lang, 'liveDemo.ctxTitle')}</div>
                <div className="liveDemoCard">
                  <div className="liveDemoCard__name">{t(lang, 'liveDemo.name')}</div>
                  <div className="liveDemoCard__role muted">{t(lang, 'liveDemo.role')}</div>
                  <div className="liveDemoCard__row">
                    <span className="liveDemoCard__label muted">{t(lang, 'liveDemo.focusLabel')}</span>
                    <span className="liveDemoCard__value">{t(lang, 'liveDemo.focus')}</span>
                  </div>
                  <div className="liveDemoCard__row">
                    <span className="liveDemoCard__label muted">{t(lang, 'liveDemo.scenarioLabel')}</span>
                    <span className="liveDemoCard__value">{t(lang, 'liveDemo.scenario')}</span>
                  </div>
                  <p className="liveDemoCard__tagline muted">{t(lang, 'liveDemo.tagline')}</p>
                  <button type="button" className="btn btn--primary liveDemoCard__btn" onClick={goConversation}>
                    {t(lang, 'liveDemo.start')}
                  </button>
                </div>
              </div>

              <div className={`liveDemoPane liveDemoPane--2 ${step === 2 ? 'is-active' : ''}`} aria-hidden={step !== 2}>
                <div className="liveDemoStatus" aria-hidden="true">
                  <span>9:41</span>
                </div>
                <div className="liveDemoAppHeader">{t(lang, 'liveDemo.screen2Title')}</div>
                <div className="liveDemoChat">
                  <div className="liveDemoChat__thread">
                    <div className="liveDemoBubble liveDemoBubble--patient">
                      <p className="liveDemoBubble__meta muted">{t(lang, 'liveDemo.bubblePatient')}</p>
                      <p className="liveDemoBubble__text">{t(lang, 'liveDemo.patientMsg')}</p>
                    </div>
                  </div>
                  <p className="liveDemoChat__prompt">{t(lang, 'liveDemo.question')}</p>
                  <div className="liveDemoOptions" role="group" aria-label={t(lang, 'liveDemo.question')}>
                    {OPTION_KEYS.map((key, i) => (
                      <button
                        key={key}
                        type="button"
                        className={`liveDemoOption ${selected === i ? 'is-selected' : ''}`}
                        onClick={() => setSelected(i)}
                        aria-pressed={selected === i}
                      >
                        <span className="liveDemoOption__index" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="liveDemoOption__label">{t(lang, key)}</span>
                      </button>
                    ))}
                  </div>
                  <div
                    id={feedbackId}
                    className={`liveDemoFeedback ${selected !== null ? 'is-visible' : ''}`}
                    role="status"
                    aria-live="polite"
                  >
                    {selected !== null ? (
                      <>
                        <p className="liveDemoFeedback__text">{t(lang, 'liveDemo.feedback')}</p>
                        <button type="button" className="btn btn--ghost liveDemoFeedback__btn" onClick={goFlashcards}>
                          {t(lang, 'liveDemo.continue')}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className={`liveDemoPane liveDemoPane--3 ${step === 3 ? 'is-active' : ''}`} aria-hidden={step !== 3}>
                <div className="liveDemoStatus" aria-hidden="true">
                  <span>9:41</span>
                </div>
                <div className="liveDemoAppHeader">{t(lang, 'liveDemo.screen3Title')}</div>
                <div className="liveDemoFlash">
                  <div className="liveDemoFlash__dots" aria-hidden="true">
                    {FLASHCARDS.map((c, i) => (
                      <span key={c.term} className={`liveDemoFlash__dot ${i === cardIndex ? 'is-on' : ''}`} />
                    ))}
                  </div>
                  <div key={cardIndex} className="liveDemoFlash__card">
                    <p className="liveDemoFlash__label">{t(lang, 'liveDemo.fcLabel')}</p>
                    <p className="liveDemoFlash__term">{t(lang, fc.term)}</p>
                    <p className="liveDemoFlash__def muted">{t(lang, fc.def)}</p>
                    <div className="liveDemoFlash__ex">
                      <p className="liveDemoFlash__exText">{t(lang, fc.ex)}</p>
                    </div>
                    <div className="liveDemoFlash__actions">
                      <button
                        type="button"
                        className={`liveDemoFlashBtn ${savedByCard[cardIndex] ? 'is-saved' : ''}`}
                        onClick={onSavePhrase}
                        aria-label={t(lang, 'a11y.liveDemoSavePhrase')}
                        aria-pressed={!!savedByCard[cardIndex]}
                      >
                        <IconStar />
                        <span>{t(lang, 'liveDemo.savePhrase')}</span>
                      </button>
                      <button
                        type="button"
                        className="liveDemoFlashBtn liveDemoFlashBtn--practice"
                        onClick={goApplied}
                        aria-label={t(lang, 'a11y.liveDemoPractice')}
                      >
                        <IconReply />
                        <span>{t(lang, 'liveDemo.practiceResponse')}</span>
                      </button>
                      <button type="button" className="liveDemoFlashBtn liveDemoFlashBtn--next" onClick={nextPhrase}>
                        <span>{t(lang, 'liveDemo.nextPhrase')}</span>
                        <IconArrow />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`liveDemoPane liveDemoPane--4 ${step === 4 ? 'is-active' : ''}`} aria-hidden={step !== 4}>
                <div className="liveDemoStatus" aria-hidden="true">
                  <span>9:41</span>
                </div>
                <div className="liveDemoAppHeader">{t(lang, 'liveDemo.screen4Title')}</div>
                <div className="liveDemoChat">
                  <div className="liveDemoChat__thread">
                    <div className="liveDemoBubble liveDemoBubble--patient">
                      <p className="liveDemoBubble__meta muted">{t(lang, 'liveDemo.bubblePatient')}</p>
                      <p className="liveDemoBubble__text">{t(lang, 'liveDemo.s4patient')}</p>
                    </div>
                  </div>
                  <p className="liveDemoChat__prompt">{t(lang, 'liveDemo.s4prompt')}</p>
                  <div className="liveDemoOptions" role="group" aria-label={t(lang, 'liveDemo.s4prompt')}>
                    {S4_OPTION_KEYS.map((key, i) => (
                      <button
                        key={key}
                        type="button"
                        className={`liveDemoOption ${appliedSel === i ? 'is-selected' : ''}`}
                        onClick={() => setAppliedSel(i)}
                        aria-pressed={appliedSel === i}
                      >
                        <span className="liveDemoOption__index" aria-hidden="true">
                          {i + 1}
                        </span>
                        <span className="liveDemoOption__label">{t(lang, key)}</span>
                      </button>
                    ))}
                  </div>
                  <div
                    id={feedback4Id}
                    className={`liveDemoFeedback liveDemoFeedback--applied ${appliedSel !== null ? 'is-visible' : ''}`}
                    role="status"
                    aria-live="polite"
                  >
                    {appliedSel !== null ? (
                      <>
                        <p className="liveDemoFeedback__text">{t(lang, S4_FEEDBACK_KEYS[appliedSel])}</p>
                        <button type="button" className="btn btn--ghost liveDemoFeedback__btn" onClick={resetPersona}>
                          {t(lang, 'liveDemo.restart')}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
