import React, { useCallback, useEffect, useRef, useState } from 'react';
import { t } from '../../i18n';
import { useApp } from '../AppContext';
import { ProfileDashboard } from '../components/ProfileDashboard';
import { SelectableField } from '../components/SelectableField';
import {
  ANALYSIS_CHECK_KEYS,
  FOCUSES,
  GOALS,
  LOCATIONS,
  MANUAL_ID,
  NATIVE_LANGS,
  PROFESSIONS,
  VOCAB_QUESTIONS,
} from '../profileConstants';
import { displayField, isValidProfileAge, professionDisplay } from '../profileUtils';
import { computeAssessment } from '../profileAssessment';
import { useSpeakingAssessment } from '../hooks/useSpeakingAssessment';
import type { SpeakingIntroResult } from '../speakingIntroApi';
import type { AssessStage, SetupPhase } from '../types';

const ANALYSIS_MS = 3400;
const ANALYSIS_CHECK_MS = 520;
const VOCAB_ADVANCE_MS = 850;
const WRITING_CHAR_MS = 38;

function AssessRail({ stage }: { stage: AssessStage }) {
  const stages: AssessStage[] = ['age', 'vocab', 'writing', 'speaking'];
  const idx = stages.indexOf(stage);
  return (
    <div className="dialago-assess-rail" aria-hidden="true">
      {stages.map((s, i) => (
        <span key={s} className={`dialago-assess-rail__seg ${i <= idx ? 'is-done' : ''} ${s === stage ? 'is-active' : ''}`} />
      ))}
    </div>
  );
}

