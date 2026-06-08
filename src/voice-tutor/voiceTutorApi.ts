import type { ApiChatMessage } from './types';

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data;
}

export async function transcribeAudio(blob: Blob): Promise<string> {
  const base64 = await blobToBase64(blob);
  const data = await postJson<{ text: string }>('/api/transcribe', {
    audio: base64,
    mimeType: blob.type || 'audio/webm',
  });
  return data.text.trim();
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
