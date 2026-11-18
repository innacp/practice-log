// Shared helpers for the API functions (files starting with _ are not routes on Vercel).
import { timingSafeEqual, createHash } from 'node:crypto';

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

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

// Compare hashes so the check takes the same time whatever was typed
export function passcodeOk(given) {
  const PASSCODE = process.env.PRACTICE_PASSCODE;
  if (!PASSCODE || typeof given !== 'string' || !given) return false;
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(PASSCODE).digest();
  return timingSafeEqual(a, b);
}

export function configured() {
  return !!(REDIS_URL && REDIS_TOKEN && process.env.PRACTICE_PASSCODE);
}

// Returns true when the request may continue; otherwise it has already answered.
export function guard(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!REDIS_URL || !REDIS_TOKEN || !process.env.PRACTICE_PASSCODE) {
    res.status(503).json({ error: 'not-configured' });
    return false;
  }
  if (!passcodeOk(req.headers['x-passcode'])) {
    res.status(401).json({ error: 'wrong-passcode' });
    return false;
  }
  return true;
}

export function readBody(req) {
  return typeof req.body === 'string' ? JSON.parse(req.body || 'null') : req.body;
}
