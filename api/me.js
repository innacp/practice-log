// The signed-in user's own account.
//   GET    /api/me                      -> { user }
//   PATCH  /api/me                      { name?, username?, bio?, public? }
//   POST   /api/me?action=password      { current, password }
//   DELETE /api/me                      { password }   deletes the account and all its data
import { redis, readBody, begin, publicUser, loadUser, hashPassword, checkPassword, endSession } from './_lib.js';

const RESERVED = new Set(['admin', 'login', 'profile', 'api', 'timer', 'theory', 'u', 'me', 'muza', 'settings']);

export default async function handler(req, res) {
  const me = await begin(req, res, { needUser: true });
  if (!me) return;

  try {
    if (req.method === 'GET') return res.status(200).json({ user: publicUser(me) });

    if (req.method === 'PATCH') {
      const b = readBody(req) || {};
      const fields = [];
      if (b.name !== undefined) {
        const name = String(b.name).trim().slice(0, 60);
        if (!name) return res.status(400).json({ error: 'name-required' });
        fields.push('name', name);
      }
      if (b.bio !== undefined) fields.push('bio', String(b.bio).trim().slice(0, 300));
      if (b.public !== undefined) fields.push('public', b.public ? '1' : '0');
      if (b.username !== undefined) {
        const u = String(b.username).trim().toLowerCase();
        if (!/^[a-z0-9][a-z0-9-]{1,23}$/.test(u) || RESERVED.has(u)) return res.status(400).json({ error: 'bad-username' });
        if (u !== me.username) {
          const ok = await redis('SET', 'uname:' + u, me.id, 'NX');
          if (ok !== 'OK') return res.status(409).json({ error: 'username-taken' });
          await redis('DEL', 'uname:' + me.username);
          fields.push('username', u);
        }
      }
      if (fields.length) await redis('HSET', 'user:' + me.id, ...fields);
      return res.status(200).json({ user: publicUser(await loadUser(me.id)) });
    }

    if (req.method === 'POST' && req.query.action === 'password') {
      const b = readBody(req) || {};
      if (!(await checkPassword(String(b.current || ''), me.pass))) return res.status(403).json({ error: 'wrong-password' });
      if (String(b.password || '').length < 8) return res.status(400).json({ error: 'short-password' });
      await redis('HSET', 'user:' + me.id, 'pass', await hashPassword(String(b.password)));
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const b = readBody(req) || {};
      if (!(await checkPassword(String(b.password || ''), me.pass))) return res.status(403).json({ error: 'wrong-password' });
      if (me.role === 'admin') return res.status(400).json({ error: 'admin-cannot-delete' });
      await redis('DEL', 'user:' + me.id, 'sessions:' + me.id, 'settings:' + me.id, 'email:' + me.email, 'uname:' + me.username);
      await endSession(req, res);
      return res.status(200).json({ deleted: true });
    }

    return res.status(405).json({ error: 'method-not-allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
