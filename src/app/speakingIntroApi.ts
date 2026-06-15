export type SpeakingIntroResult = {
  name: string;
  profession: string;
};

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
    throw new Error(preview || `Server returned non-JSON response (${res.status}).`);
  }

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  if (!data) {
    throw new Error('Empty server response');
  }
  return data;
}

export async function extractSpeakingIntro(transcript: string): Promise<SpeakingIntroResult> {
  const data = await postJson<SpeakingIntroResult>('/api/extract-intro', { transcript });
  return {
    name: data.name?.trim() ?? '',
    profession: data.profession?.trim() ?? '',
  };
}
