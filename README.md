# Muza

A practice tracker for drums and vocals (formerly "Practice Log").

A GitHub-style contribution graph for drums and vocals practice.

- Log a session (date, instrument, minutes, notes)
- Heatmap of the last year, filterable by All / Drums / Vocals
- Current and longest streak, minutes this week, total hours
- Export / import your data as JSON

Plain HTML/CSS/JS — no build step.

## Accounts and saving progress online

Visitors sign up with email + password and get their own practice log, weekly goal and a
profile page at `/u/<username>` (public by default, can be made private; notes are never shared).
Data lives in an Upstash Redis database connected through Vercel Storage (`api/`).
Without a database the site still works, saving on that device only.

Setup in the Vercel dashboard:
1. Project → **Storage** → **Create Database** → **Upstash for Redis** (free plan) → connect it to this project.
   This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically.
2. Project → **Settings → Environment Variables** → add `PRACTICE_PASSCODE` (the owner passcode, used once
   to claim the admin account). Optional, for "forgot password" emails: `RESEND_API_KEY` and `RESEND_FROM`.
3. **Deployments** → latest → **Redeploy**.
4. Sign up on the site and open **I'm the site owner** with the passcode: that account becomes the admin
   and receives the practice log saved before accounts existed.

Hosted on Vercel: every push to `main` redeploys automatically.

## Editing the theory lessons

Open `/admin` on the live site while logged in with the admin account.
Edit any lesson in English and Ukrainian with the visual editor, insert playable piano
examples or a metronome, add / reorder / delete lessons, then press **Save & publish**.
Edits are stored in the online database (`/api/lessons`); "Reset all to original" brings
back the built-in lessons from `lessons-1/2/3.js`.
