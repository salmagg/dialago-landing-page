## DialaGO

DialaGO marketing site + interactive product demos + mobile app prototype (React, TypeScript, Vite).

### Local development

```bash
npm install
npm run dev
```

| Route | URL | Description |
|-------|-----|-------------|
| Landing | `/` | Marketing site, live demos, pricing |
| App prototype | `/app` | Mobile-style app with Learn / Practice / Flashcards |
| Speaking tutor | `/app` → Practice → **English speaking tutor** | Push-to-talk AI voice tutor |

### Voice tutor (MVP)

Flow: hold mic → Groq Whisper STT → Groq Llama tutor → browser TTS playback.

**Local dev:** copy `.env.example` to `.env` and set `GROQ_API_KEY`. Run `npm run dev` (Vite serves `/api/*` via local middleware).

**Vercel:** add `GROQ_API_KEY` in Project → Settings → Environment Variables, then redeploy.

### Deploy (Vercel)

1. Push this folder to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Use defaults: **Framework Preset = Vite**, **Build Command = `npm run build`**, **Output Directory = `dist`**.
4. `vercel.json` already includes SPA rewrites so `/app` works after deploy.

### Data storage

- **Built-in content** (copy, flashcard decks, scenarios, demo flows): TypeScript files under `src/`.
- **User progress** (review status, AI-generated decks, theme, language): browser `localStorage` only — not in the repo and not synced across devices unless you add a backend later.
