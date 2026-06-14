import React, { useEffect, useState } from 'react';
import { t, type Lang } from '../i18n';
import type { AppProfile } from '../app/types';
import { getGeneratorPrefill } from '../app/profileRecommendation';
import { scenarioCategory } from '../app/profileUtils';
import { getCardContext, getCardDef, getCardEx, getCardTerm } from './cardText';
import { appendCustomDeck, mockGenerateScenarioDeck, type ScenarioGeneratorInput } from './mockScenarioGenerator';
import type { FlashcardDeck } from './types';

type Phase = 'form' | 'generating' | 'result';

type Props = {
  lang: Lang;
  profile: AppProfile;
  onDeckReady: (deck: FlashcardDeck) => void;
  onStudyDeck: (deck: FlashcardDeck) => void;
};

export function GenerateScenarioCards({ lang, profile, onDeckReady, onStudyDeck }: Props) {
  const prefill = getGeneratorPrefill(profile, lang);
  const [phase, setPhase] = useState<Phase>('form');
  const [job, setJob] = useState(prefill.job);
  const [goal, setGoal] = useState(prefill.goal);
  const [scenario, setScenario] = useState(prefill.scenario);
  const [activeStep, setActiveStep] = useState(0);
  const [stepKey, setStepKey] = useState('');
  const [generatedDeck, setGeneratedDeck] = useState<FlashcardDeck | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phase !== 'form') return;
    const next = getGeneratorPrefill(profile, lang);
    setJob(next.job);
    setGoal(next.goal);
    setScenario(next.scenario);
  }, [profile, lang, phase]);

  const canGenerate = job.trim().length > 1 && goal.trim().length > 1 && scenario.trim().length > 1;

  const handleGenerate = async () => {
    if (!canGenerate || phase === 'generating') return;
    setError('');
    setPhase('generating');
    setActiveStep(0);
    setGeneratedDeck(null);

    const input: ScenarioGeneratorInput = {
      job: job.trim(),
      goal: goal.trim(),
      scenario: scenario.trim(),
      englishLevel: profile.assessment?.englishLevel,
      professionCategory: scenarioCategory(profile.profession),
    };

    try {
      const deck = await mockGenerateScenarioDeck(input, (index, key) => {
        setActiveStep(index);
        setStepKey(key);
      });
      const saved = appendCustomDeck(deck);
      const latest = saved[0] ?? deck;
      setGeneratedDeck(latest);
      onDeckReady(latest);
      setPhase('result');
    } catch {
      setError(t(lang, 'flash.gen.error'));
      setPhase('form');
    }
  };

  const resetForm = () => {
    setPhase('form');
    setGeneratedDeck(null);
    setActiveStep(0);
    setStepKey('');
  };

  return (
    <section className="flash-gen" aria-labelledby="flash-gen-heading">
      <header className="flash-gen__header">
        <h2 id="flash-gen-heading" className="flash-gen__title">
          {t(lang, 'flash.gen.title')}
        </h2>
        <p className="flash-gen__lead muted">{t(lang, 'flash.gen.lead')}</p>
        <p className="flash-gen__prefill muted">{t(lang, 'flash.gen.profilePrefill')}</p>
      </header>

      {phase === 'form' ? (
        <form
          className="flash-gen__form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleGenerate();
          }}
        >
          <label className="flash-gen__field">
            <span className="flash-gen__label">{t(lang, 'flash.gen.job')}</span>
            <input
              className="dialago-input"
              value={job}
              onChange={(event) => setJob(event.target.value)}
              placeholder={t(lang, 'flash.gen.jobPlaceholder')}
            />
          </label>
          <label className="flash-gen__field">
            <span className="flash-gen__label">{t(lang, 'flash.gen.goal')}</span>
            <input
              className="dialago-input"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder={t(lang, 'flash.gen.goalPlaceholder')}
            />
          </label>
          <label className="flash-gen__field">
            <span className="flash-gen__label">{t(lang, 'flash.gen.scenario')}</span>
            <input
              className="dialago-input"
              value={scenario}
              onChange={(event) => setScenario(event.target.value)}
              placeholder={t(lang, 'flash.gen.scenarioPlaceholder')}
            />
          </label>
          {error ? <p className="flash-gen__error">{error}</p> : null}
          <button type="submit" className="dialago-btn dialago-btn--primary flash-gen__submit" disabled={!canGenerate}>
            {t(lang, 'flash.gen.generate')}
          </button>
        </form>
      ) : null}

      {phase === 'generating' ? (
        <div className="flash-gen__progress" role="status" aria-live="polite">
          <div className="flash-gen__orb" aria-hidden="true">
            <span className="flash-gen__orbRing" />
            <span className="flash-gen__orbCore" />
          </div>
          <p className="flash-gen__progressTitle">{t(lang, 'flash.gen.generatingTitle')}</p>
          <p className="flash-gen__progressStep">{stepKey ? t(lang, stepKey) : t(lang, 'flash.gen.step1')}</p>
          <ul className="flash-gen__steps" aria-hidden="true">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i} className={`flash-gen__step ${i <= activeStep ? 'is-done' : ''} ${i === activeStep ? 'is-active' : ''}`} />
            ))}
          </ul>
        </div>
      ) : null}

      {phase === 'result' && generatedDeck ? (
        <div className="flash-gen__result">
          <div className="flash-gen__resultHead">
            <p className="flash-gen__resultBadge">{t(lang, 'flash.gen.resultBadge')}</p>
            <h3 className="flash-gen__resultTitle">{generatedDeck.displayTitle}</h3>
            <p className="flash-gen__resultMeta muted">
              {t(lang, 'flash.gen.resultMeta', {
                count: String(generatedDeck.cards.length),
                job: generatedDeck.displayProfessionLabel ?? '',
              })}
            </p>
          </div>

          <ul className="flash-gen__cards">
            {generatedDeck.cards.map((card) => (
              <li key={card.id} className="flash-gen-card">
                <div className="flash-gen-card__row">
                  <span className="flash-gen-card__key">{t(lang, 'flash.gen.cardTerm')}</span>
                  <span className="flash-gen-card__val">{getCardTerm(lang, card)}</span>
                </div>
                <div className="flash-gen-card__row">
                  <span className="flash-gen-card__key">{t(lang, 'flash.gen.cardMeaning')}</span>
                  <span className="flash-gen-card__val muted">{getCardDef(lang, card)}</span>
                </div>
                <div className="flash-gen-card__row">
                  <span className="flash-gen-card__key">{t(lang, 'flash.gen.cardExample')}</span>
                  <span className="flash-gen-card__val">{getCardEx(lang, card)}</span>
                </div>
                <div className="flash-gen-card__row">
                  <span className="flash-gen-card__key">{t(lang, 'flash.gen.cardSource')}</span>
                  <span className="flash-gen-card__val flash-gen-card__source">{getCardContext(lang, card)}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="flash-gen__actions">
            <button type="button" className="dialago-btn dialago-btn--primary" onClick={() => onStudyDeck(generatedDeck)}>
              {t(lang, 'flash.gen.studyDeck')}
            </button>
            <button type="button" className="dialago-btn dialago-btn--ghost" onClick={resetForm}>
              {t(lang, 'flash.gen.generateAnother')}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
