export type TutorTurnRole = 'user' | 'tutor';

export type TutorTurn = {
  id: string;
  role: TutorTurnRole;
  text: string;
  createdAt: number;
  /** Reserved for future vocabulary extraction pipeline */
  vocabularyCandidates?: string[];
};

export type VoiceSession = {
  id: string;
  turns: TutorTurn[];
  startedAt: number;
  endedAt?: number;
};

export type VoiceTutorPhase = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking' | 'error';

export type ApiChatMessage = { role: 'user' | 'assistant'; content: string };
