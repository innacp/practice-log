// Theory lessons edited in the admin panel.
//   GET    /api/lessons   -> { lessons: [...] | null, admin: true|false }   (public; admin = signed in as admin)
//   PUT    /api/lessons   -> save the whole list                             (admin)
//   DELETE /api/lessons   -> forget edits, the site goes back to the built-in lessons (admin)
// When nothing is saved, the theory page uses the lessons in lessons-1/2/3.js.
import { redis, begin, readBody } from './_lib.js';

const KEY = 'practice-log:lessons';
const LEVELS = new Set(['beginner', 'intermediate', 'advanced']);

// Lesson text is HTML written by the site owner. Still strip anything that could run code.
function clean(html) {
  return String(html)
    .replace(/<\s*(script|iframe|object|embed|style)[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|iframe|object|embed|style)[^>]*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/(href|src)\s*=\s*(["']?)\s*javascript:[^"'>\s]*\2/gi, '$1="#"');
}

function validLesson(l) {
  if (!l || typeof l !== 'object') return null;
  if (typeof l.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(l.id)) return null;
  if (!LEVELS.has(l.level)) return null;
  const mins = Math.round(Number(l.mins));
  if (!(mins >= 1 && mins <= 120)) return null;
  const text = (o, max) => o && typeof o.en === 'string' && typeof o.uk === 'string' && o.en.length <= max && o.uk.length <= max;
  if (!text(l.title, 200) || !text(l.body, 80000)) return null;
  return {
    id: l.id, level: l.level, mins,
    title: { en: l.title.en.trim(), uk: l.title.uk.trim() },
    body: { en: clean(l.body.en), uk: clean(l.body.uk) },
  };
}

export default async function handler(req, res) {
  const me = await begin(req, res);
  if (!me) return;
  const admin = me.role === 'admin';

  try {
    if (req.method === 'GET') {
      const raw = await redis('GET', KEY);
      let lessons = null;
      try { lessons = raw ? JSON.parse(raw) : null; } catch {}
      return res.status(200).json({ lessons: Array.isArray(lessons) && lessons.length ? lessons : null, admin });
    }

    if (!admin) return res.status(me.id ? 403 : 401).json({ error: 'not-admin' });

    if (req.method === 'PUT') {
      const body = readBody(req) || {};
      if (!Array.isArray(body.lessons) || !body.lessons.length || body.lessons.length > 200) {
        return res.status(400).json({ error: 'invalid-list' });
      }
      const lessons = body.lessons.map(validLesson);
      const bad = lessons.findIndex(l => !l);
      if (bad >= 0) return res.status(400).json({ error: 'invalid-lesson', index: bad });
      if (new Set(lessons.map(l => l.id)).size !== lessons.length) return res.status(400).json({ error: 'duplicate-id' });
      await redis('SET', KEY, JSON.stringify(lessons));
      return res.status(200).json({ saved: lessons.length });
    }

    if (req.method === 'DELETE') {
      await redis('DEL', KEY);
      return res.status(200).json({ reset: true });
    }

    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).json({ error: 'method-not-allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server-error' });
  }
}
