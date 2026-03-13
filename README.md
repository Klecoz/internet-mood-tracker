# 🌐 Internet Mood Tracker

A daily web app that ingests headlines and social chatter, detects the dominant online mood, and presents a mood label plus a witty paragraph that explains the vibe in plain English.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** (hosted Postgres)
- **Claude AI** (`claude-sonnet-4-6`) for mood classification
- **Sources**: NewsAPI, Reddit, HackerNews

---

## Local Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, then run the following SQL in the **SQL Editor**:

```sql
create table mood_runs (
  id uuid primary key default gen_random_uuid(),
  generated_at timestamptz not null default now(),
  mood text not null,
  confidence float not null,
  rationale text,
  fun_paragraph text not null
);

create table mood_themes (
  id uuid primary key default gen_random_uuid(),
  mood_run_id uuid references mood_runs(id) on delete cascade,
  theme text not null,
  rank int not null
);

create table source_items (
  id uuid primary key default gen_random_uuid(),
  mood_run_id uuid references mood_runs(id) on delete cascade,
  source text not null,
  title text not null,
  url text,
  published_at timestamptz
);
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEWSAPI_KEY` | [newsapi.org](https://newsapi.org) (free tier, optional) |
| `ANALYZE_SECRET` | Any random string you choose |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` for local dev |

> **Note:** NewsAPI and the ANALYZE_SECRET are optional. Without a NewsAPI key the app falls back to mock headlines. Without ANALYZE_SECRET the endpoint is unprotected (fine for local dev).

### 3. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Triggering an Analysis

The mood is **not** computed automatically — you trigger it manually:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "x-secret: YOUR_ANALYZE_SECRET"
```

This will:
1. Fetch the latest stories from NewsAPI, Reddit, and HackerNews
2. Send them to Claude for mood classification
3. Persist the result to Supabase
4. Refresh the page to show the new mood

---

## Mood Taxonomy

| Mood | When to use it |
|---|---|
| Mildly Chaotic 🌀 | Mixed conversation, lots of minor outrage, no single huge event |
| Collectively Doomed 😮‍💨 | Heavy negative sentiment dominates |
| Suspiciously Hopeful 🌱 | Positive energy with mild skepticism |
| Chronically Online 📱 | The internet is fighting about something absurd |
| Victory Lap 🏆 | A clear cultural or sports celebration moment |
| Deeply Tired 😴 | Low energy, exhaustion, nothing particularly exciting |
| Cautiously Optimistic 🤞 | Things are looking up but nobody wants to jinx it |
| Chaotically Vibing ✨ | Chaotic but in a fun, unserious way |

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/mood` | GET | Returns the latest mood run with themes and sources |
| `/api/history` | GET | Returns the last 14 mood runs (for the history strip) |
| `/api/analyze` | POST | Triggers a new analysis (requires `x-secret` header) |

---

## Data Sources

- **NewsAPI** — top English headlines (requires free API key, falls back to mock)
- **Reddit** — hot posts from r/worldnews, r/technology, r/entertainment, r/television, r/gaming (no key needed)
- **HackerNews** — front page via Algolia API (no key needed)
