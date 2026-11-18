// Shared by the log page and the timer page: local cache, online API and small helpers.
const KEY = 'practice-log-v1';
const SETTINGS_KEY = 'practice-log-settings';
const monthShort = i => t('months')[i];
const monthLong = i => t('monthsLong')[i];
const DEFAULT_SETTINGS = { weeklyGoal: 180 }; // minutes

function loadSessions() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function saveSessions(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}
function loadSettings() {
  try { return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; } catch { return { ...DEFAULT_SETTINGS }; }
}
function saveSettingsLocal(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
}

// ---------------------------------------------------------------- accounts
// Which account the cached data in this browser belongs to (so one person's
// offline sessions never get uploaded into someone else's account).
const CACHE_OWNER_KEY = 'practice-log-cache-owner';
function cacheOwner() { try { return localStorage.getItem(CACHE_OWNER_KEY) || ''; } catch { return ''; } }
function setCacheOwner(id) { try { id ? localStorage.setItem(CACHE_OWNER_KEY, id) : localStorage.removeItem(CACHE_OWNER_KEY); } catch {} }
function clearLocalData() {
  try { [KEY, SETTINGS_KEY, CACHE_OWNER_KEY, 'practice-log-timer'].forEach(k => localStorage.removeItem(k)); } catch {}
}

// Calls the online API (the login cookie goes along automatically).
// Returns { status, data }; status 0 means offline.
async function api(method, body, query = '', path = '/api/sessions') {
  try {
    const r = await fetch(path + query, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await r.json(); } catch {}
    return { status: r.status, data };
  } catch {
    return { status: 0, data: null };
  }
}

// Who is signed in: { user, ownerClaimable, emailReset } or null when there is no online database
let authState = null;
const authReady = api('GET', null, '', '/api/auth').then(r => {
  authState = r.status === 200 && r.data ? r.data : null;
  renderAccountButton();
  return authState;
});
function currentUser() { return authState && authState.user; }

async function logOut() {
  await api('POST', null, '?action=logout', '/api/auth');
  clearLocalData();
  location.href = '/';
}

// Header: "Log in" button, or a round avatar with the first letter linking to the profile.
// The admin gear only shows for the admin account.
function renderAccountButton() {
  const user = currentUser();
  document.querySelectorAll('.admin-link').forEach(a => { a.hidden = !(user && user.role === 'admin'); });
  document.querySelectorAll('.account-btn').forEach(b => {
    b.hidden = !authState; // no online database: no accounts
    b.classList.toggle('signed-in', !!user);
    if (user) {
      b.href = '/profile';
      b.textContent = (user.name || user.email || '?').trim().charAt(0).toUpperCase();
      b.title = user.name;
      b.setAttribute('aria-label', t('auth.myProfile') + ': ' + user.name);
    } else {
      b.href = '/login?next=' + encodeURIComponent(location.pathname);
      b.textContent = t('auth.login');
      b.title = '';
      b.removeAttribute('aria-label');
    }
  });
}
document.addEventListener('langchange', renderAccountButton);

const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => iso(new Date());
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 135 -> "2h 15m" (en) or "2 год 15 хв" (uk)
function fmtMin(min) {
  min = Math.round(min);
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return t('dur.m', { m });
  return m ? t('dur.hm', { h, m }) : t('dur.h', { h });
}

// Monday of the week that contains d
function weekStart(d = new Date()) {
  const s = new Date(d); s.setHours(0, 0, 0, 0);
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
  return s;
}

function confetti(fromEl) {
  if (reducedMotion() || !fromEl) return;
  const r = fromEl.getBoundingClientRect();
  const colors = ['#D100FF', '#A13BFF', '#FF6EC7', '#AEF359', '#FA8128', '#FFD43B'];
  for (let i = 0; i < 36; i++) {
    const p = el('span', 'confetti');
    p.style.background = colors[i % colors.length];
    p.style.left = r.left + r.width / 2 + 'px';
    p.style.top = r.top + r.height / 2 + 'px';
    if (i % 3 === 0) p.style.borderRadius = '50%';
    document.body.appendChild(p);
    const angle = (Math.PI * 2 * i) / 36 + Math.random() * 0.4;
    const dist = 80 + Math.random() * 120;
    const dx = Math.cos(angle) * dist, dy = Math.sin(angle) * dist - 60;
    p.animate([
      { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(${Math.random() * 540}deg)`, opacity: 1, offset: 0.6 },
      { transform: `translate(${dx * 1.1}px, ${dy + 140}px) scale(0.6) rotate(${Math.random() * 720}deg)`, opacity: 0 },
    ], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }).onfinish = () => p.remove();
    setTimeout(() => p.remove(), 2000); // backup if the tab was in the background
  }
}
