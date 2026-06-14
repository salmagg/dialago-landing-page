const { transcribeWithGroq } = require('./_lib/groq');
const { readJsonBody, sendJson, sendNoContent, setCors } = require('./_lib/http');

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res);
    return sendNoContent(res);
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = await readJsonBody(req);
    const audio = body.audio?.trim();
    const mimeType = body.mimeType || 'audio/webm';

    if (!audio) {
      return sendJson(res, 400, { error: 'Missing audio payload' });
    }

    const text = await transcribeWithGroq(audio, mimeType);
    const { useDemoMode } = require('./_lib/groq');
    return sendJson(res, 200, { text, demo: useDemoMode() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Transcription error';
    console.error('[transcribe]', message);
    return sendJson(res, 500, { error: message });
  }
};
