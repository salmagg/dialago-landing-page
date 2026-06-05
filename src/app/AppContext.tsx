import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clearAllCardProgress } from '../flashcards/useCardProgress';
import { clearCustomDecks } from '../flashcards/mockScenarioGenerator';
import { getInitialLang, type Lang } from '../i18n';
import { DEFAULT_PROFILE } from './profileConstants';
import type { AppPhase, AppProfile, AppTab, PracticeLaunch } from './types';

type AppContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  phase: AppPhase;
  setPhase: (phase: AppPhase) => void;
  tab: AppTab;
  setTab: (tab: AppTab) => void;
  profile: AppProfile;
  setProfile: React.Dispatch<React.SetStateAction<AppProfile>>;
  savedPhraseIds: Record<string, boolean>;
  toggleSavedPhrase: (id: string) => void;
  practiceLaunch: PracticeLaunch | null;
  launchPractice: (launch: PracticeLaunch) => void;
  clearPracticeLaunch: () => void;
  completeSetup: () => void;
  resetApp: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'dialago-app-setup-v1';

function readSetupComplete(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);
  const [phase, setPhase] = useState<AppPhase>(() => (readSetupComplete() ? 'main' : 'welcome'));
  const [tab, setTab] = useState<AppTab>('home');
  const [profile, setProfile] = useState<AppProfile>(DEFAULT_PROFILE);
  const [savedPhraseIds, setSavedPhraseIds] = useState<Record<string, boolean>>({});
  const [practiceLaunch, setPracticeLaunch] = useState<PracticeLaunch | null>(null);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem('dialago-lang', next);
  }, []);

  const completeSetup = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    setPhase('main');
    setTab('home');
  }, []);

  const resetApp = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setProfile(DEFAULT_PROFILE);
    setSavedPhraseIds({});
    setPracticeLaunch(null);
    clearAllCardProgress();
    clearCustomDecks();
    setPhase('welcome');
    setTab('home');
  }, []);

  const toggleSavedPhrase = useCallback((id: string) => {
    setSavedPhraseIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const launchPractice = useCallback((launch: PracticeLaunch) => {
    setPracticeLaunch(launch);
  }, []);

  const clearPracticeLaunch = useCallback(() => {
    setPracticeLaunch(null);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      phase,
      setPhase,
      tab,
      setTab,
      profile,
      setProfile,
      savedPhraseIds,
      toggleSavedPhrase,
      practiceLaunch,
      launchPractice,
      clearPracticeLaunch,
      completeSetup,
      resetApp,
    }),
    [lang, setLang, phase, tab, profile, savedPhraseIds, toggleSavedPhrase, practiceLaunch, launchPractice, clearPracticeLaunch, completeSetup, resetApp],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
