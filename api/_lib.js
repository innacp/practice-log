// Shared helpers for the API functions (files starting with _ are not routes on Vercel).
// Storage is Upstash Redis. Keys:
//   user:<id>            hash: id, email, name, username, bio, public, role, pass, created
//   email:<email>        -> user id         uname:<username> -> user id
//   sess:<sha256(token)> -> user id (30 days)  reset:<sha256(token)> -> user id (1 hour)
//   sessions:<id>        hash of practice sessions     settings:<id> JSON
//   practice-log:lessons theory lessons edited by the admin (shared)
import { timingSafeEqual, createHash, randomBytes, scrypt as scryptCb } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);
const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const COOKIE = 'muza_session';
const SESSION_DAYS = 30;

export async function redis(...command) {
  const r = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  const data = await r.json();
  if (!r.ok || data.error) throw new Error(data.error || `Redis error ${r.status}`);
  return data.result;
}

// HGETALL returns [k1, v1, k2, v2, ...]
export function pairs(flat) {
  const o = {};
  for (let i = 0; flat && i < flat.length; i += 2) o[flat[i]] = flat[i + 1];
  return o;
}

export function configured() { return !!(REDIS_URL && REDIS_TOKEN); }

export function readBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || 'null') : req.body;
}

export const sha = s => createHash('sha256').update(s).digest('hex');
export const newToken = () => randomBytes(32).toString('hex');
export const newId = () => randomBytes(9).toString('base64url');

// The old owner passcode is now only used once, to claim the original data.
export function passcodeOk(given) {
  const PASSCODE = process.env.PRACTICE_PASSCODE;
  if (!PASSCODE || typeof given !== 'string' || !given) return false;
  return timingSafeEqual(Buffer.from(sha(given)), Buffer.from(sha(PASSCODE)));
}

// ---------------------------------------------------------------- passwords
export async function hashPassword(pw) {
  const salt = randomBytes(16);
  const key = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}
export async function checkPassword(pw, stored) {
  if (typeof pw !== 'string' || typeof stored !== 'string') return false;
  const [kind, saltHex, keyHex] = stored.split('$');
  if (kind !== 'scrypt' || !saltHex || !keyHex) return false;
  const key = await scrypt(pw, Buffer.from(saltHex, 'hex'), 64);
  const want = Buffer.from(keyHex, 'hex');
  return key.length === want.length && timingSafeEqual(key, want);
}

// ---------------------------------------------------------------- cookies + sessions
function cookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
export async function startSession(res, userId) {
  const token = newToken();
  await redis('SET', 'sess:' + sha(token), userId, 'EX', SESSION_DAYS * 86400);
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}`);
}
export async function endSession(req, res) {
  const token = cookies(req)[COOKIE];
  if (token) await redis('DEL', 'sess:' + sha(token));
  res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

// A person's practice sessions, parsed (entries that fail to parse are skipped)
export async function loadSessions(id) {
  const flat = (await redis('HGETALL', 'sessions:' + id)) || [];
  const list = [];
  for (let i = 1; i < flat.length; i += 2) {
    try { list.push(JSON.parse(flat[i])); } catch {}
  }
  return list;
}

export async function loadUser(id) {
  if (!id) return null;
  const u = pairs(await redis('HGETALL', 'user:' + id));
  return u.id ? u : null;
}
// The signed-in user for this request, or null
export async function currentUser(req) {
  const token = cookies(req)[COOKIE];
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const id = await redis('GET', 'sess:' + sha(token));
  return loadUser(id);
}
// Safe-to-share view of a user (never the password hash)
export function publicUser(u) {
  return {
    id: u.id, email: u.email, name: u.name, username: u.username, bio: u.bio || '',
    public: u.public !== '0', role: u.role || 'user', created: Number(u.created) || 0,
    avatar: Number(u.avatar) || 0, // version of the profile photo, 0 = none
  };
}

// Common start of every handler: no caching, database configured, optional login requirement.
// Returns the user (or {} when login is not required and nobody is signed in), or null after answering.
export async function begin(req, res, { needUser = false } = {}) {
  res.setHeader('Cache-Control', 'no-store');
  if (!configured()) { res.status(503).json({ error: 'not-configured' }); return null; }
  const user = await currentUser(req);
  if (needUser && !user) { res.status(401).json({ error: 'not-signed-in' }); return null; }
  return user || {};
}

// Profile photos: a small square image the browser already resized.
// Stored as "image/webp;base64,...." under avatar:<id>; at most ~150 KB.
const IMAGE_TYPES = { 'image/webp': [0x52, 0x49, 0x46, 0x46], 'image/jpeg': [0xff, 0xd8, 0xff], 'image/png': [0x89, 0x50, 0x4e, 0x47] };
export function parseImage(dataUrl) {
  const m = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) return { error: 'bad-image' };
  const bytes = Buffer.from(m[2], 'base64');
  if (bytes.length > 150 * 1024) return { error: 'image-too-big' };
  const magic = IMAGE_TYPES[m[1]];
  if (!magic.every((b, i) => bytes[i] === b)) return { error: 'bad-image' };
  return { type: m[1], base64: m[2] };
}

// Simple rate limit: at most `max` hits per `seconds` for this key
export async function limited(key, max, seconds) {
  const n = await redis('INCR', 'rl:' + key);
  if (n === 1) await redis('EXPIRE', 'rl:' + key, seconds);
  return n > max;
}
