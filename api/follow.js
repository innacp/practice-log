// Following other musicians. Two people who follow each other are friends.
//   GET    /api/follow                 -> { following: [card], followers: [card] }
//   POST   /api/follow { username }    -> follow someone (their profile must be public)
//   DELETE /api/follow { username }    -> unfollow
// Stored as hashes: following:<id> and followers:<id>, field = other user's id, value = time.
// A card has name, username, photo version, whether you follow each other, and the
// minutes practised per day over the last 5 weeks (only for public profiles; never notes).
import { redis, pairs, readBody, begin, loadUser, loadSessions, limited } from './_lib.js';

const DAYS = 35;

async function idFor(username) {
  const u = String(username || '').trim().toLowerCase().replace(/^@/, '');
  return /^[a-z0-9-]{2,24}$/.test(u) ? redis('GET', 'uname:' + u) : null;
}

async function card(id, mine, theirs) {
  const [u, sessions] = await Promise.all([loadUser(id), loadSessions(id)]);
  if (!u) return null;
  const visible = u.public !== '0';
  const c = {
    name: u.name, username: u.username, avatar: Number(u.avatar) || 0, public: visible,
    youFollow: id in mine, followsYou: id in theirs, days: {},
  };
  if (visible) {
    const since = new Date(Date.now() - (DAYS + 1) * 86400000).toISOString().slice(0, 10);
    for (const s of sessions) {
      if (s && s.date >= since) c.days[s.date] = (c.days[s.date] || 0) + (Number(s.minutes) || 0);
    }
  }
  return c;
}

export default async function handler(req, res) {
  const me = await begin(req, res, { needUser: true });
  if (!me) return;

  try {
    if (req.method === 'GET') {
      const [mine, theirs] = (await Promise.all([
        redis('HGETALL', 'following:' + me.id), redis('HGETALL', 'followers:' + me.id),
      ])).map(pairs);
      // One card per person, even when they are in both lists
      const ids = [...new Set([...Object.keys(mine), ...Object.keys(theirs)])];
      const cards = new Map(await Promise.all(ids.map(async id => [id, await card(id, mine, theirs)])));
      const byTime = o => Object.keys(o).sort((a, b) => Number(o[b]) - Number(o[a]));
      const list = o => byTime(o).map(id => cards.get(id)).filter(Boolean);
      return res.status(200).json({ following: list(mine), followers: list(theirs) });
    }

    if (req.method === 'POST' || req.method === 'DELETE') {
      const { username } = readBody(req) || {};
      const id = await idFor(username);
      const other = id && await loadUser(id);
      if (!other) return res.status(404).json({ error: 'not-found' });
      if (other.id === me.id) return res.status(400).json({ error: 'self' });

      const follow = req.method === 'POST';
      if (follow) {
        if (other.public === '0') return res.status(403).json({ error: 'private' });
        if (await limited('follow:' + me.id, 60, 3600)) return res.status(429).json({ error: 'too-many' });
      }
      const now = String(Date.now());
      const [followsYou] = await Promise.all([
        redis('HEXISTS', 'followers:' + me.id, other.id),
        follow ? redis('HSET', 'following:' + me.id, other.id, now) : redis('HDEL', 'following:' + me.id, other.id),
        follow ? redis('HSET', 'followers:' + other.id, me.id, now) : redis('HDEL', 'followers:' + other.id, me.id),
      ]);
      return res.status(200).json({ youFollow: follow, followsYou: !!followsYou });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'method-not-allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
