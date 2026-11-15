// Settings API (weekly goal), stored next to the sessions.
//   GET /api/settings  -> { settings }
//   PUT /api/settings  -> save { weeklyGoal } (minutes per week)
import { redis, guard, readBody } from './_lib.js';

const KEY = 'practice-log:settings';

export default async function handler(req, res) {
  if (!guard(req, res)) return;

  try {
    if (req.method === 'GET') {
      const raw = await redis('GET', KEY);
      let settings = {};
      try { settings = JSON.parse(raw) || {}; } catch {}
      return res.status(200).json({ settings });
    }

    if (req.method === 'PUT') {
      const body = readBody(req) || {};
      const goal = Number(body.weeklyGoal);
      if (!Number.isFinite(goal) || goal < 15 || goal > 10080) {
        return res.status(400).json({ error: 'invalid-goal' });
      }
      const settings = { weeklyGoal: Math.round(goal) };
      await redis('SET', KEY, JSON.stringify(settings));
      return res.status(200).json({ settings });
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method-not-allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
