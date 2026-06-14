import React, { useEffect, useState } from 'react';
import { t } from '../../i18n';
import { VoiceTutorSession } from '../../voice-tutor';
import { ScenarioPracticeSession } from '../components/ScenarioPracticeSession';
import { useApp } from '../AppContext';
import { isLearnPracticeId } from '../practiceContent';
import { PRACTICE_SCENARIOS } from '../profileConstants';

type View = 'list' | 'session' | 'voice-tutor';

export function PracticeScreen() {
  const {
    lang,
    activePracticeScenarioId,
    clearPracticeScenario,
    voiceTutorLaunch,
    clearVoiceTutorLaunch,
    launchVoiceTutor,
  } = useApp();
  const [view, setView] = useState<View>('list');
  const [localScenarioId, setLocalScenarioId] = useState<string | null>(null);

  const sessionScenarioId =
    activePracticeScenarioId && isLearnPracticeId(activePracticeScenarioId)
      ? activePracticeScenarioId
      : localScenarioId && isLearnPracticeId(localScenarioId)
        ? localScenarioId
        : null;

  const startScenario = (id: string) => {
    if (!isLearnPracticeId(id)) return;
    clearPracticeScenario();
    setLocalScenarioId(id);
    setView('session');
  };

  useEffect(() => {
    if (!activePracticeScenarioId || !isLearnPracticeId(activePracticeScenarioId)) return;
    setLocalScenarioId(null);
    setView('session');
  }, [activePracticeScenarioId]);

  useEffect(() => {
    if (!voiceTutorLaunch?.open) return;
    setView('voice-tutor');
    clearVoiceTutorLaunch();
  }, [voiceTutorLaunch, clearVoiceTutorLaunch]);

  if (view === 'voice-tutor') {
    return <VoiceTutorSession lang={lang} onBack={() => setView('list')} />;
  }

  if (view === 'session' && sessionScenarioId) {
    return (
      <ScenarioPracticeSession
        lang={lang}
        scenarioId={sessionScenarioId}
        onBack={() => {
          clearPracticeScenario();
          setLocalScenarioId(null);
          setView('list');
        }}
      />
    );
  }

  return (
    <div className="dialago-screen dialago-screen--pad">
      <header className="dialago-screen__header">
        <h1 className="dialago-screen__title">{t(lang, 'app.practice.title')}</h1>
        <p className="dialago-screen__lead muted">{t(lang, 'app.practice.pick')}</p>
      </header>
      <button type="button" className="dialago-voice-tutor-card" onClick={launchVoiceTutor}>
        <span className="dialago-voice-tutor-card__badge">{t(lang, 'tutor.badge')}</span>
        <span className="dialago-voice-tutor-card__title">{t(lang, 'tutor.cardTitle')}</span>
        <span className="dialago-voice-tutor-card__desc muted">{t(lang, 'tutor.cardDesc')}</span>
        <span className="dialago-voice-tutor-card__arrow" aria-hidden="true">
          →
        </span>
      </button>

      <ul className="dialago-scenario-pick">
        {PRACTICE_SCENARIOS.map((s) => (
          <li key={s.id}>
            <button type="button" className="dialago-scenario-pick__btn" onClick={() => startScenario(s.id)}>
              <span className="dialago-scenario-pick__title">{t(lang, s.titleKey)}</span>
              <span className="dialago-scenario-pick__desc muted">{t(lang, s.descKey)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
