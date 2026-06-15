import React, { useState } from 'react';
import { t } from '../../i18n';
import { SelectableField } from './SelectableField';
import { FOCUSES, GOALS, LOCATIONS, NATIVE_LANGS, PROFESSIONS } from '../profileConstants';
import { isValidProfileAge } from '../profileUtils';
import { useApp } from '../AppContext';

export function EditProfileSection() {
  const { lang, profile, setProfile } = useApp();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(profile);

  const startEdit = () => {
    setDraft(profile);
    setOpen(true);
  };

  const save = () => {
    setProfile(draft);
    setOpen(false);
  };

  if (!open) {
    return (
      <button type="button" className="dialago-btn dialago-btn--ghost dialago-settings__edit" onClick={startEdit}>
        {t(lang, 'app.settings.editProfile')}
      </button>
    );
  }

  return (
    <section className="dialago-edit-profile">
      <h2 className="dialago-edit-profile__title">{t(lang, 'app.settings.editProfile')}</h2>
      <p className="dialago-edit-profile__lead muted">{t(lang, 'app.settings.editProfileLead')}</p>
      <div className="dialago-edit-profile__fields">
        <label className="dialago-age-field">
          <span className="dialago-age-field__label">{t(lang, 'profile.age.label')}</span>
          <input
            className="dialago-input dialago-age-field__input"
            type="number"
            inputMode="numeric"
            min={16}
            max={99}
            placeholder={t(lang, 'profile.age.placeholder')}
            value={draft.age ?? ''}
            onChange={(event) => {
              const raw = event.target.value;
              if (!raw) {
                setDraft((p) => ({ ...p, age: undefined }));
                return;
              }
              const next = Number.parseInt(raw, 10);
              setDraft((p) => ({ ...p, age: Number.isNaN(next) ? undefined : next }));
            }}
          />
        </label>
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldProfession')}
          options={PROFESSIONS}
          manualPlaceholderKey="profile.placeholderProfession"
          value={draft.profession}
          onChange={(v) => setDraft((p) => ({ ...p, profession: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldLocation')}
          options={LOCATIONS}
          manualPlaceholderKey="profile.placeholderLocation"
          value={draft.location}
          onChange={(v) => setDraft((p) => ({ ...p, location: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldNativeLanguage')}
          options={NATIVE_LANGS}
          manualPlaceholderKey="profile.placeholderNativeLanguage"
          value={draft.nativeLanguage}
          onChange={(v) => setDraft((p) => ({ ...p, nativeLanguage: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldFocus')}
          options={FOCUSES}
          manualPlaceholderKey="profile.placeholderFocus"
          value={draft.focus}
          onChange={(v) => setDraft((p) => ({ ...p, focus: v }))}
        />
        <SelectableField
          lang={lang}
          label={t(lang, 'profile.fieldGoal')}
          options={GOALS}
          manualPlaceholderKey="profile.placeholderGoal"
          value={draft.goal}
          onChange={(v) => setDraft((p) => ({ ...p, goal: v }))}
        />
      </div>
      <div className="dialago-edit-profile__actions">
        <button type="button" className="dialago-btn dialago-btn--ghost" onClick={() => setOpen(false)}>
          {t(lang, 'app.settings.cancelEdit')}
        </button>
        <button type="button" className="dialago-btn dialago-btn--primary" onClick={save} disabled={!isValidProfileAge(draft.age)}>
          {t(lang, 'app.settings.saveProfile')}
        </button>
      </div>
    </section>
  );
}
