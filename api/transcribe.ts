import type { ServerResponse } from 'node:http';
import { transcribeWithGroq } from './_lib/groq';
import { type ApiRequest, readJsonBody, sendJson, sendNoContent, setCors } from './_lib/http';

type TranscribeBody = {
  audio?: string;
  mimeType?: string;
};

export const config = {
  maxDuration: 30,
};

export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    return sendNoContent(res);
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody<TranscribeBody>(req);
    const audio = body.audio?.trim();
    const mimeType = body.mimeType || 'audio/webm';

    if (!audio) {
      return sendJson(res, 400, { error: 'Missing audio payload' });
    }

    const text = await transcribeWithGroq(audio, mimeType);
    return sendJson(res, 200, { text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transcription error';
    console.error('[transcribe]', message);
    return sendJson(res, 500, { error: message });
  }
}
