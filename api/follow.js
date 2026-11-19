// Following other musicians. Two people who follow each other are friends.
//   GET    /api/follow                 -> { following: [card], followers: [card] }
//   POST   /api/follow { username }    -> follow someone (their profile must be public)
//   DELETE /api/follow { username }    -> unfollow
// Stored as hashes: following:<id> and followers:<id>, field = other user's id, value = time.
// A card has name, username, photo version, whether you follow each other, and the
// minutes practised per day over the last 5 weeks (only for public profiles; never notes).
import { redis, pairs, readBody, begin, loadUser, limited } from './_lib.js';

const DAYS = 35;

async function idFor(username) {
  const u = String(username || '').trim().toLowerCase().replace(/^@/, '');
  return /^[a-z0-9-]{2,24}$/.test(u) ? redis('GET', 'uname:' + u) : null;
}

async function card(id, mine, theirs) {
  const u = await loadUser(id);
  if (!u) return null;
  const visible = u.public !== '0';
  const c = {
    name: u.name, username: u.username, avatar: Number(u.avatar) || 0, public: visible,
    youFollow: id in mine, followsYou: id in theirs, days: {},
  };
  if (visible) {
    const since = new Date(Date.now() - (DAYS + 1) * 86400000).toISOString().slice(0, 10);
    const flat = (await redis('HGETALL', 'sessions:' + id)) || [];
    for (let i = 1; i < flat.length; i += 2) {
      let s; try { s = JSON.parse(flat[i]); } catch { continue; }
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
      const mine = pairs(await redis('HGETALL', 'following:' + me.id));
      const theirs = pairs(await redis('HGETALL', 'followers:' + me.id));
      const byTime = o => Object.keys(o).sort((a, b) => Number(o[b]) - Number(o[a]));
      const following = (await Promise.all(byTime(mine).map(id => card(id, mine, theirs)))).filter(Boolean);
      const followers = (await Promise.all(byTime(theirs).map(id => card(id, mine, theirs)))).filter(Boolean);
      return res.status(200).json({ following, followers });
    }

    if (req.method === 'POST' || req.method === 'DELETE') {
      const { username } = readBody(req) || {};
      const id = await idFor(username);
      const other = id && await loadUser(id);
      if (!other) return res.status(404).json({ error: 'not-found' });
      if (other.id === me.id) return res.status(400).json({ error: 'self' });

      if (req.method === 'POST') {
        if (other.public === '0') return res.status(403).json({ error: 'private' });
        if (await limited('follow:' + me.id, 60, 3600)) return res.status(429).json({ error: 'too-many' });
        const now = String(Date.now());
        await redis('HSET', 'following:' + me.id, other.id, now);
        await redis('HSET', 'followers:' + other.id, me.id, now);
      } else {
        await redis('HDEL', 'following:' + me.id, other.id);
        await redis('HDEL', 'followers:' + other.id, me.id);
      }
      const followsYou = other.id in pairs(await redis('HGETALL', 'followers:' + me.id));
      return res.status(200).json({ youFollow: req.method === 'POST', followsYou });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'method-not-allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
