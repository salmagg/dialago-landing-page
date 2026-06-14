const { chatWithGroqTutor } = require('./_lib/groq');
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
    const messages = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return sendJson(res, 400, { error: 'messages array is required' });
    }

    const sanitized = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .filter((m) => m.content.length > 0);

    if (sanitized.length === 0) {
      return sendJson(res, 400, { error: 'No valid messages' });
    }

    const reply = await chatWithGroqTutor(sanitized);
    return sendJson(res, 200, { reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Chat error';
    console.error('[chat]', message);
    return sendJson(res, 500, { error: message });
  }
};
