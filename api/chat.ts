import type { VercelRequest, VercelResponse } from '@vercel/node';
import { chatWithGroqTutor, type ChatMessage } from './_lib/groq';

type ChatBody = {
  messages?: ChatMessage[];
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  maxDuration: 30,
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
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as ChatBody;
    const messages = body?.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const sanitized: ChatMessage[] = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.trim() }))
      .filter((m) => m.content.length > 0);

    if (sanitized.length === 0) {
      return res.status(400).json({ error: 'No valid messages' });
    }

    const reply = await chatWithGroqTutor(sanitized);
    return res.status(200).json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Chat error';
    console.error('[chat]', message);
    return res.status(500).json({ error: message });
  }
}
