// Admin-only account tools.
//   GET  /api/admin?action=users              -> { users: [{ id, name, email, username, role, created, avatar }] }
//   POST /api/admin?action=reset { id }       -> { password }  a new temporary password for that user
import { randomInt } from 'node:crypto';
import { redis, pairs, readBody, begin, publicUser, loadUser, hashPassword } from './_lib.js';

// Every user:<id> key in the database (SCAN walks the keyspace in small steps)
async function allUserIds() {
  const ids = [];
  let cursor = '0';
  do {
    const [next, keys] = await redis('SCAN', cursor, 'MATCH', 'user:*', 'COUNT', 200);
    keys.forEach(k => ids.push(k.slice(5)));
    cursor = String(next);
  } while (cursor !== '0');
  return ids;
}

// Easy-to-read temporary password, e.g. "tempo-7K3Q-piano"
function tempPassword() {
  const words = ['tempo', 'chord', 'piano', 'drums', 'voice', 'scale', 'groove', 'beat', 'melody', 'rhythm'];
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const code = Array.from({ length: 4 }, () => chars[randomInt(chars.length)]).join('');
  return `${words[randomInt(words.length)]}-${code}-${words[randomInt(words.length)]}`;
}

export default async function handler(req, res) {
  const me = await begin(req, res, { needUser: true });
  if (!me) return;
  if (me.role !== 'admin') return res.status(403).json({ error: 'not-admin' });

  try {
    if (req.method === 'GET' && req.query.action === 'users') {
      const users = [];
      for (const id of await allUserIds()) {
        const u = pairs(await redis('HGETALL', 'user:' + id));
        if (u.id) {
          const p = publicUser(u);
          users.push({ id: p.id, name: p.name, email: p.email, username: p.username, role: p.role, created: p.created, avatar: p.avatar });
        }
      }
      users.sort((a, b) => b.created - a.created);
      return res.status(200).json({ users });
    }

    if (req.method === 'POST' && req.query.action === 'reset') {
      const { id } = readBody(req) || {};
      const user = await loadUser(typeof id === 'string' ? id : '');
      if (!user) return res.status(404).json({ error: 'not-found' });
      const password = tempPassword();
      await redis('HSET', 'user:' + user.id, 'pass', await hashPassword(password));
      return res.status(200).json({ password });
    }

    return res.status(400).json({ error: 'unknown-action' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
