import React, { useCallback, useMemo, useState } from 'react';
import { t } from '../../i18n';
import {
  GenerateScenarioCards,
  generateDecksForProfile,
  getDeckDesc,
  getDeckProfessionLabel,
  getDeckScenarioLabel,
  getDeckTitle,
  getPracticeScenarioForDeck,
  readCustomDecks,
  SessionCompleteScreen,
  SwipeFlashcardTrainer,
  useCardProgress,
  useSwipeSession,
} from '../../flashcards';
import { displayField, professionDisplay } from '../profileUtils';
import { PROFESSIONS } from '../profileConstants';
import { ScenarioPracticeSession } from '../components/ScenarioPracticeSession';
import {
  practiceIdFromDeckIndex,
  practiceIdFromDeckSlug,
  type LearnPracticeId,
} from '../practiceContent';
import { useApp } from '../AppContext';
import type { FlashcardDeck, SwipeOutcome } from '../../flashcards/types';

type LearnView = 'decks' | 'session';

export function PhraseScreen() {
  const { lang, profile, savedPhraseIds, toggleSavedPhrase } = useApp();
  const [view, setView] = useState<LearnView>('decks');
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [practiceScenarioId, setPracticeScenarioId] = useState<LearnPracticeId | null>(null);
  const [customDecks, setCustomDecks] = useState<FlashcardDeck[]>(() => readCustomDecks());

  const profileDecks = useMemo(() => generateDecksForProfile(profile), [profile]);

  const activeDeck = useMemo(() => {
    return (
      profileDecks.find((deck) => deck.id === activeDeckId) ??
      customDecks.find((deck) => deck.id === activeDeckId) ??
      null
    );
  }, [profileDecks, customDecks, activeDeckId]);

  const professionLabel = useMemo(() => {
    if (!activeDeck) return '';
    return getDeckProfessionLabel(lang, activeDeck);
  }, [lang, activeDeck]);

  const { getProgress, recordSwipe } = useCardProgress();

  const handleSwipe = useCallback(
    (cardId: string, outcome: SwipeOutcome) => {
      recordSwipe(cardId, outcome);
    },
    [recordSwipe],
  );

  const session = useSwipeSession({
    cards: activeDeck?.cards ?? [],
    deckId: activeDeckId ?? undefined,
    onSwipe: handleSwipe,
  });

  const scenarioLabel = activeDeck ? getDeckScenarioLabel(lang, activeDeck) : '';

  const startDeck = (deckId: string) => {
    setPracticeScenarioId(null);
    setActiveDeckId(deckId);
    setView('session');
  };

  const backToDecks = () => {
    setPracticeScenarioId(null);
    setView('decks');
    setActiveDeckId(null);
  };

  const resolveDeckPracticeId = useCallback(
    (deck: FlashcardDeck): LearnPracticeId => {
      const deckIndex = profileDecks.findIndex((item) => item.id === deck.id);
      if (deckIndex >= 0) return practiceIdFromDeckIndex(deckIndex);
      return practiceIdFromDeckSlug(deck.id.split('-').pop()) ?? getPracticeScenarioForDeck(deck, 0);
    },
    [profileDecks],
  );

  const goToScenarioPractice = useCallback(() => {
    if (!activeDeck) return;
    setPracticeScenarioId(resolveDeckPracticeId(activeDeck));
  }, [activeDeck, resolveDeckPracticeId]);

  const handleDeckReady = useCallback((deck: FlashcardDeck) => {
    setCustomDecks(readCustomDecks());
    setActiveDeckId(deck.id);
  }, []);

  if (view === 'decks') {
    const profileProfessionLabel = profile.profession.manual
      ? professionDisplay(lang, profile.profession)
      : displayField(lang, PROFESSIONS, profile.profession, 'profile.prof');

    return (
      <div className="dialago-screen dialago-screen--scroll dialago-screen--pad dialago-learn">
        <header className="dialago-screen__header">
          <p className="dialago-eyebrow">{t(lang, 'flash.eyebrow')}</p>
          <h1 className="dialago-screen__title">{t(lang, 'flash.decksTitle')}</h1>
          <p className="dialago-screen__lead muted">{t(lang, 'flash.decksLead')}</p>
        </header>

        <GenerateScenarioCards
          lang={lang}
          profile={profile}
          onDeckReady={handleDeckReady}
          onStudyDeck={(deck) => startDeck(deck.id)}
        />

        {customDecks.length > 0 ? (
          <p className="flash-decks-section-label">{t(lang, 'flash.gen.yourGeneratedDecks')}</p>
        ) : null}

        <ul className="flash-deck-list">
          {profileDecks.map((deck, index) => {
            const prof = getDeckProfessionLabel(lang, deck);
            const scenario = getDeckScenarioLabel(lang, deck);
            const title = getDeckTitle(lang, deck);
            const desc = getDeckDesc(lang, deck);
            const isRecommended = index === 0;
            return (
              <li key={deck.id}>
                <button type="button" className="flash-deck-card" onClick={() => startDeck(deck.id)}>
                  <span className={`flash-deck-card__badge ${isRecommended ? 'flash-deck-card__badge--recommended' : ''}`}>
                    {isRecommended ? '★' : index + 1}
                  </span>
                  <span className="flash-deck-card__body">
                    <span className="flash-scenario-badge flash-scenario-badge--sm">
                      <span className="flash-scenario-badge__profession">{prof}</span>
                      <span className="flash-scenario-badge__sep" aria-hidden="true">
                        ›
                      </span>
                      <span className="flash-scenario-badge__scenario">{scenario}</span>
                    </span>
                    <span className="flash-deck-card__title">
                      {title}
                      {isRecommended ? (
                        <span className="flash-deck-card__recTag">{t(lang, 'flash.decks.recommended')}</span>
                      ) : null}
                    </span>
                    <span className="flash-deck-card__desc muted">{desc}</span>
                  </span>
                  <span className="flash-deck-card__arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            );
          })}
          {customDecks.map((deck) => {
            const prof = getDeckProfessionLabel(lang, deck);
            const scenario = getDeckScenarioLabel(lang, deck);
            const title = getDeckTitle(lang, deck);
            const desc = getDeckDesc(lang, deck);
            return (
              <li key={deck.id}>
                <button type="button" className="flash-deck-card" onClick={() => startDeck(deck.id)}>
                  <span className="flash-deck-card__badge flash-deck-card__badge--ai">AI</span>
                  <span className="flash-deck-card__body">
                    <span className="flash-scenario-badge flash-scenario-badge--sm">
                      <span className="flash-scenario-badge__profession">{prof}</span>
                      <span className="flash-scenario-badge__sep" aria-hidden="true">
                        ›
                      </span>
                      <span className="flash-scenario-badge__scenario">{scenario}</span>
                    </span>
                    <span className="flash-deck-card__title">
                      {title}
                      <span className="flash-deck-card__aiTag">{t(lang, 'flash.gen.aiTag')}</span>
                    </span>
                    <span className="flash-deck-card__desc muted">{desc}</span>
                  </span>
                  <span className="flash-deck-card__arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="flash-decks-foot muted">{t(lang, 'flash.decksPersonalizedLead', { profession: profileProfessionLabel })}</p>
      </div>
    );
  }

  if (!activeDeck) {
    return null;
  }

  if (practiceScenarioId) {
    return (
      <ScenarioPracticeSession
        lang={lang}
        scenarioId={practiceScenarioId}
        onBack={() => setPracticeScenarioId(null)}
      />
    );
  }

  return (
    <div className="dialago-screen dialago-screen--pad dialago-learn dialago-learn--session">
      <header className="dialago-learn__head">
        <button type="button" className="dialago-link-btn" onClick={backToDecks}>
          ← {t(lang, 'flash.backDecks')}
        </button>
        <h1 className="dialago-screen__title dialago-screen__title--sm">{getDeckTitle(lang, activeDeck)}</h1>
        <p className="dialago-screen__lead muted">{getDeckDesc(lang, activeDeck)}</p>
      </header>

      {session.isComplete ? (
        <SessionCompleteScreen
          lang={lang}
          masteredCount={session.sessionProgress.mastered}
          learningCount={session.learningCount}
          onReviewDifficult={session.restartDifficult}
          onStartPractice={goToScenarioPractice}
          onBackToDecks={backToDecks}
        />
      ) : session.card ? (
        <SwipeFlashcardTrainer
          lang={lang}
          card={session.card}
          flipped={session.flipped}
          onReveal={() => session.setFlipped(true)}
          onFlipBack={() => session.setFlipped(false)}
          onSwipeCommit={session.commitSwipe}
          onStartPractice={goToScenarioPractice}
          professionLabel={professionLabel}
          scenarioLabel={scenarioLabel}
          progress={getProgress(session.card.id)}
          saved={!!savedPhraseIds[session.card.id]}
          onSave={() => toggleSavedPhrase(session.card!.id)}
          sessionProgress={session.sessionProgress}
        />
      ) : null}
    </div>
  );
}
