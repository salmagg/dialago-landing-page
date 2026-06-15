import type { ApiChatMessage } from './types';

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let data: (T & { error?: string }) | null = null;
  try {
    data = raw ? (JSON.parse(raw) as T & { error?: string }) : null;
  } catch {
    const preview = raw.trim().slice(0, 120);
    throw new Error(
      preview || `Server returned non-JSON response (${res.status}). Check Vercel API logs.`,
    );
  }

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  if (!data) {
    throw new Error('Empty server response');
  }
  return data;
}

export type TranscribeResult = {
  text: string;
  name?: string;
  profession?: string;
  demo?: boolean;
};

export async function transcribeAudio(blob: Blob): Promise<TranscribeResult> {
  const base64 = await blobToBase64(blob);
  const data = await postJson<TranscribeResult>('/api/transcribe', {
    audio: base64,
    mimeType: blob.type || 'audio/webm',
    extractProfile: true,
  });
  return {
    text: data.text.trim(),
    name: data.name?.trim() ?? '',
    profession: data.profession?.trim() ?? '',
    demo: data.demo,
  };
}

export async function sendTutorChat(messages: ApiChatMessage[]): Promise<string> {
  const data = await postJson<{ reply: string }>('/api/chat', { messages });
  return data.reply.trim();
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Failed to read audio'));
        return;
      }
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read audio'));
    reader.readAsDataURL(blob);
  });
}
