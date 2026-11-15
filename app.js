// Practice Log — sessions are saved online (Vercel + Redis, behind a passcode)
// and cached in this browser's localStorage. Without the online database it
// falls back to this browser only.
const KEY = 'practice-log-v1';
const PASS_KEY = 'practice-log-passcode';
let sessions = load();
let filter = 'all';
let instrument = 'drums';
let cloud = false; // true once the online database is unlocked

// ---------- Online database ----------
function getPass() { try { return localStorage.getItem(PASS_KEY) || ''; } catch { return ''; } }
function setPass(p) { try { p ? localStorage.setItem(PASS_KEY, p) : localStorage.removeItem(PASS_KEY); } catch {} }

async function api(method, body, query = '') {
  const r = await fetch('/api/sessions' + query, {
    method,
    headers: { 'x-passcode': getPass(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await r.json(); } catch {}
  return { status: r.status, data };
}

function setSync(text, kind) {
  const s = document.getElementById('sync');
  s.textContent = text;
  s.className = 'sync ' + (kind || '');
  s.hidden = !text;
}

function showLocked(message) {
  document.body.classList.add('locked');
  document.getElementById('unlock').hidden = false;
  document.getElementById('lock').hidden = true;
  const err = document.getElementById('unlock-error');
  err.textContent = message || '';
  err.hidden = !message;
  setSync('Locked', 'warn');
  document.getElementById('passcode').focus();
}

function showUnlocked() {
  document.body.classList.remove('locked');
  document.getElementById('unlock').hidden = true;
  document.getElementById('lock').hidden = !cloud;
}

// Try to load from the database. Falls back to this-browser-only mode when no database exists.
async function connect() {
  let res;
  try { res = await api('GET'); } catch { res = { status: 0 }; }

  if (res.status === 200 && res.data && Array.isArray(res.data.sessions)) {
    cloud = true;
    const remote = res.data.sessions;
    const remoteIds = new Set(remote.map(s => s.id));
    const localOnly = sessions.filter(s => !remoteIds.has(s.id));
    sessions = remote.concat(localOnly);
    save();
    if (localOnly.length) {
      const up = await api('POST', localOnly).catch(() => ({ status: 0 }));
      if (up.status !== 200) { setSync('Some sessions not uploaded', 'err'); showUnlocked(); render(); return; }
    }
    setSync('Saved online', 'ok');
    showUnlocked();
    render();
    return;
  }

  if (res.status === 401) {
    cloud = false;
    showLocked(getPass() ? 'That passcode didn’t work. Try again.' : '');
    return;
  }

  // 404 (no API), 503 (database not set up yet) or offline: this browser only
  cloud = false;
  setSync(res.status === 503 ? 'Database not set up: saved on this device' : 'Saved on this device only', 'warn');
  showUnlocked();
  render();
}

async function cloudSave(list) {
  if (!cloud) return;
  setSync('Saving…');
  const r = await api('POST', list).catch(() => ({ status: 0 }));
  if (r.status === 200) setSync('Saved online', 'ok');
  else if (r.status === 401) showLocked('Your passcode changed. Enter it again.');
  else setSync('Not saved online. Will retry on reload', 'err');
}

async function cloudDelete(id) {
  if (!cloud) return;
  setSync('Saving…');
  const r = await api('DELETE', null, '?id=' + encodeURIComponent(id)).catch(() => ({ status: 0 }));
  setSync(r.status === 200 ? 'Saved online' : 'Delete not saved online', r.status === 200 ? 'ok' : 'err');
}

document.getElementById('unlock').addEventListener('submit', e => {
  e.preventDefault();
  setPass(document.getElementById('passcode').value);
  document.getElementById('passcode').value = '';
  connect();
});
document.getElementById('lock').onclick = () => {
  setPass('');
  cloud = false;
  sessions = [];
  save();
  render();
  showLocked();
};

const SCALES = {
  drums:  ['#EEF0F3', '#FFD8B8', '#FDA770', '#EA6A1F', '#B8430C'],
  vocals: ['#EEF0F3', '#CDD7FF', '#91A7FF', '#4C6EF5', '#2F44B3'],
  all:    ['#EEF0F3', '#F6C8FF', '#E58CFA', '#CC3FEB', '#9100B3'],
};
const DOTS = { drums: 'var(--drums)', vocals: 'var(--vocals)', all: '#CC3FEB' };
const LABELS = { drums: 'Drums', vocals: 'Vocals', all: 'All' };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(sessions)); } catch {}
}

