const { TUTOR_SYSTEM_PROMPT } = require('./tutorPrompt');

const GROQ_BASE = 'https://api.groq.com/openai/v1';

function requireGroqKey() {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY is not configured on the server.');
  }
  return key;
}

async function transcribeWithGroq(audioBase64, mimeType) {
  const key = requireGroqKey();
  const buffer = Buffer.from(audioBase64, 'base64');
  const ext = mimeType.includes('mp4') ? 'm4a' : mimeType.includes('ogg') ? 'ogg' : 'webm';

  const form = new FormData();
  const bytes = Uint8Array.from(buffer);
  const file = new File([bytes], `audio.${ext}`, { type: mimeType });
  form.append('file', file);
  form.append('model', 'whisper-large-v3-turbo');
  form.append('response_format', 'json');
  form.append('language', 'en');

  const res = await fetch(`${GROQ_BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Transcription failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  return (data.text ?? '').trim();
}

async function chatWithGroqTutor(messages) {
  const key = requireGroqKey();

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: TUTOR_SYSTEM_PROMPT }, ...messages],
      max_tokens: 220,
      temperature: 0.65,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Chat failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? '').trim();
}

module.exports = { transcribeWithGroq, chatWithGroqTutor };
