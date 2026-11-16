# Muza

A practice tracker for drums and vocals (formerly "Practice Log").

A GitHub-style contribution graph for drums and vocals practice.

- Log a session (date, instrument, minutes, notes)
- Heatmap of the last year, filterable by All / Drums / Vocals
- Current and longest streak, minutes this week, total hours
- Export / import your data as JSON

Plain HTML/CSS/JS — no build step.

## Saving progress online

Sessions are stored in an Upstash Redis database through `api/sessions.js`, a Vercel function, behind a passcode.
Each browser keeps a copy too, and if no database is set up the site works on that device only.

Setup in the Vercel dashboard:
1. Project → **Storage** → **Create Database** → **Upstash for Redis** (free plan) → connect it to this project.
   This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
2. Project → **Settings → Environment Variables** → add `PRACTICE_PASSCODE` (your passcode).
3. **Deployments** → latest → **Redeploy**.

Hosted on Vercel: every push to `main` redeploys automatically.
