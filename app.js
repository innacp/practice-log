// Practice Log — sessions are saved in this browser's localStorage.
const KEY = 'practice-log-v1';
let sessions = load();
let filter = 'all';
let instrument = 'drums';

const SCALES = {
  drums:  ['#EEF0F3', '#FFD8B8', '#FDA770', '#EA6A1F', '#B8430C'],
  vocals: ['#EEF0F3', '#CDD7FF', '#91A7FF', '#4C6EF5', '#2F44B3'],
};
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

function renderGraph() {
  const graph = document.getElementById('graph');
  graph.innerHTML = '';
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

  const types = filter === 'all' ? ['drums', 'vocals'] : [filter];
  let yearMin = 0;
  const daysPractised = new Set();

  for (const type of types) {
    const byDay = minutesByDay(sessions.filter(s => s.type === type));
    const row = el('div', 'graph-row');
    const label = el('div', 'graph-label');
    const dot = el('span', 'dot'); dot.style.background = type === 'drums' ? 'var(--drums)' : 'var(--vocals)';
    label.append(dot, type === 'drums' ? 'Drums' : 'Vocals');
    const cells = el('div', 'cells');
    for (let d = new Date(start); d <= end || d.getDay() !== 0; d.setDate(d.getDate() + 1)) {
      const key = iso(d);
      const min = byDay[key] || 0;
      const c = el('span', 'cell' + (d > end ? ' future' : ''));
      c.style.background = SCALES[type][level(min)];
      c.dataset.date = key;
      c.dataset.tip = `${min ? min + ' min' : 'No'} ${type} · ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
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
  for (const c of SCALES[filter === 'vocals' ? 'vocals' : 'drums']) {
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
  document.getElementById('streak').textContent = current;
  document.querySelector('.streak .unit').textContent = current === 1 ? ' day' : ' days';
  document.getElementById('longest').textContent = longest;
  document.getElementById('week').textContent = week;
  document.getElementById('hours').textContent = +(total / 60).toFixed(1);
}

function renderSessions() {
  const ul = document.getElementById('sessions');
  ul.innerHTML = '';
  const list = [...visible()].sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created).slice(0, 30);
  if (!list.length) { ul.appendChild(el('li', 'empty', 'No sessions yet. Log your first one above.')); return; }
  for (const s of list) {
    const li = el('li');
    const del = el('button', 'del');
    del.type = 'button';
    del.setAttribute('aria-label', 'Delete session');
    del.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    del.onclick = () => {
      if (confirm('Delete this session?')) { sessions = sessions.filter(x => x.id !== s.id); save(); render(); }
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
  sessions.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    date: form.date.value, type: instrument, minutes,
    notes: form.notes.value.trim(), created: Date.now(),
  });
  save();
  form.notes.value = '';
  render();
});

// Tabs
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach(b => b.onclick = () => {
  filter = b.dataset.filter;
  tabs.forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
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
    alert(`Imported ${added.length} session(s).`);
  } catch { alert("That file doesn't look like a Practice Log export."); }
  e.target.value = '';
};

render();
