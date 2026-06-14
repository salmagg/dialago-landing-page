import { useCallback, useRef, useState } from 'react';
import { appendTurn, createVoiceSession, finalizeSession } from './sessionStore';
import type { ApiChatMessage, TutorTurn, VoiceSession, VoiceTutorPhase } from './types';
import { sendTutorChat, transcribeAudio } from './voiceTutorApi';
import { usePushToTalk } from './usePushToTalk';
import { useSpeechPlayback } from './useSpeechPlayback';

function toApiMessages(turns: TutorTurn[]): ApiChatMessage[] {
  return turns.map((t) => ({
    role: t.role === 'user' ? 'user' : 'assistant',
    content: t.text,
  }));
}

export function useVoiceTutorSession() {
  const [session, setSession] = useState<VoiceSession>(() => createVoiceSession());
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const [phase, setPhase] = useState<VoiceTutorPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const { speak, stop: stopSpeech } = useSpeechPlayback();

  const processRecording = useCallback(
    async (blob: Blob) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setError(null);

      try {
        setPhase('transcribing');
        const { text: transcript } = await transcribeAudio(blob);
        if (!transcript) {
          throw new Error('No speech detected. Try again.');
        }

        const userTurn: TutorTurn = {
          id: `u-${Date.now()}`,
          role: 'user',
          text: transcript,
          createdAt: Date.now(),
        };

        let nextSession = appendTurn(sessionRef.current, userTurn);
        setSession(nextSession);

        setPhase('thinking');
        const reply = await sendTutorChat(toApiMessages(nextSession.turns));

        const tutorTurn: TutorTurn = {
          id: `t-${Date.now()}`,
          role: 'tutor',
          text: reply,
          createdAt: Date.now(),
        };

        nextSession = appendTurn(nextSession, tutorTurn);
        setSession(nextSession);
        finalizeSession(nextSession);

        setPhase('speaking');
        await speak(reply);
        setPhase('idle');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        setPhase('error');
      } finally {
        busyRef.current = false;
      }
    },
    [speak],
  );

  const { isRecording, micSupported, startRecording, stopRecording } = usePushToTalk({
    onRecordingComplete: processRecording,
    disabled: phase === 'transcribing' || phase === 'thinking' || phase === 'speaking',
  });

  const onMicDown = useCallback(() => {
    if (phase === 'speaking') stopSpeech();
    setError(null);
    if (phase !== 'idle' && phase !== 'error') return;
    setPhase('recording');
    void startRecording();
  }, [phase, startRecording, stopSpeech]);

  const onMicUp = useCallback(() => {
    if (!isRecording) return;
    stopRecording();
  }, [isRecording, stopRecording]);

  const resetSession = useCallback(() => {
    stopSpeech();
    setSession(createVoiceSession());
    setPhase('idle');
    setError(null);
    busyRef.current = false;
  }, [stopSpeech]);

  return {
    session,
    phase,
    error,
    isRecording,
    micSupported,
    onMicDown,
    onMicUp,
    resetSession,
  };
}
