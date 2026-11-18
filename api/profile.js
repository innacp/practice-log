// Public profile: GET /api/profile?u=<username>
// Returns the name, bio, join date and minutes practised per day, per instrument.
// Notes are never shared. Private profiles are only visible to their owner.
import { redis, begin, loadUser } from './_lib.js';
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

    // minutes per day, split by instrument
    const flat = (await redis('HGETALL', 'sessions:' + user.id)) || [];
    const days = {};
    for (let i = 1; i < flat.length; i += 2) {
      let s; try { s = JSON.parse(flat[i]); } catch { continue; }
      if (!s || !s.date || !INSTRUMENT_IDS.has(s.type)) continue;
      const d = days[s.date] || (days[s.date] = {});
      d[s.type] = (d[s.type] || 0) + (Number(s.minutes) || 0);
    }
    let instruments = null;
    try { instruments = (JSON.parse(await redis('GET', 'settings:' + user.id)) || {}).instruments || null; } catch {}
    return res.status(200).json({
      instruments,
      profile: {
        name: user.name, username: user.username, bio: user.bio || '',
        created: Number(user.created) || 0, public: user.public !== '0', own,
        role: user.role === 'admin' ? 'admin' : 'user',
      },
      days,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
