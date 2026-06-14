import { t, type Lang } from '../i18n';
import type { FieldValue } from './types';
import type { Option } from './profileConstants';
import { PROFESSIONS, SCENARIO_KEYS } from './profileConstants';
import { inferManualProfessionMeta, normalizeManualProfession } from './profileProfessionMap';

export { inferManualProfessionMeta, normalizeManualProfession } from './profileProfessionMap';

export function manualProfessionRoleLabel(lang: Lang, customText: string): string | null {
  const meta = inferManualProfessionMeta(customText);
  return meta ? t(lang, meta.roleKey) : null;
}

export function displayField(lang: Lang, options: Option[], value: FieldValue, keyPrefix: string): string {
  if (value.manual && value.customText.trim()) return value.customText.trim();
  const opt = options.find((o) => o.id === value.presetId);
  if (opt) return t(lang, opt.labelKey);
  return t(lang, `${keyPrefix}.${value.presetId}`);
}

export function formatLocation(lang: Lang, value: FieldValue): string {
  if (value.manual) return value.customText.trim() || t(lang, 'profile.locManualFallback');
  const city = t(lang, `profile.loc.${value.presetId}`);
  if (value.presetId === 'madrid') return `${city}, Spain`;
  return `${city}, USA`;
}

export function cityShort(lang: Lang, value: FieldValue): string {
  if (value.manual) return value.customText.trim() || t(lang, 'profile.locManualFallback');
  return t(lang, `profile.loc.${value.presetId}`);
}

export function scenarioCategory(profession: FieldValue): string {
  if (profession.manual) {
    return inferManualProfessionMeta(profession.customText)?.category ?? 'default';
  }
  return SCENARIO_KEYS[profession.presetId] ? profession.presetId : 'default';
}

export function professionDisplay(lang: Lang, profession: FieldValue): string {
  if (profession.manual) {
    const roleLabel = manualProfessionRoleLabel(lang, profession.customText);
    if (roleLabel) return roleLabel;
    return displayField(lang, PROFESSIONS, profession, 'profile.prof');
  }

  const label = displayField(lang, PROFESSIONS, profession, 'profile.prof');
  return `${label} ${t(lang, 'profile.professionalSuffix')}`;
}

export function isValidProfileAge(age: number | undefined): age is number {
  return typeof age === 'number' && Number.isInteger(age) && age >= 16 && age <= 99;
}
