// Personal settings, stored next to the sessions.
//   GET /api/settings  -> { settings }
//   PUT /api/settings  -> update { weeklyGoal?, instruments? } (other fields are kept)
//      weeklyGoal: minutes per week, instruments: ["drums", "guitar", ...]
import { redis, begin, readBody } from './_lib.js';
import { INSTRUMENT_IDS } from './_instruments.js';

export default async function handler(req, res) {
  const me = await begin(req, res, { needUser: true });
  if (!me) return;
  const KEY = 'settings:' + me.id;

  try {
    let settings = {};
    try { settings = JSON.parse(await redis('GET', KEY)) || {}; } catch {}

    if (req.method === 'GET') return res.status(200).json({ settings });

    if (req.method === 'PUT') {
      const body = readBody(req) || {};
      if (body.weeklyGoal !== undefined) {
        const goal = Number(body.weeklyGoal);
        if (!Number.isFinite(goal) || goal < 15 || goal > 10080) return res.status(400).json({ error: 'invalid-goal' });
        settings.weeklyGoal = Math.round(goal);
      }
      if (body.instruments !== undefined) {
        const list = Array.isArray(body.instruments) ? [...new Set(body.instruments)] : [];
        if (!list.length || list.length > INSTRUMENT_IDS.size || !list.every(id => INSTRUMENT_IDS.has(id))) {
          return res.status(400).json({ error: 'invalid-instruments' });
        }
        settings.instruments = list;
      }
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
