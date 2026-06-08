import type { TutorTurn, VoiceSession } from './types';

const STORAGE_KEY = 'dialago-voice-sessions-v1';
const MAX_SESSIONS = 20;

function readAll(): VoiceSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VoiceSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(sessions: VoiceSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
  } catch {
    /* ignore */
  }
}

export function createVoiceSession(): VoiceSession {
  return {
    id: `vs-${Date.now()}`,
    turns: [],
    startedAt: Date.now(),
  };
}

export function appendTurn(session: VoiceSession, turn: TutorTurn): VoiceSession {
  return { ...session, turns: [...session.turns, turn] };
}

export function persistSession(session: VoiceSession) {
  const existing = readAll().filter((s) => s.id !== session.id);
  writeAll([session, ...existing]);
}

export function finalizeSession(session: VoiceSession): VoiceSession {
  const finalized = { ...session, endedAt: Date.now() };
  persistSession(finalized);
  return finalized;
}

export function readVoiceSessions(): VoiceSession[] {
  return readAll();
}

/** Future: extract vocabulary from session turns for flashcard generation */
export function listVocabularyCandidates(session: VoiceSession): string[] {
  return session.turns.flatMap((t) => t.vocabularyCandidates ?? []);
}
