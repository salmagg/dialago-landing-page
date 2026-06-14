import type { Plugin } from 'vite';
import { loadEnv } from 'vite';
import { chatWithGroqTutor, extractIntroWithGroq, transcribeWithGroq, useDemoMode } from '../api/_lib/groq.js';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function applyLocalEnv(mode: string, root: string) {
  const env = loadEnv(mode, root, '');
  // Always prefer `.env` for Groq so stale shell exports or old server env don't win.
  const groqFromFile = env.GROQ_API_KEY?.trim();
  if (groqFromFile) {
    process.env.GROQ_API_KEY = groqFromFile;
  }
  for (const [key, value] of Object.entries(env)) {
    if (key === 'GROQ_API_KEY') continue;
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function readJsonBody(req: import('http').IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function localApiPlugin(): Plugin {
  return {
    name: 'dialago-local-api',
    configureServer(server) {
      applyLocalEnv(server.config.mode, server.config.root);
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next();
          return;
        }

        const path = req.url.split('?')[0];

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.end();
          return;
        }

        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const body = (await readJsonBody(req)) as Record<string, unknown>;

          if (path === '/api/transcribe') {
            const audio = typeof body.audio === 'string' ? body.audio : '';
            const mimeType = typeof body.mimeType === 'string' ? body.mimeType : 'audio/webm';
            if (!audio) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing audio payload' }));
              return;
            }
            const text = await transcribeWithGroq(audio, mimeType);
            const extractProfile = body.extractProfile !== false;
            const intro =
              extractProfile && text
                ? await extractIntroWithGroq(text)
                : { name: '', profession: '' };
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                text,
                name: intro.name,
                profession: intro.profession,
                demo: useDemoMode(),
              }),
            );
            return;
          }

          if (path === '/api/chat') {
            const messages = body.messages as ChatMessage[] | undefined;
            if (!Array.isArray(messages) || messages.length === 0) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'messages array is required' }));
              return;
            }
            const reply = await chatWithGroqTutor(messages);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply }));
            return;
          }

          if (path === '/api/extract-intro') {
            const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : '';
            if (!transcript) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'transcript is required' }));
              return;
            }
            const result = await extractIntroWithGroq(transcript);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ...result, demo: !process.env.GROQ_API_KEY }));
            return;
          }

          next();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Server error';
          console.error('[local-api]', path, message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}
