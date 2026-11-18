// Practice sessions API, stored in Upstash Redis (connected through Vercel Storage).
//   GET    /api/sessions          -> list all sessions
//   POST   /api/sessions          -> add one session, or an array of sessions (import)
//   DELETE /api/sessions?id=...   -> delete one session
// Every request needs a signed-in user; each user has their own list.
import { redis, begin, readBody } from './_lib.js';

function clean(s) {
  if (!s || typeof s !== 'object') return null;
  const minutes = Number(s.minutes);
  if (typeof s.id !== 'string' || !s.id || s.id.length > 100) return null;
  if (typeof s.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s.date)) return null;
  if (s.type !== 'drums' && s.type !== 'vocals') return null;
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 1440) return null;
  return {
    id: s.id,
    date: s.date,
    type: s.type,
    minutes: Math.round(minutes),
    notes: typeof s.notes === 'string' ? s.notes.slice(0, 500) : '',
    created: Number.isFinite(Number(s.created)) ? Number(s.created) : Date.now(),
  };
}

export default async function handler(req, res) {
  const me = await begin(req, res, { needUser: true });
  if (!me) return;
  const KEY = 'sessions:' + me.id;

  try {
    if (req.method === 'GET') {
      const flat = (await redis('HGETALL', KEY)) || [];
      const sessions = [];
      for (let i = 1; i < flat.length; i += 2) {
        try { sessions.push(JSON.parse(flat[i])); } catch {}
      }
      return res.status(200).json({ sessions });
    }

    if (req.method === 'POST') {
      const body = readBody(req);
      const list = (Array.isArray(body) ? body : [body]).map(clean).filter(Boolean);
      if (!list.length) return res.status(400).json({ error: 'invalid-session' });
      if (list.length > 5000) return res.status(413).json({ error: 'too-many' });
      const args = list.flatMap(s => [s.id, JSON.stringify(s)]);
      await redis('HSET', KEY, ...args);
      return res.status(200).json({ saved: list.length });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (typeof id !== 'string' || !id) return res.status(400).json({ error: 'missing-id' });
      await redis('HDEL', KEY, id);
      return res.status(200).json({ deleted: id });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'method-not-allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