function IconMic() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zM6 11v1a6 6 0 0012 0v-1M12 18v3"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SetupWizard() {
  const { lang, profile, setProfile, completeSetup } = useApp();
  const [phase, setPhase] = useState<SetupPhase>('onboarding');
  const [assessStage, setAssessStage] = useState<AssessStage>('age');
  const [vocabQIndex, setVocabQIndex] = useState(0);
  const [vocabPick, setVocabPick] = useState<number | null>(null);
  const [vocabConfirmed, setVocabConfirmed] = useState(false);
  const [vocabCorrect, setVocabCorrect] = useState(0);
  const [vocabAnswered, setVocabAnswered] = useState(0);
  const [writingText, setWritingText] = useState('');
  const [writingDone, setWritingDone] = useState(false);
  const [analysisChecks, setAnalysisChecks] = useState(0);

  const vocabTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const writingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySpeakingIntro = useCallback(
    (result: SpeakingIntroResult) => {
      setProfile((p) => {
        const next = { ...p };
        if (result.name.trim()) next.firstName = result.name.trim();
        if (result.profession.trim()) {
          next.profession = {
            presetId: MANUAL_ID,
            manual: true,
            customText: result.profession.trim(),
          };
        }
        return next;
      });
    },
    [setProfile],
  );

  const speaking = useSpeakingAssessment({ onExtracted: applySpeakingIntro });
  const { phase: speakingPhase, transcript: speakingTranscript, error: speakingError, isDemo: speakingIsDemo, isRecording: speakingRecording, micSupported: speakingMicSupported, toggleRecording: toggleSpeakingRecording, reset: resetSpeaking, busy: speakingBusy } = speaking;

  const writingFull = t(lang, 'profile.writing.sampleReply');
  const vocabQ = VOCAB_QUESTIONS[vocabQIndex];

  const professionLabel = professionDisplay(lang, profile.profession);
  const canContinueOnboard =
    professionLabel.length > 0 &&
    isValidProfileAge(profile.age) &&
    (profile.location.manual ? profile.location.customText.trim() : true) &&
    displayField(lang, NATIVE_LANGS, profile.nativeLanguage, 'profile.lang').length > 0 &&
    displayField(lang, FOCUSES, profile.focus, 'profile.focus').length > 0 &&
    displayField(lang, GOALS, profile.goal, 'profile.goal').length > 0;

  const resetAssessment = useCallback(() => {
    setAssessStage('age');
    setVocabQIndex(0);
    setVocabPick(null);
    setVocabConfirmed(false);
    setVocabCorrect(0);
    setVocabAnswered(0);
    setWritingText('');
    setWritingDone(false);
    resetSpeaking();
    setAnalysisChecks(0);
  }, [resetSpeaking]);

  const onVocabSelect = (index: number) => {
    if (vocabConfirmed) return;
    const q = VOCAB_QUESTIONS[vocabQIndex];
    setVocabPick(index);
    setVocabAnswered((n) => n + 1);
    if (index === q.correctIndex) {
      setVocabCorrect((n) => n + 1);
      setVocabConfirmed(true);
      vocabTimer.current = setTimeout(() => {
        setVocabConfirmed(false);
        setVocabPick(null);
        if (vocabQIndex < VOCAB_QUESTIONS.length - 1) {
          setVocabQIndex((v) => v + 1);
        } else {
          setAssessStage('writing');
        }
      }, VOCAB_ADVANCE_MS);
    }
  };

  const finishAssessment = () => {
    const assessment = computeAssessment({
      vocabCorrect,
      vocabAnswered,
      writingComplete: writingDone,
      speakingComplete: true,
    });
    setProfile((p) => ({ ...p, assessment }));
    setPhase('analysis');
  };

  useEffect(() => {
    if (phase !== 'assessment' || assessStage !== 'writing' || writingDone) return;
    setWritingText('');
    let i = 0;
    const tick = () => {
      i += 1;
      setWritingText(writingFull.slice(0, i));
      if (i < writingFull.length) {
        writingTimer.current = setTimeout(tick, WRITING_CHAR_MS);
      } else {
        writingTimer.current = setTimeout(() => setWritingDone(true), 500);
      }
    };
    writingTimer.current = setTimeout(tick, 400);
    return () => {
      if (writingTimer.current) clearTimeout(writingTimer.current);
    };
  }, [phase, assessStage, writingDone, writingFull]);

  useEffect(() => {
    if (phase !== 'analysis') return;
    setAnalysisChecks(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_CHECK_KEYS.forEach((_, i) => {
      timers.push(setTimeout(() => setAnalysisChecks(i + 1), (i + 1) * ANALYSIS_CHECK_MS));
    });
    timers.push(setTimeout(() => setPhase('profile'), ANALYSIS_MS));
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(
    () => () => {
      if (vocabTimer.current) clearTimeout(vocabTimer.current);
      if (writingTimer.current) clearTimeout(writingTimer.current);
    },
    [],
  );

  if (phase === 'onboarding') {
    return (
      <div className="dialago-setup dialago-setup--scroll">
        <header className="dialago-setup__header">
          <p className="dialago-eyebrow">{t(lang, 'profile.welcomeEyebrow')}</p>
          <h1 className="dialago-setup__title">{t(lang, 'profile.welcomeTitle')}</h1>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.welcomeLead')}</p>
        </header>
        <div className="dialago-setup__fields">
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldProfession')}
            options={PROFESSIONS}
            manualPlaceholderKey="profile.placeholderProfession"
            value={profile.profession}
            onChange={(v) => setProfile((p) => ({ ...p, profession: v }))}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldLocation')}
            options={LOCATIONS}
            manualPlaceholderKey="profile.placeholderLocation"
            value={profile.location}
            onChange={(v) => setProfile((p) => ({ ...p, location: v }))}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldNativeLanguage')}
            options={NATIVE_LANGS}
            manualPlaceholderKey="profile.placeholderNativeLanguage"
            value={profile.nativeLanguage}
            onChange={(v) => setProfile((p) => ({ ...p, nativeLanguage: v }))}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldFocus')}
            options={FOCUSES}
            manualPlaceholderKey="profile.placeholderFocus"
            value={profile.focus}
            onChange={(v) => setProfile((p) => ({ ...p, focus: v }))}
          />
          <SelectableField
            lang={lang}
            label={t(lang, 'profile.fieldGoal')}
            options={GOALS}
            manualPlaceholderKey="profile.placeholderGoal"
            value={profile.goal}
            onChange={(v) => setProfile((p) => ({ ...p, goal: v }))}
          />
          <label className="dialago-age-field">
            <span className="dialago-age-field__label">{t(lang, 'profile.age.label')}</span>
            <input
              className="dialago-input dialago-age-field__input"
              type="number"
              inputMode="numeric"
              min={16}
              max={99}
              placeholder={t(lang, 'profile.age.placeholder')}
              value={profile.age ?? ''}
              onChange={(event) => {
                const raw = event.target.value;
                if (!raw) {
                  setProfile((p) => ({ ...p, age: undefined }));
                  return;
                }
                const next = Number.parseInt(raw, 10);
                setProfile((p) => ({ ...p, age: Number.isNaN(next) ? undefined : next }));
              }}
            />
          </label>
        </div>
        <footer className="dialago-setup__footer">
          <button
            type="button"
            className="dialago-btn dialago-btn--primary"
            disabled={!canContinueOnboard}
            onClick={() => {
              resetAssessment();
              setPhase('assessment');
            }}
          >
            {t(lang, 'profile.continueAssessment')}
          </button>
        </footer>
      </div>
    );
  }

  if (phase === 'analysis') {
    return (
      <div className="dialago-setup dialago-setup--center">
        <div className="dialago-analysis-orb" aria-hidden="true">
          <span className="dialago-analysis-orb__ring" />
          <span className="dialago-analysis-orb__core" />
        </div>
        <h2 className="dialago-setup__title">{t(lang, 'profile.analysis.title')}</h2>
        <p className="dialago-setup__lead muted">{t(lang, 'profile.analysis.sub')}</p>
        <ul className="dialago-analysis-list">
          {ANALYSIS_CHECK_KEYS.map((key, i) => (
            <li key={key} className={`dialago-analysis-list__item ${analysisChecks > i ? 'is-done' : ''}`}>
              <span className="dialago-analysis-list__check">{analysisChecks > i ? '✓' : ''}</span>
              <span>{t(lang, key)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (phase === 'profile') {
    return (
      <div className="dialago-setup dialago-setup--scroll">
        <header className="dialago-setup__header">
          <h1 className="dialago-setup__title">{t(lang, 'profile.screenTitle')}</h1>
        </header>
        <ProfileDashboard />
        <footer className="dialago-setup__footer">
          <button type="button" className="dialago-btn dialago-btn--primary" onClick={completeSetup}>
            {t(lang, 'app.profile.enterApp')}
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="dialago-setup dialago-setup--scroll">
      <AssessRail stage={assessStage} />
      {assessStage === 'age' && (
        <>
          <h2 className="dialago-setup__title">{t(lang, 'profile.age.title')}</h2>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.age.sub')}</p>
          {isValidProfileAge(profile.age) ? (
            <p className="dialago-assess-ok">
              {t(lang, 'profile.age.confirmed').replace('{age}', String(profile.age))}
            </p>
          ) : (
            <label className="dialago-age-field">
              <span className="dialago-age-field__label">{t(lang, 'profile.age.label')}</span>
              <input
                className="dialago-input dialago-age-field__input"
                type="number"
                inputMode="numeric"
                min={16}
                max={99}
                placeholder={t(lang, 'profile.age.placeholder')}
                value={profile.age ?? ''}
                onChange={(event) => {
                  const raw = event.target.value;
                  if (!raw) {
                    setProfile((p) => ({ ...p, age: undefined }));
                    return;
                  }
                  const next = Number.parseInt(raw, 10);
                  setProfile((p) => ({ ...p, age: Number.isNaN(next) ? undefined : next }));
                }}
              />
            </label>
          )}
          <footer className="dialago-setup__footer">
            <button
              type="button"
              className="dialago-btn dialago-btn--primary"
              disabled={!isValidProfileAge(profile.age)}
              onClick={() => setAssessStage('vocab')}
            >
              {t(lang, 'app.setup.continue')}
            </button>
          </footer>
        </>
      )}

      {assessStage === 'vocab' && (
        <>
          <h2 className="dialago-setup__title">{t(lang, 'profile.vocab.title')}</h2>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.vocab.sub')}</p>
          <p className="dialago-assess-prompt">{t(lang, vocabQ.promptKey)}</p>
          <div className="dialago-assess-options">
            {vocabQ.optionKeys.map((key, i) => (
              <button
                key={key}
                type="button"
                className={`dialago-assess-opt ${vocabPick === i ? 'is-picked' : ''} ${vocabConfirmed && vocabPick === i && i === vocabQ.correctIndex ? 'is-correct' : ''}`}
                onClick={() => onVocabSelect(i)}
                disabled={vocabConfirmed}
              >
                {t(lang, key)}
              </button>
            ))}
          </div>
          {vocabConfirmed ? <p className="dialago-assess-ok">{t(lang, 'profile.vocab.confirmed')}</p> : null}
          <p className="dialago-assess-count muted">
            {vocabQIndex + 1} / {VOCAB_QUESTIONS.length}
          </p>
        </>
      )}

      {assessStage === 'writing' && (
        <>
          <h2 className="dialago-setup__title">{t(lang, 'profile.writing.title')}</h2>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.writing.sub')}</p>
          <div className="dialago-chat">
            <div className="dialago-bubble dialago-bubble--in">
              <p className="dialago-bubble__meta muted">{t(lang, 'profile.writing.incoming')}</p>
              <p>{t(lang, 'profile.writing.prompt')}</p>
            </div>
            <div className="dialago-bubble dialago-bubble--out">
              <p className="dialago-bubble__meta muted">{t(lang, 'profile.bubbleYou')}</p>
              <p>{writingText}</p>
            </div>
          </div>
          {writingDone ? (
            <p className="dialago-assess-ok">{t(lang, 'profile.writing.feedback')}</p>
          ) : (
            <p className="muted dialago-assess-typing">{t(lang, 'profile.writing.typing')}</p>
          )}
          <footer className="dialago-setup__footer">
            <button
              type="button"
              className="dialago-btn dialago-btn--primary"
              disabled={!writingDone}
              onClick={() => setAssessStage('speaking')}
            >
              {t(lang, 'app.setup.continue')}
            </button>
          </footer>
        </>
      )}

      {assessStage === 'speaking' && (
        <>
          <h2 className="dialago-setup__title">{t(lang, 'profile.speaking.title')}</h2>
          <p className="dialago-setup__lead muted">{t(lang, 'profile.speaking.sub')}</p>
          <div className="dialago-chat">
            <div className="dialago-bubble dialago-bubble--in">
              <p className="dialago-bubble__meta muted">{t(lang, 'profile.bubbleCoach')}</p>
              <p>{t(lang, 'profile.speaking.aiPrompt')}</p>
            </div>
            {(speakingPhase === 'transcribing' ||
              speakingPhase === 'analyzing' ||
              speakingPhase === 'done' ||
              speakingPhase === 'error') &&
            speakingTranscript ? (
              <div className="dialago-bubble dialago-bubble--out">
                <p className="dialago-bubble__meta muted">{t(lang, 'profile.bubbleYou')}</p>
                <p>{speakingTranscript}</p>
              </div>
            ) : null}
            {speakingPhase === 'done' ? (
              <p className="dialago-assess-ok">{t(lang, 'profile.speaking.feedback')}</p>
            ) : null}
            {speakingPhase === 'transcribing' ? (
              <p className="muted dialago-assess-typing">{t(lang, 'profile.speaking.transcribing')}</p>
            ) : null}
            {speakingPhase === 'analyzing' ? (
              <p className="muted dialago-assess-typing">{t(lang, 'profile.speaking.analyzing')}</p>
            ) : null}
            {speakingError ? <p className="flash-gen__error">{speakingError}</p> : null}
            {speakingIsDemo ? <p className="dialago-speaking-hint muted">{t(lang, 'profile.speaking.demoMode')}</p> : null}
          </div>
          <div className="dialago-speaking-controls">
            <button
              type="button"
              className={`dialago-mic ${speakingRecording ? 'is-recording' : ''}`}
              onClick={toggleSpeakingRecording}
              disabled={!speakingMicSupported || speakingBusy || speakingPhase === 'done'}
              aria-label={t(lang, 'profile.speaking.micAria')}
            >
              <IconMic />
            </button>
            <div className={`dialago-wave ${speakingRecording ? 'is-active' : ''}`} aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          </div>
          <p className="dialago-speaking-hint muted">
            {speakingRecording
              ? t(lang, 'profile.speaking.tapToStop')
              : speakingPhase === 'error'
                ? t(lang, 'profile.speaking.tapToRetry')
                : t(lang, 'profile.speaking.tapToStart')}
          </p>
          {!speakingMicSupported ? (
            <p className="flash-gen__error">{t(lang, 'profile.speaking.micUnsupported')}</p>
          ) : null}
          <footer className="dialago-setup__footer">
            <button
              type="button"
              className="dialago-btn dialago-btn--primary"
              disabled={speakingPhase !== 'done'}
              onClick={finishAssessment}
            >
              {t(lang, 'profile.assess.finish')}
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
