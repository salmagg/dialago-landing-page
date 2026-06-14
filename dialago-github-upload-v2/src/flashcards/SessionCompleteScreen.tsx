import React from 'react';
import { t, type Lang } from '../i18n';

type Props = {
  lang: Lang;
  masteredCount: number;
  learningCount: number;
  onReviewDifficult: () => void;
  onStartPractice: () => void;
  onBackToDecks: () => void;
};

export function SessionCompleteScreen({
  lang,
  masteredCount,
  learningCount,
  onReviewDifficult,
  onStartPractice,
  onBackToDecks,
}: Props) {
  return (
    <div className="flash-session-complete">
      <div className="flash-session-complete__icon" aria-hidden="true">
        ✓
      </div>
      <h2 className="flash-session-complete__title">{t(lang, 'flash.sessionComplete.title')}</h2>
      <dl className="flash-session-complete__stats">
        <div>
          <dt>{t(lang, 'flash.sessionComplete.masteredLabel')}</dt>
          <dd>{masteredCount}</dd>
        </div>
        <div>
          <dt>{t(lang, 'flash.sessionComplete.needsReviewLabel')}</dt>
          <dd>{learningCount}</dd>
        </div>
      </dl>
      <div className="flash-session-complete__actions">
        {learningCount > 0 ? (
          <button type="button" className="dialago-btn dialago-btn--primary" onClick={onReviewDifficult}>
            {t(lang, 'flash.sessionComplete.reviewDifficult')}
          </button>
        ) : null}
        <button type="button" className="dialago-btn dialago-btn--ghost" onClick={onStartPractice}>
          {t(lang, 'flash.sessionComplete.startPractice')}
        </button>
        <button type="button" className="dialago-link-btn flash-session-complete__back" onClick={onBackToDecks}>
          ← {t(lang, 'flash.backDecks')}
        </button>
      </div>
    </div>
  );
}
