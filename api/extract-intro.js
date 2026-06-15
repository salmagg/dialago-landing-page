const { extractIntroWithGroq } = require('./_lib/groq');
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
    const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : '';

    if (!transcript) {
      return sendJson(res, 400, { error: 'transcript is required' });
    }

    const result = await extractIntroWithGroq(transcript);
    const { useDemoMode } = require('./_lib/groq');
    return sendJson(res, 200, { ...result, demo: useDemoMode() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Extraction error';
    console.error('[extract-intro]', message);
    return sendJson(res, 500, { error: message });
  }
};
