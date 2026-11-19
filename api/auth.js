// Accounts: sign up, log in, log out, forgot / reset password.
//   GET  /api/auth                      -> { user | null, ownerClaimable, emailReset }
//   POST /api/auth?action=register      { name, email, password, ownerPasscode? }
//   POST /api/auth?action=login         { email, password }
//   POST /api/auth?action=logout
//   POST /api/auth?action=forgot        { email }            (emails a reset link if RESEND_API_KEY is set)
//   POST /api/auth?action=reset         { token, password }
import {
  redis, readBody, begin, startSession, endSession, publicUser, loadUser,
  hashPassword, checkPassword, passcodeOk, newId, newToken, sha, limited,
} from './_lib.js';

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const OWNER_KEY = 'practice-log:owner';

function slug(s) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'musician';
}
async function freeUsername(base) {
  let name = slug(base), n = 1;
  while (await redis('EXISTS', 'uname:' + name)) name = `${slug(base).slice(0, 20)}-${++n}`;
  return name;
}

// Move the pre-accounts data (one shared log) into the owner's account
async function migrateOwnerData(userId) {
  const old = await redis('HGETALL', 'practice-log:sessions');
  if (old && old.length) await redis('HSET', 'sessions:' + userId, ...old);
  const settings = await redis('GET', 'practice-log:settings');
  if (settings) await redis('SET', 'settings:' + userId, settings);
}

export default async function handler(req, res) {
  const me = await begin(req, res);
  if (!me) return;
  const action = req.query.action;

  try {
    if (req.method === 'GET') {
      return res.status(200).json({
        user: me.id ? publicUser(me) : null,
        ownerClaimable: !!process.env.PRACTICE_PASSCODE && !(await redis('EXISTS', OWNER_KEY)),
        emailReset: !!process.env.RESEND_API_KEY,
      });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method-not-allowed' });
    const body = readBody(req) || {};
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'ip';

    if (action === 'register') {
      const name = String(body.name || '').trim().slice(0, 60);
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      if (!name) return res.status(400).json({ error: 'name-required' });
      if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'bad-email' });
      if (password.length < 8) return res.status(400).json({ error: 'short-password' });
      if (await limited('reg:' + ip, 10, 3600)) return res.status(429).json({ error: 'too-many-tries' });
      if (await redis('EXISTS', 'email:' + email)) return res.status(409).json({ error: 'email-taken' });

      // The site owner proves it with the old passcode and becomes admin (only once)
      let role = 'user';
      if (body.ownerPasscode) {
        if (!passcodeOk(body.ownerPasscode)) return res.status(403).json({ error: 'wrong-owner-passcode' });
        const ok = await redis('SET', OWNER_KEY, 'pending', 'NX');
        if (ok !== 'OK') return res.status(409).json({ error: 'owner-already-claimed' });
        role = 'admin';
      }

      const id = newId();
      const username = await freeUsername(name || email.split('@')[0]);
      await redis('HSET', 'user:' + id,
        'id', id, 'email', email, 'name', name, 'username', username, 'bio', '',
        'public', '1', 'role', role, 'pass', await hashPassword(password), 'created', String(Date.now()));
      await redis('SET', 'email:' + email, id);
      await redis('SET', 'uname:' + username, id);
      if (role === 'admin') { await migrateOwnerData(id); await redis('SET', OWNER_KEY, id); }
      await startSession(res, id);
      return res.status(200).json({ user: publicUser(await loadUser(id)) });
    }

    if (action === 'login') {
      const email = String(body.email || '').trim().toLowerCase();
      if (await limited('login:' + email, 10, 900) || await limited('login-ip:' + ip, 30, 900)) {
        return res.status(429).json({ error: 'too-many-tries' });
      }
      const id = await redis('GET', 'email:' + email);
      const user = await loadUser(id);
      // Same answer for "no such email" and "wrong password"
      if (!user || !(await checkPassword(String(body.password || ''), user.pass))) {
        return res.status(401).json({ error: 'wrong-login' });
      }
      await startSession(res, user.id);
      return res.status(200).json({ user: publicUser(user) });
    }

    if (action === 'logout') {
      await endSession(req, res);
      return res.status(200).json({ ok: true });
    }

    if (action === 'forgot') {
      const email = String(body.email || '').trim().toLowerCase();
      if (!process.env.RESEND_API_KEY) return res.status(501).json({ error: 'email-not-configured' });
      if (await limited('forgot:' + email, 3, 3600) || await limited('forgot-ip:' + ip, 10, 3600)) {
        return res.status(429).json({ error: 'too-many-tries' });
      }
      const id = await redis('GET', 'email:' + email);
      if (id) {
        const token = newToken();
        await redis('SET', 'reset:' + sha(token), id, 'EX', 3600);
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        const link = `https://${host}/login?reset=${token}`;
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Muza <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset your Muza password',
            text: `Hi!\n\nSomeone (hopefully you) asked to reset your Muza password.\nOpen this link within an hour to choose a new one:\n\n${link}\n\nIf it wasn't you, just ignore this email.`,
          }),
        });
        if (!r.ok) console.error('Resend error', r.status, await r.text());
      }
      // Always the same answer, so nobody can find out which emails have accounts
      return res.status(200).json({ ok: true });
    }

    if (action === 'reset') {
      const token = String(body.token || '');
      const password = String(body.password || '');
      if (password.length < 8) return res.status(400).json({ error: 'short-password' });
      if (!/^[a-f0-9]{64}$/.test(token)) return res.status(400).json({ error: 'bad-reset-link' });
      const id = await redis('GET', 'reset:' + sha(token));
      if (!id || !(await loadUser(id))) return res.status(400).json({ error: 'bad-reset-link' });
      await redis('DEL', 'reset:' + sha(token));
      await redis('HSET', 'user:' + id, 'pass', await hashPassword(password));
      await startSession(res, id);
      return res.status(200).json({ user: publicUser(await loadUser(id)) });
    }

    return res.status(400).json({ error: 'unknown-action' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}

