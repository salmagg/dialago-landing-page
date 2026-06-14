import React, { useEffect, useRef } from 'react';
import { t, type Lang } from '../i18n';
import { useVoiceTutorSession } from './useVoiceTutorSession';

type Props = {
  lang: Lang;
  onBack: () => void;
};

function IconMic() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 14a3 3 0 003-3V7a3 3 0 10-6 0v4a3 3 0 003 3zM6 11v1a6 6 0 0012 0v-1M12 18v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function phaseLabel(lang: Lang, phase: string): string {
  switch (phase) {
    case 'recording':
      return t(lang, 'tutor.statusRecording');
    case 'transcribing':
      return t(lang, 'tutor.statusTranscribing');
    case 'thinking':
      return t(lang, 'tutor.statusThinking');
    case 'speaking':
      return t(lang, 'tutor.statusSpeaking');
    case 'error':
      return t(lang, 'tutor.statusError');
    default:
      return t(lang, 'tutor.statusIdle');
  }
}

export function VoiceTutorSession({ lang, onBack }: Props) {
  const { session, phase, error, isRecording, micSupported, onMicDown, onMicUp, resetSession } =
    useVoiceTutorSession();
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' });
  }, [session.turns.length, phase]);

  const busy = phase === 'transcribing' || phase === 'thinking' || phase === 'speaking';

  return (
    <div className="dialago-screen dialago-voice-tutor">
      <header className="dialago-voice-tutor__head dialago-screen--pad-h">
        <button type="button" className="dialago-back" onClick={onBack}>
          ← {t(lang, 'tutor.back')}
        </button>
        <h1 className="dialago-screen__title dialago-screen__title--sm">{t(lang, 'tutor.title')}</h1>
        <p className="dialago-screen__lead muted">{t(lang, 'tutor.lead')}</p>
      </header>

      <div ref={threadRef} className="dialago-ai-thread dialago-voice-tutor__thread">
        {session.turns.length === 0 ? (
          <p className="dialago-voice-tutor__empty muted">{t(lang, 'tutor.emptyHint')}</p>
        ) : (
          session.turns.map((turn) => (
            <div
              key={turn.id}
              className={`dialago-bubble ${turn.role === 'user' ? 'dialago-bubble--out' : 'dialago-bubble--in'}`}
            >
              <p className="dialago-bubble__meta muted">
                {turn.role === 'user' ? t(lang, 'tutor.labelYou') : t(lang, 'tutor.labelTutor')}
              </p>
              <p>{turn.text}</p>
            </div>
          ))
        )}
        {busy && phase !== 'speaking' ? (
          <p className="muted dialago-ai-thinking">{phaseLabel(lang, phase)}</p>
        ) : null}
        {error ? <p className="dialago-voice-tutor__error">{error}</p> : null}
      </div>

      <div className="dialago-voice-tutor__controls dialago-screen--pad-h">
        <p className={`dialago-voice-tutor__status ${isRecording ? 'is-active' : ''}`} aria-live="polite">
          {phaseLabel(lang, isRecording ? 'recording' : phase)}
        </p>

        {!micSupported ? (
          <p className="dialago-voice-tutor__error">{t(lang, 'tutor.micUnsupported')}</p>
        ) : (
          <button
            type="button"
            className={`dialago-voice-tutor__mic ${isRecording ? 'is-recording' : ''}`}
            disabled={busy && !isRecording}
            aria-label={t(lang, 'tutor.micA11y')}
            onPointerDown={(e) => {
              e.preventDefault();
              onMicDown();
            }}
            onPointerUp={onMicUp}
            onPointerLeave={onMicUp}
            onPointerCancel={onMicUp}
          >
            <IconMic />
            <span>{isRecording ? t(lang, 'tutor.release') : t(lang, 'tutor.hold')}</span>
          </button>
        )}

        <p className="dialago-voice-tutor__hint muted">{t(lang, 'tutor.hint')}</p>

        {session.turns.length > 0 ? (
          <button type="button" className="dialago-link-btn dialago-voice-tutor__reset" onClick={resetSession}>
            {t(lang, 'tutor.newSession')}
          </button>
        ) : null}
      </div>
    </div>
  );
}
