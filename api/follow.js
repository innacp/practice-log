// Following other musicians, their activity, and cheers. Two people who follow each other are friends.
//   GET    /api/follow                         -> { me: card, following: [card], followers: [card] }
//   POST   /api/follow { username }            -> follow someone (their profile must be public)
//   DELETE /api/follow { username }            -> unfollow
//   POST   /api/follow?action=cheer { username, date, emoji }  -> cheer a day of someone you follow;
//                                                 the same emoji again takes it back -> { mine }
//   GET    /api/follow?view=cheers             -> { cheers: [...] } cheers you got that you haven't seen yet
//   POST   /api/follow?action=seen             -> mark those cheers as seen
// Stored as hashes: following:<id> and followers:<id> (field = other user's id, value = time),
// cheers:<id> (field = "<date>|<from id>", value = JSON { e: emoji, t: time }), cheers-seen:<id> = time.
// A card has name, username, photo version, whether you follow each other, minutes per day over
// the last 5 weeks, the last 2 weeks of sessions (type, minutes, time; never notes) and the cheers
// on each day. Practice is only shared for public profiles.
import { redis, pairs, readBody, begin, loadUser, loadSessions, limited } from './_lib.js';

const DAYS = 35, FEED_DAYS = 14;
const EMOJIS = new Set(['clap', 'fire']);
const since = days => new Date(Date.now() - (days + 1) * 86400000).toISOString().slice(0, 10);

async function idFor(username) {
  const u = String(username || '').trim().toLowerCase().replace(/^@/, '');
  return /^[a-z0-9-]{2,24}$/.test(u) ? redis('GET', 'uname:' + u) : null;
}

const parse = v => { try { return JSON.parse(v); } catch { return null; } };

async function card(id, mine, theirs, viewerId) {
  const [u, sessions, cheersFlat] = await Promise.all([loadUser(id), loadSessions(id), redis('HGETALL', 'cheers:' + id)]);
  if (!u) return null;
  const visible = u.public !== '0' || id === viewerId;
  const c = {
    name: u.name, username: u.username, avatar: Number(u.avatar) || 0, public: u.public !== '0',
    youFollow: id in mine, followsYou: id in theirs, days: {}, recent: [], cheers: {},
  };
  if (!visible) return c;
  const from35 = since(DAYS), from14 = since(FEED_DAYS);
  for (const s of sessions) {
    if (!s || !(s.date >= from35)) continue;
    const m = Number(s.minutes) || 0;
    c.days[s.date] = (c.days[s.date] || 0) + m;
    if (s.date >= from14) c.recent.push({ date: s.date, type: s.type, minutes: m, created: Number(s.created) || 0 });
  }
  for (const [field, value] of Object.entries(pairs(cheersFlat))) {
    const [date, from] = field.split('|');
    const v = parse(value);
    if (!(date >= from14) || !v || !EMOJIS.has(v.e)) continue;
    const day = c.cheers[date] || (c.cheers[date] = { clap: 0, fire: 0, mine: null });
    day[v.e]++;
    if (from === viewerId) day.mine = v.e;
  }
  return c;
}

export default async function handler(req, res) {
  const me = await begin(req, res, { needUser: true });
  if (!me) return;
  const action = req.query.action;

  try {
    // Cheers other people gave you, newest first, not yet seen
    if (req.method === 'GET' && req.query.view === 'cheers') {
      const [flat, seen] = await Promise.all([redis('HGETALL', 'cheers:' + me.id), redis('GET', 'cheers-seen:' + me.id)]);
      const after = Number(seen) || 0, from = since(30);
      const list = Object.entries(pairs(flat))
        .map(([field, value]) => { const [date, id] = field.split('|'); return { date, id, ...(parse(value) || {}) }; })
        .filter(c => EMOJIS.has(c.e) && c.t > after && c.date >= from)
        .sort((a, b) => b.t - a.t).slice(0, 20);
      const people = new Map(await Promise.all([...new Set(list.map(c => c.id))].map(async id => [id, await loadUser(id)])));
      const cheers = list.filter(c => people.get(c.id)).map(c => {
        const u = people.get(c.id);
        return { date: c.date, emoji: c.e, time: c.t, name: u.name, username: u.username, avatar: Number(u.avatar) || 0 };
      });
      return res.status(200).json({ cheers });
    }

    if (req.method === 'GET') {
      const [mine, theirs] = (await Promise.all([
        redis('HGETALL', 'following:' + me.id), redis('HGETALL', 'followers:' + me.id),
      ])).map(pairs);
      // One card per person, even when they are in both lists
      const ids = [...new Set([me.id, ...Object.keys(mine), ...Object.keys(theirs)])];
      const cards = new Map(await Promise.all(ids.map(async id => [id, await card(id, mine, theirs, me.id)])));
      const byTime = o => Object.keys(o).sort((a, b) => Number(o[b]) - Number(o[a]));
      const list = o => byTime(o).map(id => cards.get(id)).filter(Boolean);
      return res.status(200).json({ me: cards.get(me.id), following: list(mine), followers: list(theirs) });
    }

    if (req.method === 'POST' && action === 'seen') {
      await redis('SET', 'cheers-seen:' + me.id, String(Date.now()));
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'POST' && action === 'cheer') {
      const { username, date, emoji } = readBody(req) || {};
      if (!EMOJIS.has(emoji) || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'bad-cheer' });
      const id = await idFor(username);
      const other = id && await loadUser(id);
      if (!other) return res.status(404).json({ error: 'not-found' });
      if (other.id === me.id) return res.status(400).json({ error: 'self' });
      if (other.public === '0') return res.status(403).json({ error: 'private' });
      const [followed, current] = await Promise.all([
        redis('HEXISTS', 'following:' + me.id, other.id),
        redis('HGET', 'cheers:' + other.id, date + '|' + me.id),
      ]);
      if (!followed) return res.status(403).json({ error: 'not-following' });
      if (await limited('cheer:' + me.id, 200, 3600)) return res.status(429).json({ error: 'too-many' });
      const field = date + '|' + me.id;
      if ((parse(current) || {}).e === emoji) {
        await redis('HDEL', 'cheers:' + other.id, field);
        return res.status(200).json({ mine: null });
      }
      await redis('HSET', 'cheers:' + other.id, field, JSON.stringify({ e: emoji, t: Date.now() }));
      return res.status(200).json({ mine: emoji });
    }

    if ((req.method === 'POST' || req.method === 'DELETE') && !action) {
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
