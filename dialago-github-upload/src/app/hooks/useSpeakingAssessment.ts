import { useCallback, useState } from 'react';
import { usePushToTalk } from '../../voice-tutor/usePushToTalk';
import { transcribeAudio } from '../../voice-tutor/voiceTutorApi';
import { extractSpeakingIntro, type SpeakingIntroResult } from '../speakingIntroApi';

export type SpeakingAssessPhase = 'prompt' | 'recording' | 'transcribing' | 'analyzing' | 'done' | 'error';

type Options = {
  onExtracted: (result: SpeakingIntroResult, transcript: string) => void;
};

export function useSpeakingAssessment({ onExtracted }: Options) {
  const [phase, setPhase] = useState<SpeakingAssessPhase>('prompt');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const processRecording = useCallback(
    async (blob: Blob) => {
      setError(null);
      setIsDemo(false);
      setPhase('transcribing');

      try {
        const { text, demo } = await transcribeAudio(blob);
        if (!text) {
          throw new Error('No speech detected. Try again.');
        }

        setTranscript(text);
        setIsDemo(!!demo);
        setPhase('analyzing');
        const extracted = await extractSpeakingIntro(text);
        onExtracted(extracted, text);
        setPhase('done');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Something went wrong';
        setError(message);
        setPhase('error');
      }
    },
    [onExtracted],
  );

  const busy = phase === 'transcribing' || phase === 'analyzing';

  const { isRecording, micSupported, startRecording, stopRecording } = usePushToTalk({
    onRecordingComplete: processRecording,
    disabled: busy || phase === 'done',
  });

  const toggleRecording = useCallback(() => {
    if (busy) return;

    if (phase === 'recording' && isRecording) {
      stopRecording();
      return;
    }

    if (phase === 'prompt' || phase === 'error') {
      setError(null);
      setTranscript('');
      setPhase('recording');
      void startRecording();
    }
  }, [busy, isRecording, phase, startRecording, stopRecording]);

  const reset = useCallback(() => {
    setPhase('prompt');
    setTranscript('');
    setError(null);
    setIsDemo(false);
  }, []);

  return {
    phase,
    transcript,
    error,
    isDemo,
    isRecording,
    micSupported,
    toggleRecording,
    reset,
    busy,
  };
}
