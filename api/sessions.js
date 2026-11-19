// Practice sessions API, stored in Upstash Redis (connected through Vercel Storage).
//   GET    /api/sessions          -> list all sessions
//   POST   /api/sessions          -> add one session, or an array of sessions (import)
//   DELETE /api/sessions?id=...   -> delete one session (and its recording)
//   PUT    /api/sessions?action=clip&id=... { audio: "data:audio/webm;base64,..." }
//                                 -> attach a recording (up to about a minute) -> { clip }
//   GET    /api/sessions?clip=<id>&v=<clip> -> the recording itself (only for its owner)
//   DELETE /api/sessions?action=clip&id=...  -> remove the recording, keep the session
// Every request needs a signed-in user; each user has their own list.
// Recordings are stored as "type;base64" under clip:<user id>:<session id>; the session
// gets clip = <time it was recorded> so pages know there is one.
import { redis, begin, readBody, loadSessions, limited } from './_lib.js';
import { INSTRUMENT_IDS } from './_instruments.js';

// Short voice/instrument clips from the browser's recorder (Opus in WebM/Ogg, or AAC in MP4)
const AUDIO_MAX = 450 * 1024;
const AUDIO_MAGIC = {
  'audio/webm': b => b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3,
  'audio/ogg': b => b.toString('latin1', 0, 4) === 'OggS',
  'audio/mp4': b => b.toString('latin1', 4, 8) === 'ftyp',
};
function parseAudio(dataUrl) {
  const m = /^data:(audio\/(?:webm|ogg|mp4))(?:;[^;,]*)*;base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
  if (!m) return { error: 'bad-audio' };
  const bytes = Buffer.from(m[2], 'base64');
  if (bytes.length > AUDIO_MAX) return { error: 'audio-too-big' };
  if (bytes.length < 16 || !AUDIO_MAGIC[m[1]](bytes)) return { error: 'bad-audio' };
  return { type: m[1], base64: m[2] };
}
const clipKey = (userId, sessionId) => 'clip:' + userId + ':' + sessionId;

function clean(s) {
  if (!s || typeof s !== 'object') return null;
  const minutes = Number(s.minutes);
  if (typeof s.id !== 'string' || !s.id || s.id.length > 100) return null;
  if (typeof s.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s.date)) return null;
  if (!INSTRUMENT_IDS.has(s.type)) return null;
  if (!Number.isFinite(minutes) || minutes <= 0 || minutes > 1440) return null;
  return {
    id: s.id,
    date: s.date,
    type: s.type,
    minutes: Math.round(minutes),
    notes: typeof s.notes === 'string' ? s.notes.slice(0, 500) : '',
    created: Number.isFinite(Number(s.created)) ? Number(s.created) : Date.now(),
    ...(Number(s.clip) > 0 ? { clip: Number(s.clip) } : {}),
  };
}

export default async function handler(req, res) {
  const me = await begin(req, res, { needUser: true });
  if (!me) return;
  const KEY = 'sessions:' + me.id;

  try {
    const action = req.query.action;

    // Play a recording
    if (req.method === 'GET' && req.query.clip) {
      const stored = await redis('GET', clipKey(me.id, String(req.query.clip)));
      if (!stored) return res.status(404).json({ error: 'no-clip' });
      const [type, base64] = stored.split(';');
      res.setHeader('Cache-Control', 'private, max-age=31536000, immutable'); // the URL carries the clip's version
      res.setHeader('Content-Type', type);
      return res.status(200).send(Buffer.from(base64, 'base64'));
    }

    if (req.method === 'GET') return res.status(200).json({ sessions: await loadSessions(me.id) });

    // Attach or remove a recording
    if (action === 'clip' && (req.method === 'PUT' || req.method === 'DELETE')) {
      const id = String(req.query.id || '');
      const current = id && await redis('HGET', KEY, id);
      if (!current) return res.status(404).json({ error: 'no-session' });
      const session = JSON.parse(current);
      if (req.method === 'DELETE') {
        delete session.clip;
        await Promise.all([redis('DEL', clipKey(me.id, id)), redis('HSET', KEY, id, JSON.stringify(session))]);
        return res.status(200).json({ clip: 0 });
      }
      if (await limited('clip:' + me.id, 60, 3600)) return res.status(429).json({ error: 'too-many' });
      const audio = parseAudio((readBody(req) || {}).audio);
      if (audio.error) return res.status(400).json({ error: audio.error });
      session.clip = Date.now();
      await Promise.all([
        redis('SET', clipKey(me.id, id), audio.type + ';' + audio.base64),
        redis('HSET', KEY, id, JSON.stringify(session)),
      ]);
      return res.status(200).json({ clip: session.clip });
    }

    if (req.method === 'POST') {
      const body = readBody(req);
      const list = (Array.isArray(body) ? body : [body]).map(clean).filter(Boolean);
      if (!list.length) return res.status(400).json({ error: 'invalid-session' });
      if (list.length > 5000) return res.status(413).json({ error: 'too-many' });
      const args = list.flatMap(s => [s.id, JSON.stringify(s)]);
      await redis('HSET', KEY, ...args);
      return res.status(200).json({ saved: list.length });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (typeof id !== 'string' || !id) return res.status(400).json({ error: 'missing-id' });
      await Promise.all([redis('HDEL', KEY, id), redis('DEL', clipKey(me.id, id))]);
      return res.status(200).json({ deleted: id });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ error: 'method-not-allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
