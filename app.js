// Practice Log — sessions are saved in this browser's localStorage.
const KEY = 'practice-log-v1';
let sessions = load();
let filter = 'all';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(sessions)); } catch {}
}

// Dates as local YYYY-MM-DD strings
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => iso(new Date());
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
  if (min <= 60) return 3;
  return 4;
}

function renderGraph() {
  const graph = document.getElementById('graph');
  graph.innerHTML = '';
  const byDay = minutesByDay(visible());
  const end = new Date(); end.setHours(0, 0, 0, 0);
  const start = new Date(end); start.setDate(start.getDate() - 364 - start.getDay()); // start on a Sunday
  let col = 0, lastMonth = -1, yearTotal = 0;

  for (let d = new Date(start); d <= end || d.getDay() !== 0; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 0) {
      col++;
      if (d.getMonth() !== lastMonth && d.getDate() <= 7) {
        const m = document.createElement('div');
        m.className = 'month';
        m.style.gridColumn = col;
        m.textContent = MONTHS[d.getMonth()];
        graph.appendChild(m);
        lastMonth = d.getMonth();
      }
    }
    const key = iso(d);
    const min = byDay[key] || 0;
    const cell = document.createElement('div');
    cell.className = `cell l${level(min)}` + (d > end ? ' future' : '');
    cell.style.gridColumn = col;
    cell.style.gridRow = d.getDay() + 2;
    cell.dataset.tip = `${min ? min + ' min' : 'No practice'} on ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    cell.dataset.date = key;
    graph.appendChild(cell);
    if (d <= end) yearTotal += min;
  }
  const label = filter === 'all' ? '' : ` of ${filter}`;
  document.getElementById('total-line').textContent =
    `${yearTotal.toLocaleString()} minutes${label} in the last year`;
}

function streaks(byDay) {
  let current = 0, longest = 0, run = 0;
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (!byDay[iso(d)]) d.setDate(d.getDate() - 1); // today not logged yet doesn't break the streak
  while (byDay[iso(d)]) { current++; d.setDate(d.getDate() - 1); }
  const days = Object.keys(byDay).sort();
  let prev = null;
  for (const k of days) {
    const t = new Date(k + 'T00:00');
    run = prev && (t - prev) / 86400000 === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = t;
  }
  return { current, longest };
}

function renderStats() {
  const list = visible();
  const byDay = minutesByDay(list);
  const { current, longest } = streaks(byDay);
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6);
  const week = list.filter(s => s.date >= iso(weekAgo)).reduce((a, s) => a + s.minutes, 0);
  const total = list.reduce((a, s) => a + s.minutes, 0);
  const stats = [
    [current, 'day streak'],
    [longest, 'longest streak'],
    [week, 'minutes this week'],
    [(total / 60).toFixed(1), 'hours total'],
  ];
  document.getElementById('stats').innerHTML =
    stats.map(([v, l]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join('');
}

function renderSessions() {
  const ul = document.getElementById('sessions');
  const list = [...visible()].sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created).slice(0, 30);
  if (!list.length) { ul.innerHTML = '<li class="empty">No sessions yet — log your first one above.</li>'; return; }
  ul.innerHTML = '';
  for (const s of list) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${s.date}</span><span class="tag ${s.type}">${s.type}</span><span>${s.minutes} min</span><span class="notes"></span><button class="del" title="Delete">✕</button>`;
    li.querySelector('.notes').textContent = s.notes || '';
    li.querySelector('.del').onclick = () => {
      if (confirm('Delete this session?')) { sessions = sessions.filter(x => x.id !== s.id); save(); render(); }
    };
    ul.appendChild(li);
  }
}

function render() {
  document.body.dataset.filter = filter;
  renderGraph(); renderStats(); renderSessions();
}

// Form
const form = document.getElementById('log-form');
form.date.value = today();
form.addEventListener('submit', e => {
  e.preventDefault();
  const minutes = parseInt(form.minutes.value, 10);
  if (!minutes || minutes < 1) return;
  sessions.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    date: form.date.value, type: form.type.value, minutes,
    notes: form.notes.value.trim(), created: Date.now(),
  });
  save();
  form.notes.value = '';
  render();
});

// Tabs
document.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('active', x === b));
  filter = b.dataset.filter;
  render();
});

// Click a square to pre-fill that date
document.getElementById('graph').addEventListener('click', e => {
  const c = e.target.closest('.cell');
  if (c && c.dataset.date) { form.date.value = c.dataset.date; form.minutes.focus(); }
});

// Tooltip
const tip = document.getElementById('tip');
document.getElementById('graph').addEventListener('mousemove', e => {
  const c = e.target.closest('.cell');
  if (!c || c.classList.contains('future')) { tip.hidden = true; return; }
  tip.textContent = c.dataset.tip;
  tip.hidden = false;
  tip.style.left = Math.min(e.clientX + 10, innerWidth - tip.offsetWidth - 8) + 'px';
  tip.style.top = (e.clientY - 32) + 'px';
});
document.getElementById('graph').addEventListener('mouseleave', () => tip.hidden = true);

// Export / import (backup or move to another device)
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
    const added = data.filter(s => s && s.id && s.date && s.type && s.minutes && !ids.has(s.id));
    sessions.push(...added);
    save(); render();
    alert(`Imported ${added.length} session(s).`);
  } catch { alert('That file doesn\'t look like a Practice Log export.'); }
  e.target.value = '';
};

render();
