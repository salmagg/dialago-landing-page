import React, { useCallback, useEffect, useRef, useState } from 'react';
import { t, type Lang } from '../../i18n';
import { DialogueAnalysisView } from './DialogueAnalysisView';
import { getPracticeContent, type LearnPracticeId } from '../practiceContent';

type Mode = 'choose' | 'guided' | 'analysis' | 'ai' | 'typed';
type AiMsg = { id: string; role: 'speaker' | 'user' | 'coach'; text: string };

type Props = {
  lang: Lang;
  scenarioId: LearnPracticeId;
  onBack: () => void;
};

function pickCoachKey(text: string): 'practice.coachGreat' | 'practice.coachEmpathy' | 'practice.coachDefault' {
  const lower = text.toLowerCase();
  if (lower.includes('ppe') || lower.includes('osha') || lower.includes('protocol') || lower.includes('safety')) {
    return 'practice.coachGreat';
  }
  if (lower.includes('worried') || lower.includes('scared') || lower.includes('understand') || lower.includes('comfort')) {
    return 'practice.coachEmpathy';
  }
  return 'practice.coachDefault';
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

export function ScenarioPracticeSession({ lang, scenarioId, onBack }: Props) {
  const content = getPracticeContent(scenarioId);
  const [mode, setMode] = useState<Mode>('choose');
  const [selected, setSelected] = useState<number | null>(null);
  const [analysisOptionIndex, setAnalysisOptionIndex] = useState<number | null>(null);
  const [analysisResponseText, setAnalysisResponseText] = useState('');
  const [aiMessages, setAiMessages] = useState<AiMsg[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiListening, setAiListening] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [typedReply, setTypedReply] = useState('');
  const aiListenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiCoachTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSession = useCallback(() => {
    setMode('choose');
    setSelected(null);
    setAnalysisOptionIndex(null);
    setAnalysisResponseText('');
    setAiMessages([]);
    setAiInput('');
    setTypedReply('');
    setAiListening(false);
    setAiThinking(false);
  }, []);

  useEffect(() => {
    resetSession();
  }, [scenarioId, resetSession]);

  useEffect(
    () => () => {
      if (aiListenTimer.current) clearTimeout(aiListenTimer.current);
      if (aiCoachTimer.current) clearTimeout(aiCoachTimer.current);
    },
    [],
  );

  if (!content) return null;

  const openAnalysis = (optionIndex: number, responseText: string) => {
    setSelected(optionIndex);
    setAnalysisOptionIndex(optionIndex);
    setAnalysisResponseText(responseText);
    setMode('analysis');
  };

  if (mode === 'analysis' && analysisOptionIndex !== null) {
    return (
      <DialogueAnalysisView
        lang={lang}
        scenarioId={scenarioId}
        optionIndex={analysisOptionIndex}
        responseText={analysisResponseText}
        feedbackKey={content.feedbackKey}
        onBack={() => setMode('guided')}
        onContinue={() => {
          resetSession();
          onBack();
        }}
      />
    );
  }

  const startAi = () => {
    setMode('ai');
    setAiMessages([{ id: 'p0', role: 'speaker', text: t(lang, content.aiOpeningKey) }]);
  };

  const sendAi = () => {
    const text = aiInput.trim();
    if (!text || aiThinking) return;
    setAiMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text }]);
    setAiInput('');
    setAiThinking(true);
    aiCoachTimer.current = setTimeout(() => {
      setAiMessages((m) => [...m, { id: `c-${Date.now()}`, role: 'coach', text: t(lang, pickCoachKey(text)) }]);
      setAiThinking(false);
    }, 900);
  };

  const onMic = () => {
    if (aiThinking || aiListening) return;
    setAiListening(true);
    aiListenTimer.current = setTimeout(() => {
      setAiInput(t(lang, content.aiSuggestedReplyKey));
      setAiListening(false);
    }, 1100);
  };

  return (
    <div className="dialago-screen dialago-practice-session">
      <header className="dialago-practice-session__head dialago-screen--pad-h">
        <button
          type="button"
          className="dialago-back"
          onClick={() => {
            resetSession();
            onBack();
          }}
        >
          ← {t(lang, 'app.practice.back')}
        </button>
        <h1 className="dialago-screen__title">{t(lang, content.titleKey)}</h1>
      </header>

      <div className="dialago-practice-session__body">
        {mode === 'choose' && (
          <>
            <div className="dialago-chat">
              <div className="dialago-bubble dialago-bubble--in">
                <p className="dialago-bubble__meta muted">{t(lang, content.speakerLabelKey)}</p>
                <p>{t(lang, content.openingKey)}</p>
              </div>
            </div>
            <p className="dialago-screen--pad-h dialago-practice-prompt">{t(lang, 'practice.chooseMode')}</p>
            <div className="dialago-mode-pick dialago-screen--pad-h">
              <button type="button" className="dialago-mode-btn" onClick={() => setMode('guided')}>
                {t(lang, 'practice.guidedPath')}
              </button>
              <button type="button" className="dialago-mode-btn dialago-mode-btn--ai" onClick={startAi}>
                {t(lang, 'practice.aiPath')}
              </button>
              <button type="button" className="dialago-mode-btn" onClick={() => setMode('typed')}>
                {t(lang, 'practice.typedPath')}
              </button>
            </div>
          </>
        )}

        {mode === 'guided' && (
          <>
            <div className="dialago-chat dialago-screen--pad-h">
              <div className="dialago-bubble dialago-bubble--in">
                <p className="dialago-bubble__meta muted">{t(lang, content.speakerLabelKey)}</p>
                <p>{t(lang, content.openingKey)}</p>
              </div>
            </div>
            <p className="dialago-screen--pad-h">{t(lang, content.questionKey)}</p>
            <div className="dialago-assess-options dialago-screen--pad-h">
              {content.optionKeys.map((key, i) => (
                <button
                  key={key}
                  type="button"
                  className={`dialago-assess-opt ${selected === i ? 'is-picked' : ''}`}
                  onClick={() => openAnalysis(i, t(lang, key))}
                >
                  {t(lang, key)}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === 'typed' && (
          <>
            <div className="dialago-chat dialago-screen--pad-h">
              <div className="dialago-bubble dialago-bubble--in">
                <p className="dialago-bubble__meta muted">{t(lang, content.speakerLabelKey)}</p>
                <p>{t(lang, content.openingKey)}</p>
              </div>
            </div>
            <div className="dialago-typed-bar dialago-screen--pad-h">
              <input
                type="text"
                className="dialago-input"
                value={typedReply}
                onChange={(e) => setTypedReply(e.target.value)}
                placeholder={t(lang, 'practice.inputPlaceholder')}
              />
              <button
                type="button"
                className="dialago-btn dialago-btn--primary"
                disabled={!typedReply.trim()}
                onClick={() => openAnalysis(0, typedReply.trim())}
              >
                {t(lang, 'practice.send')}
              </button>
            </div>
          </>
        )}

        {mode === 'ai' && (
          <>
            <div className="dialago-ai-thread">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`dialago-bubble ${msg.role === 'user' ? 'dialago-bubble--out' : 'dialago-bubble--in'}`}
                >
                  <p className="dialago-bubble__meta muted">
                    {msg.role === 'user'
                      ? t(lang, 'practice.bubbleYou')
                      : msg.role === 'coach'
                        ? t(lang, 'practice.bubbleCoach')
                        : t(lang, content.speakerLabelKey)}
                  </p>
                  <p>{msg.text}</p>
                </div>
              ))}
              {aiThinking ? <p className="muted dialago-ai-thinking">{t(lang, 'practice.aiThinking')}</p> : null}
            </div>
            <div className="dialago-ai-bar">
              <button
                type="button"
                className={`dialago-mic ${aiListening ? 'is-recording' : ''}`}
                onClick={onMic}
                disabled={aiThinking}
                aria-label={t(lang, 'a11y.practiceMic')}
              >
                <IconMic />
              </button>
              <input
                type="text"
                className="dialago-input"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), sendAi())}
                placeholder={aiListening ? t(lang, 'practice.aiListening') : t(lang, 'practice.inputPlaceholder')}
                disabled={aiThinking}
              />
              <button
                type="button"
                className="dialago-btn dialago-btn--primary"
                onClick={sendAi}
                disabled={!aiInput.trim() || aiThinking}
              >
                {t(lang, 'practice.send')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
