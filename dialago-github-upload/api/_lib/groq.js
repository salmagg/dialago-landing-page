const { TUTOR_SYSTEM_PROMPT } = require('./tutorPrompt');

const GROQ_BASE = 'https://api.groq.com/openai/v1';

let demoModeLogged = false;

function groqKey() {
  const raw = process.env.GROQ_API_KEY?.trim() || '';
  return raw.replace(/^['"]|['"]$/g, '');
}

function useDemoMode() {
  if (!groqKey()) {
    if (!demoModeLogged) {
      demoModeLogged = true;
      console.warn('[groq] GROQ_API_KEY not set — using demo speech/extract responses. Add key to .env for real STT.');
    }
    return true;
  }
  return false;
}

function mockExtractIntro(transcript) {
  const text = String(transcript ?? '').trim();
  let name = '';

  const namePatterns = [
    /\b(?:I'm|I am|my name is|this is|call me)\s+([A-Za-z][A-Za-z'-]{1,30})\b/i,
    /\b(?:me llamo|soy)\s+([A-Za-záéíóúñÁÉÍÓÚÑ][A-Za-záéíóúñÁÉÍÓÚÑ'-]{1,30})\b/i,
  ];
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      name = match[1];
      break;
    }
  }

  let profession = '';
  const professionPatterns = [
    /\b(?:work in|working in)\s+([a-z][a-z\s/-]{1,40})/i,
    /\b(?:I'm an?|I am an?)\s+([a-z][a-z\s/-]{1,40}?)(?:[.,]|$|\s+and\b|\s+from\b)/i,
  ];
  for (const pattern of professionPatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      profession = match[1].trim();
      break;
    }
  }

  return { name, profession };
}

function requireGroqKey() {
  const key = groqKey();
  if (!key) {
    throw new Error('GROQ_API_KEY is not configured on the server.');
  }
  return key;
}

async function transcribeWithGroq(audioBase64, mimeType) {
  if (useDemoMode()) {
    return "Hi, I'm Maria. I work in agriculture.";
  }

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
  if (useDemoMode()) {
    return "Thanks for sharing! Keep practicing — you're doing well.";
  }

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

const INTRO_EXTRACT_PROMPT = `You extract structured data from spoken self-introductions in English or Spanish.
Reply ONLY with minified JSON: {"name":"","profession":""}
- name: given/first name only, title case (e.g. Maria)
- profession: job or industry in simple English (e.g. agriculture, nurse, teacher, restaurant server, construction worker, accountant)
Use empty string if not mentioned. No markdown or extra text.`;

function parseIntroJson(raw) {
  const trimmed = String(raw ?? '').trim();
  const jsonSlice = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonSlice) return { name: '', profession: '' };
  try {
    const parsed = JSON.parse(jsonSlice[0]);
    return {
      name: typeof parsed.name === 'string' ? parsed.name.trim() : '',
      profession: typeof parsed.profession === 'string' ? parsed.profession.trim() : '',
    };
  } catch {
    return { name: '', profession: '' };
  }
}

async function extractIntroWithGroq(transcript) {
  const text = String(transcript ?? '').trim();
  if (!text) {
    return { name: '', profession: '' };
  }

  if (useDemoMode()) {
    return mockExtractIntro(text);
  }

  const key = requireGroqKey();

  const res = await fetch(`${GROQ_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: INTRO_EXTRACT_PROMPT },
        { role: 'user', content: text },
      ],
      max_tokens: 80,
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Intro extraction failed (${res.status}): ${detail}`);
  }

  const data = await res.json();
  return parseIntroJson(data.choices?.[0]?.message?.content);
}

module.exports = { transcribeWithGroq, chatWithGroqTutor, extractIntroWithGroq, useDemoMode: () => useDemoMode() };