const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => iso(new Date());
const pretty = s => { const d = new Date(s + 'T00:00'); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

function visible() {
  return filter === 'all' ? sessions : sessions.filter(s => s.type === filter);
}
function minutesByDay(list) {
  const m = {};
  for (const s of list) m[s.date] = (m[s.date] || 0) + s.minutes;
  return m;
}
function level(min) {
  if (!min) return 0;
  if (min <= 15) return 1;
  if (min <= 30) return 2;
  if (min < 60) return 3;
  return 4;
}

function graphRange() {
  const end = new Date(); end.setHours(0, 0, 0, 0);
  const start = new Date(end); start.setDate(start.getDate() - 364 - start.getDay());
  return { start, end };
}

// ---------- Motion helpers ----------
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let animateNextGraph = true;  // wave-in the squares on first load and tab switch
let justAddedId = null;       // highlight the newest row
let justAddedDate = null;     // pop the square that was just filled
const shown = {};             // last numbers shown, for count-up

function countTo(id, to, decimals = 0) {
  const node = document.getElementById(id);
  const from = shown[id] ?? 0;
  shown[id] = to;
  if (reducedMotion() || from === to) { node.textContent = to.toFixed(decimals).replace(/\.0$/, ''); return; }
  const start = performance.now(), dur = 900;
  const step = now => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = (from + (to - from) * eased).toFixed(decimals).replace(/\.0$/, '');
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function confetti(fromEl) {
  if (reducedMotion()) return;
  const r = fromEl.getBoundingClientRect();
  const colors = ['#D100FF', '#A13BFF', '#FF6EC7', '#EA6A1F', '#4C6EF5', '#FFD43B'];
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

function movePill() {
  const pill = document.querySelector('.tab-pill');
  const on = document.querySelector('.tabs button.on');
  if (!pill || !on) return;
  pill.style.width = on.offsetWidth + 'px';
  pill.style.transform = `translateX(${on.offsetLeft}px)`;
}
window.addEventListener('resize', movePill);

function renderGraph() {
  const graph = document.getElementById('graph');
  graph.innerHTML = '';
  // Keep the opening wave even if the online data arrives a moment later and re-renders
  const opening = performance.now() < 2000;
  graph.classList.toggle('animate', (animateNextGraph || opening) && !reducedMotion());
  animateNextGraph = false;
  const todayKey = today();
  const { start, end } = graphRange();

  // Month labels
  const months = el('div', 'months');
  months.appendChild(el('span'));
  let last = -1;
  for (let w = 0; w < 53; w++) {
    const d = new Date(start); d.setDate(start.getDate() + w * 7);
    if (d.getMonth() !== last && d.getDate() <= 7) {
      const m = el('span', null, MONTHS[d.getMonth()]);
      m.style.gridColumn = `${w + 2} / span 4`;
      months.appendChild(m);
      last = d.getMonth();
    }
  }
  graph.appendChild(months);

  // "All" is one merged row: drums + vocals minutes added together per day
  const types = [filter];
  let yearMin = 0;
  const daysPractised = new Set();

  for (const type of types) {
    const byDay = minutesByDay(visible());
    const row = el('div', 'graph-row');
    const label = el('div', 'graph-label');
    const dot = el('span', 'dot'); dot.style.background = DOTS[type];
    label.append(dot, LABELS[type]);
    const cells = el('div', 'cells');
    let i = 0;
    for (let d = new Date(start); d <= end || d.getDay() !== 0; d.setDate(d.getDate() + 1), i++) {
      const key = iso(d);
      const min = byDay[key] || 0;
      const c = el('span', 'cell' + (d > end ? ' future' : '') + (key === todayKey ? ' today' : '') + (key === justAddedDate ? ' just' : ''));
      c.style.setProperty('--d', (Math.floor(i / 7) * 14 + (i % 7) * 18) + 'ms');
      c.style.background = SCALES[type][level(min)];
      c.dataset.date = key;
      c.dataset.tip = `${min ? min + ' min' : 'No'} ${type === 'all' ? 'practice' : type} · ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      cells.appendChild(c);
      if (d <= end && min) { yearMin += min; daysPractised.add(key); }
    }
    row.append(label, cells);
    graph.appendChild(row);
  }
  // On narrow screens, start scrolled to the most recent weeks
  const scroller = graph.parentElement;
  scroller.scrollLeft = scroller.scrollWidth;

  document.getElementById('year-summary').textContent =
    `${yearMin.toLocaleString()} minutes · ${daysPractised.size} day${daysPractised.size === 1 ? '' : 's'} practised`;

  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  legend.append('Less');
  for (const c of SCALES[filter]) {
    const s = el('span', 'cell'); s.style.background = c; legend.appendChild(s);
  }
  legend.append('More');
}

function streaks(byDay) {
  let current = 0, longest = 0, run = 0;
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (!byDay[iso(d)]) d.setDate(d.getDate() - 1); // not logged today yet doesn't break the streak
  while (byDay[iso(d)]) { current++; d.setDate(d.getDate() - 1); }
  let prev = null;
  for (const k of Object.keys(byDay).sort()) {
    const t = new Date(k + 'T00:00');
    run = prev && Math.round((t - prev) / 86400000) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = t;
  }
  return { current, longest };
}

function renderStats() {
  const list = visible();
  const { current, longest } = streaks(minutesByDay(list));
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6);
  const week = list.filter(s => s.date >= iso(weekAgo) && s.date <= today()).reduce((a, s) => a + s.minutes, 0);
  const total = list.reduce((a, s) => a + s.minutes, 0);
  const streakEl = document.querySelector('.streak');
  if ((shown.streak ?? 0) < current && shown.streak !== undefined) {
    streakEl.classList.remove('bump'); void streakEl.offsetWidth; streakEl.classList.add('bump');
  }
  countTo('streak', current);
  // The fire grows with the streak and goes out at 0
  const fire = document.querySelector('.fire');
  fire.classList.toggle('out', current === 0);
  fire.style.setProperty('--heat', (1.1 + Math.min(current, 30) / 30 * 0.4).toFixed(2));
  document.querySelector('.streak .unit').textContent = current === 1 ? ' day' : ' days';
  countTo('longest', longest);
  countTo('week', week);
  countTo('hours', total / 60, 1);
}

function renderSessions() {
  const ul = document.getElementById('sessions');
  ul.innerHTML = '';
  const list = [...visible()].sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created).slice(0, 30);
  if (!list.length) { ul.appendChild(el('li', 'empty', 'No sessions yet. Log your first one above.')); return; }
  for (const s of list) {
    const li = el('li', s.id === justAddedId ? 'new' : null);
    const del = el('button', 'del');
    del.type = 'button';
    del.setAttribute('aria-label', 'Delete session');
    del.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    del.onclick = () => {
      if (!confirm('Delete this session?')) return;
      const finish = () => { sessions = sessions.filter(x => x.id !== s.id); save(); render(); cloudDelete(s.id); };
      if (reducedMotion()) return finish();
      li.classList.add('leaving');
      li.addEventListener('animationend', finish, { once: true });
    };
    li.append(
      el('span', 's-date', pretty(s.date)),
      el('span', `tag ${s.type}`, s.type),
      el('span', 's-min', `${s.minutes} min`),
      el('span', 's-notes', s.notes || ''),
      del,
    );
    ul.appendChild(li);
  }
}

function render() { renderGraph(); renderStats(); renderSessions(); }

// Header date
document.getElementById('today').textContent =
  new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

// Instrument toggle
const toggles = document.querySelectorAll('.toggle button');
toggles.forEach(b => b.onclick = () => {
  instrument = b.dataset.type;
  toggles.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
});

// Form
const form = document.getElementById('log-form');
form.date.value = today();
form.addEventListener('submit', e => {
  e.preventDefault();
  const minutes = parseInt(form.minutes.value, 10);
  if (!minutes || !form.date.value) return;
  const session = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    date: form.date.value, type: instrument, minutes,
    notes: form.notes.value.trim(), created: Date.now(),
  };
  sessions.push(session);
  save();
  form.notes.value = '';
  justAddedId = session.id;
  justAddedDate = session.date;
  render();
  justAddedId = justAddedDate = null;
  confetti(form.querySelector('.primary'));
  cloudSave([session]);
});

// Tabs
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach(b => b.onclick = () => {
  filter = b.dataset.filter;
  tabs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
  movePill();
  animateNextGraph = true;
  render();
});

// Click a square to pre-fill that date
const graphEl = document.getElementById('graph');
graphEl.addEventListener('click', e => {
  const c = e.target.closest('.cells .cell');
  if (c && !c.classList.contains('future')) { form.date.value = c.dataset.date; form.minutes.focus(); }
});

// Tooltip
const tip = document.getElementById('tip');
graphEl.addEventListener('mousemove', e => {
  const c = e.target.closest('.cells .cell');
  if (!c || c.classList.contains('future')) { tip.hidden = true; return; }
  tip.textContent = c.dataset.tip;
  tip.hidden = false;
  tip.style.left = Math.min(e.clientX + 10, innerWidth - tip.offsetWidth - 8) + 'px';
  tip.style.top = (e.clientY - 32) + 'px';
});
graphEl.addEventListener('mouseleave', () => tip.hidden = true);

// Export / import
document.getElementById('export').onclick = () => {
  const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `practice-log-${today()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
};
document.getElementById('import').onchange = async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data)) throw new Error();
    const ids = new Set(sessions.map(s => s.id));
    const added = data.filter(s => s && s.id && s.date && (s.type === 'drums' || s.type === 'vocals') && s.minutes > 0 && !ids.has(s.id));
    sessions.push(...added);
    save(); render();
    if (added.length) cloudSave(added);
    alert(`Imported ${added.length} session(s).`);
  } catch { alert("That file doesn't look like a Practice Log export."); }
  e.target.value = '';
};

movePill();
document.fonts && document.fonts.ready.then(movePill);
render();   // show the cached copy right away
connect();  // then load from the online database
