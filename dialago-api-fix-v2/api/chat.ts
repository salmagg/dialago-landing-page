import type { ServerResponse } from 'node:http';
import { chatWithGroqTutor, type ChatMessage } from './_lib/groq';
import { type ApiRequest, readJsonBody, sendJson, sendNoContent, setCors } from './_lib/http';

type ChatBody = {
  messages?: ChatMessage[];
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
    const body = await readJsonBody<ChatBody>(req);
    const messages = body.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return sendJson(res, 400, { error: 'messages array is required' });
    }

    const sanitized: ChatMessage[] = messages
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
}
