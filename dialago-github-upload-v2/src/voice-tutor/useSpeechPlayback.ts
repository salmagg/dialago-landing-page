import { useCallback, useEffect, useRef } from 'react';

export function useSpeechPlayback() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  const speak = useCallback(
    (text: string, lang = 'en-US'): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          resolve();
          return;
        }

        stop();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.95;
        utterance.onend = () => {
          utteranceRef.current = null;
          resolve();
        };
        utterance.onerror = () => {
          utteranceRef.current = null;
          reject(new Error('Speech playback failed'));
        };
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      });
    },
    [stop],
  );

  return { speak, stop };
}
