import { DEFAULT_PROFILE } from './profileConstants';
import type { AppProfile } from './types';

const PROFILE_STORAGE_KEY = 'dialago-profile-v1';

export function readStoredProfile(): AppProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as AppProfile;
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      profession: { ...DEFAULT_PROFILE.profession, ...parsed.profession },
      location: { ...DEFAULT_PROFILE.location, ...parsed.location },
      nativeLanguage: { ...DEFAULT_PROFILE.nativeLanguage, ...parsed.nativeLanguage },
      focus: { ...DEFAULT_PROFILE.focus, ...parsed.focus },
      goal: { ...DEFAULT_PROFILE.goal, ...parsed.goal },
      age: typeof parsed.age === 'number' ? parsed.age : undefined,
      firstName: typeof parsed.firstName === 'string' ? parsed.firstName : undefined,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function writeStoredProfile(profile: AppProfile): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* ignore */
  }
}

export function clearStoredProfile(): void {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
