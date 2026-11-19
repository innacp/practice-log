// Public profile: GET /api/profile?u=<username>
// Profile photo:  GET /api/profile?u=<username>&avatar=<version>  (the image itself, cached)
// Returns the name, bio, join date and minutes practised per day, per instrument.
// Notes are never shared. Private profiles are only visible to their owner.
import { redis, pairs, begin, loadUser } from './_lib.js';
import { INSTRUMENT_IDS } from './_instruments.js';

export default async function handler(req, res) {
  const viewer = await begin(req, res);
  if (!viewer) return;
  if (req.method !== 'GET') return res.status(405).json({ error: 'method-not-allowed' });

  try {
    const uname = String(req.query.u || '').toLowerCase();
    const id = /^[a-z0-9-]{2,24}$/.test(uname) ? await redis('GET', 'uname:' + uname) : null;
    const user = await loadUser(id);
    if (!user) return res.status(404).json({ error: 'not-found' });
    const own = viewer.id === user.id;
    if (user.public === '0' && !own) return res.status(403).json({ error: 'private' });

    if (req.query.avatar !== undefined) {
      const stored = await redis('GET', 'avatar:' + user.id);
      if (!stored) return res.status(404).json({ error: 'no-avatar' });
      const [type, base64] = stored.split(';');
      // The URL carries the photo's version, so browsers may keep it for a long time
      res.setHeader('Cache-Control', user.public === '0' ? 'private, max-age=31536000, immutable' : 'public, max-age=31536000, immutable');
      res.setHeader('Content-Type', type);
      return res.status(200).send(Buffer.from(base64, 'base64'));
    }

    // minutes per day, split by instrument
    const flat = (await redis('HGETALL', 'sessions:' + user.id)) || [];
    const days = {};
    for (let i = 1; i < flat.length; i += 2) {
      let s; try { s = JSON.parse(flat[i]); } catch { continue; }
      if (!s || !s.date || !INSTRUMENT_IDS.has(s.type)) continue;
      const d = days[s.date] || (days[s.date] = {});
      d[s.type] = (d[s.type] || 0) + (Number(s.minutes) || 0);
    }
    const followers = pairs(await redis('HGETALL', 'followers:' + user.id));
    const following = pairs(await redis('HGETALL', 'following:' + user.id));
    const follow = {
      followers: Object.keys(followers).length, following: Object.keys(following).length,
      youFollow: !!viewer.id && viewer.id in followers, followsYou: !!viewer.id && viewer.id in following,
    };
    let instruments = null;
    try { instruments = (JSON.parse(await redis('GET', 'settings:' + user.id)) || {}).instruments || null; } catch {}
    return res.status(200).json({
      instruments, follow,
      profile: {
        name: user.name, username: user.username, bio: user.bio || '',
        created: Number(user.created) || 0, public: user.public !== '0', own, avatar: Number(user.avatar) || 0,
        role: user.role === 'admin' ? 'admin' : 'user',
      },
      days,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
