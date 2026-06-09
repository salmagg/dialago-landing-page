import type { ServerResponse } from 'node:http';
import { sendJson } from './_lib/http';

export default function handler(_req: unknown, res: ServerResponse) {
  sendJson(res, 200, {
    ok: true,
    groqKeyConfigured: Boolean(process.env.GROQ_API_KEY),
  });
}
