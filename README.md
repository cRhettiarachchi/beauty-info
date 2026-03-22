# beauty-info

Beauty Prospect Research App — B2B sales intelligence platform for the beauty industry.

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up Supabase
#    - Create a project at https://supabase.com
#    - Run supabase/migrations/001_initial_schema.sql in the SQL editor
#    - Copy the project URL and service role key from Settings > API

# 3. Configure environment
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and other API keys

# 4. Run the dev server
pnpm dev
# App runs at http://localhost:3000
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/companies` | GET | All companies with signals, contacts, revenue |
| `/api/companies/:id` | GET | Single company full profile |
| `/api/refresh` | GET | Trigger data refresh pipeline (cron-secured) |

## Architecture

- **Next.js App Router** — API routes and (future) frontend
- **Supabase** — PostgreSQL database via `@supabase/supabase-js`
- **Trigger.dev** — Long-running background pipeline jobs
- **Exa AI** — Semantic search for news signals and contacts
- **OpenAI GPT-4o** — Structured data extraction (see `AI_AGENT_PROMPT.md`)
- **Bright Data** — LinkedIn and protected page scraping
- **SEC EDGAR** — US company financial data (10-K filings)

## Data Pipeline

The refresh pipeline (`trigger/refresh-job.ts`) runs daily at 02:00 UTC via Vercel Cron:

1. Upsert seed companies into the database
2. Search for AI/marketing technology signals via Exa, extract with GPT-4o
3. Discover decision-maker contacts via Exa + LinkedIn scraping
4. Fetch revenue data from SEC EDGAR (US) or Exa + GPT-4o (non-US)
5. Validate all source URLs before writing to the database
