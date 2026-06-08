import type { VercelRequest, VercelResponse } from './_lib/vercelTypes';
import { transcribeWithGroq } from './_lib/groq';

type TranscribeBody = {
  audio?: string;
  mimeType?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as TranscribeBody;
    const audio = body.audio?.trim();
    const mimeType = body.mimeType || 'audio/webm';

    if (!audio) {
      return res.status(400).json({ error: 'Missing audio payload' });
    }

    const text = await transcribeWithGroq(audio, mimeType);
    return res.status(200).json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transcription error';
    console.error('[transcribe]', message);
    return res.status(500).json({ error: message });
  }
}
