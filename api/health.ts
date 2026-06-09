import type { ServerResponse } from 'node:http';

export default function handler(_req: unknown, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      ok: true,
      groqKeyConfigured: Boolean(process.env.GROQ_API_KEY),
    }),
  );
}
