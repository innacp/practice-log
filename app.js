// Practice Log — sessions are saved online (Vercel + Redis, behind a passcode)
// and cached in this browser's localStorage. Without the online database it
// falls back to this browser only. Shared helpers live in store.js.
let sessions = loadSessions();
let settings = loadSettings();
let filter = 'all';
let instrument = 'drums';
let cloud = false; // true once the online database is unlocked
function save() { saveSessions(sessions); }

let syncState = null;    // [key, kind] of the badge, re-translated on language change
let unlockErrKey = null;
function setSync(key, kind) {
  syncState = key ? [key, kind] : null;
  const s = document.getElementById('sync');
  const text = key ? t(key) : '';
  s.textContent = text;
  s.className = 'sync ' + (kind || '');
  s.hidden = !text;
}

function showLocked(msgKey) {
  unlockErrKey = msgKey || null;
  document.body.classList.add('locked');
  document.getElementById('unlock').hidden = false;
  document.getElementById('lock').hidden = true;
  const err = document.getElementById('unlock-error');
  err.textContent = msgKey ? t(msgKey) : '';
  err.hidden = !msgKey;
  setSync('sync.locked', 'warn');
  document.getElementById('passcode').focus();
}

function showUnlocked() {
  document.body.classList.remove('locked');
  document.getElementById('unlock').hidden = true;
  document.getElementById('lock').hidden = !cloud;
}

// Try to load from the database. Falls back to this-browser-only mode when no database exists.
async function connect() {
  const res = await api('GET');

  if (res.status === 200 && res.data && Array.isArray(res.data.sessions)) {
    cloud = true;
    const remote = res.data.sessions;
    const remoteIds = new Set(remote.map(s => s.id));
    const localOnly = sessions.filter(s => !remoteIds.has(s.id));
    sessions = remote.concat(localOnly);
    save();
    // Weekly goal lives online too
    const st = await api('GET', null, '', '/api/settings');
    if (st.status === 200 && st.data && st.data.settings && st.data.settings.weeklyGoal) {
      settings = { ...settings, ...st.data.settings };
      saveSettingsLocal(settings);
    } else if (st.status === 200) {
      api('PUT', settings, '', '/api/settings'); // first time: upload the goal set on this device
    }
    if (localOnly.length) {
      const up = await api('POST', localOnly).catch(() => ({ status: 0 }));
      if (up.status !== 200) { setSync('sync.partial', 'err'); showUnlocked(); render(); return; }
    }
    setSync('sync.ok', 'ok');
    showUnlocked();
    render();
    return;
  }

  if (res.status === 401) {
    cloud = false;
    showLocked(getPass() ? 'unlock.wrong' : '');
    return;
  }

  // 404 (no API), 503 (database not set up yet) or offline: this browser only
  cloud = false;
  setSync(res.status === 503 ? 'sync.nodb' : 'sync.local', 'warn');
  showUnlocked();
  render();
}

async function cloudSave(list) {
  if (!cloud) return;
  setSync('sync.saving');
  const r = await api('POST', list).catch(() => ({ status: 0 }));
  if (r.status === 200) setSync('sync.ok', 'ok');
  else if (r.status === 401) showLocked('unlock.changed');
  else setSync('sync.fail', 'err');
}

async function cloudDelete(id) {
  if (!cloud) return;
  setSync('sync.saving');
  const r = await api('DELETE', null, '?id=' + encodeURIComponent(id)).catch(() => ({ status: 0 }));
  setSync(r.status === 200 ? 'sync.ok' : 'sync.delfail', r.status === 200 ? 'ok' : 'err');
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
  drums:  ['#EEF0F3', '#E3FBC4', '#C9F78E', '#AEF359', '#7DBA2A'],
  vocals: ['#EEF0F3', '#FEDCC0', '#FCB27A', '#FA8128', '#C25A10'],
  all:    ['#EEF0F3', '#F6C8FF', '#E58CFA', '#CC3FEB', '#9100B3'],
};
const DOTS = { drums: 'var(--drums)', vocals: 'var(--vocals)', all: '#CC3FEB' };
const typeName = type => t(type);              // "Drums" / "Барабани"
const typeLower = type => t(type + '.lower');  // "drums" / "барабани"
const pretty = s => { const d = new Date(s + 'T00:00'); return `${d.getDate()} ${monthShort(d.getMonth())} ${d.getFullYear()}`; };

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
      const m = el('span', null, monthShort(d.getMonth()));
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
    label.append(dot, typeName(type));
    const cells = el('div', 'cells');
    let i = 0;
    for (let d = new Date(start); d <= end || d.getDay() !== 0; d.setDate(d.getDate() + 1), i++) {
      const key = iso(d);
      const min = byDay[key] || 0;
      const c = el('span', 'cell' + (d > end ? ' future' : '') + (key === todayKey ? ' today' : '') + (key === justAddedDate ? ' just' : ''));
      c.style.setProperty('--d', (Math.floor(i / 7) * 14 + (i % 7) * 18) + 'ms');
      c.style.background = SCALES[type][level(min)];
      c.dataset.date = key;
      c.dataset.tip = (min ? t('tip.some', { n: min, type: t('tip.' + type) }) : t('tip.none', { type: t('tip.' + type) })) +
        ` · ${d.getDate()} ${monthShort(d.getMonth())} ${d.getFullYear()}`;
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
    t('year.summary', { min: yearMin.toLocaleString(LANG), days: daysPractised.size, dayWord: plural(daysPractised.size, 'days') });

  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  legend.append(t('legend.less'));
  for (const c of SCALES[filter]) {
    const s = el('span', 'cell'); s.style.background = c; legend.appendChild(s);
  }
  legend.append(t('legend.more'));
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
  const monday = iso(weekStart());
  const week = list.filter(s => s.date >= monday && s.date <= today()).reduce((a, s) => a + s.minutes, 0);
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
  document.querySelector('.streak .unit').textContent = ' ' + plural(current, 'days');
  countTo('longest', longest);
  countTo('week', week);
  countTo('hours', total / 60, 1);
}

function renderSessions() {
  const ul = document.getElementById('sessions');
  ul.innerHTML = '';
  const list = [...visible()].sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created).slice(0, 30);
  if (!list.length) { ul.appendChild(el('li', 'empty', t('sessions.empty'))); return; }
  for (const s of list) {
    const li = el('li', s.id === justAddedId ? 'new' : null);
    const del = el('button', 'del');
    del.type = 'button';
    del.setAttribute('aria-label', t('sessions.del'));
    del.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    del.onclick = () => {
      if (!confirm(t('sessions.confirm'))) return;
      const finish = () => { sessions = sessions.filter(x => x.id !== s.id); save(); render(); cloudDelete(s.id); };
      if (reducedMotion()) return finish();
      li.classList.add('leaving');
      li.addEventListener('animationend', finish, { once: true });
    };
    li.append(
      el('span', 's-date', pretty(s.date)),
      el('span', `tag ${s.type}`, typeLower(s.type)),
      el('span', 's-min', t('min', { n: s.minutes })),
      el('span', 's-notes', s.notes || ''),
      del,
    );
    ul.appendChild(li);
  }
}

// ---------- Weekly goal ----------
const RING_C = 2 * Math.PI * 60;
let lastGoalPct = null; // to celebrate only when the goal is crossed, not on page load

function renderGoal() {
  const goal = settings.weeklyGoal;
  const start = weekStart();
  const startKey = iso(start), todayKey = today();
  const weekList = sessions.filter(s => s.date >= startKey && s.date <= todayKey);
  const byDay = minutesByDay(weekList);
  const drumsByDay = minutesByDay(weekList.filter(s => s.type === 'drums'));
  const done = Object.values(byDay).reduce((a, b) => a + b, 0);
  const pct = goal ? done / goal : 0;

  const ring = document.getElementById('goal-ring');
  ring.style.strokeDasharray = RING_C;
  ring.style.strokeDashoffset = RING_C * (1 - Math.min(1, pct));
  document.getElementById('goal-ring-wrap').classList.toggle('done', pct >= 1);
  document.getElementById('goal-pct').textContent = Math.round(pct * 100) + '%';
  document.getElementById('goal-of').textContent = t('goal.of', { done: fmtMin(done), goal: fmtMin(goal) });

  const daysLeft = 7 - ((new Date().getDay() + 6) % 7); // including today
  const left = Math.max(0, goal - done);
  document.getElementById('goal-sub').textContent = pct >= 1
    ? t('goal.reached') + ' ' + (done === goal ? t('goal.exact') : t('goal.extra', { x: fmtMin(done - goal) }))
    : t('goal.left', { left: fmtMin(left), perDay: fmtMin(Math.ceil(left / daysLeft)) });

  // Mon–Sun bars
  const bars = document.getElementById('week-bars');
  bars.innerHTML = '';
  const daily = goal / 7;
  const max = Math.max(daily * 1.5, ...Object.values(byDay), 1);
  t('weekLetters').forEach((label, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i);
    const key = iso(d), min = byDay[key] || 0;
    const col = el('div', 'wb' + (key === todayKey ? ' is-today' : '') + (key > todayKey ? ' future' : ''));
    const dMin = drumsByDay[key] || 0, vMin = min - dMin;
    col.title = `${d.toLocaleDateString(LANG, { weekday: 'long' })}: ` +
      (min ? [dMin && `${typeLower('drums')} ${fmtMin(dMin)}`, vMin && `${typeLower('vocals')} ${fmtMin(vMin)}`].filter(Boolean).join(', ') : t('goal.none'));
    const track = el('div', 'wb-track');
    // Stacked bar: drums (green) at the bottom, vocals (orange) on top
    const bar = el('div', 'wb-bar');
    bar.style.height = (min / max * 100) + '%';
    bar.style.setProperty('--d', i * 60 + 'ms');
    if (min) {
      const v = el('span', 'seg vocals'); v.style.flexBasis = (vMin / min * 100) + '%';
      const dr = el('span', 'seg drums'); dr.style.flexBasis = (dMin / min * 100) + '%';
      bar.append(v, dr);
    }
    const line = el('div', 'wb-line'); line.style.bottom = (daily / max * 100) + '%';
    track.append(line, bar);
    col.append(track, el('span', null, label));
    bars.appendChild(col);
  });

  if (lastGoalPct !== null && lastGoalPct < 1 && pct >= 1) confetti(document.getElementById('goal-ring-wrap'));
  lastGoalPct = pct;
}

const goalForm = document.getElementById('goal-form');
document.getElementById('goal-edit').onclick = () => {
  const sel = document.getElementById('goal-hours');
  if (![...sel.options].some(o => +o.value === settings.weeklyGoal)) {
    const o = el('option', null, fmtMin(settings.weeklyGoal)); o.value = settings.weeklyGoal; sel.prepend(o);
  }
  sel.value = settings.weeklyGoal;
  goalForm.hidden = false;
  sel.focus();
};
document.getElementById('goal-cancel').onclick = () => { goalForm.hidden = true; };
goalForm.addEventListener('submit', async e => {
  e.preventDefault();
  settings.weeklyGoal = +document.getElementById('goal-hours').value;
  saveSettingsLocal(settings);
  goalForm.hidden = true;
  lastGoalPct = null; // changing the goal shouldn't throw confetti
  renderGoal();
  if (cloud) {
    const r = await api('PUT', settings, '', '/api/settings');
    setSync(r.status === 200 ? 'sync.ok' : 'sync.goalfail', r.status === 200 ? 'ok' : 'err');
  }
});

// ---------- Monthly recap ----------
let recapMonth = new Date(); recapMonth.setDate(1); recapMonth.setHours(0, 0, 0, 0);

function monthSessions(m) {
  const prefix = `${m.getFullYear()}-${pad(m.getMonth() + 1)}`;
  return sessions.filter(s => s.date.startsWith(prefix));
}

function renderRecap() {
  const m = recapMonth;
  const now = new Date();
  const isCurrent = m.getFullYear() === now.getFullYear() && m.getMonth() === now.getMonth();
  document.getElementById('recap-month').textContent = `${monthLong(m.getMonth())} ${m.getFullYear()}`;
  document.getElementById('recap-next').disabled = isCurrent;

  const body = document.getElementById('recap-body');
  body.innerHTML = '';
  const list = monthSessions(m);
  if (!list.length) {
    body.appendChild(el('p', 'recap-empty', isCurrent ? t('recap.emptyNow') : t('recap.empty', { month: monthLong(m.getMonth()) })));
    return;
  }

  const byDay = minutesByDay(list);
  const total = list.reduce((a, s) => a + s.minutes, 0);
  const drums = list.filter(s => s.type === 'drums').reduce((a, s) => a + s.minutes, 0);
  const vocals = total - drums;
  const [bestKey, bestMin] = Object.entries(byDay).sort((a, b) => b[1] - a[1])[0];
  const { longest } = streaks(byDay);
  const prev = new Date(m); prev.setMonth(prev.getMonth() - 1);
  const prevTotal = monthSessions(prev).reduce((a, s) => a + s.minutes, 0);

  const stats = el('div', 'recap-stats');
  const best = new Date(bestKey + 'T00:00');
  [
    [fmtMin(total), t('recap.total')],
    [String(Object.keys(byDay).length), plural(Object.keys(byDay).length, 'recap.daysWord')],
    [String(longest), t('recap.longest')],
    [`${best.getDate()} ${monthShort(best.getMonth())}`, t('recap.best', { t: fmtMin(bestMin) })],
  ].forEach(([v, l]) => { const d = el('div', 'rs'); d.append(el('b', null, v), el('span', null, l)); stats.appendChild(d); });
  body.appendChild(stats);

  // Compared with the month before
  if (prevTotal) {
    const change = Math.round((total - prevTotal) / prevTotal * 100);
    const up = change >= 0;
    body.appendChild(el('p', 'recap-change ' + (up ? 'up' : 'down'),
      t('recap.change', { arrow: up ? '▲' : '▼', pct: Math.abs(change), month: monthLong(prev.getMonth()) }) + (isCurrent ? t('recap.soFar') : '')));
  }

  // Drums / vocals split
  const split = el('div', 'split');
  const bar = el('div', 'split-bar');
  const dPart = el('span', 'split-drums'); dPart.style.width = (drums / total * 100) + '%';
  const vPart = el('span', 'split-vocals'); vPart.style.width = (vocals / total * 100) + '%';
  bar.append(dPart, vPart);
  const legend = el('div', 'split-legend');
  legend.append(
    el('span', 'k drums', `${typeName('drums')} ${fmtMin(drums)} · ${Math.round(drums / total * 100)}%`),
    el('span', 'k vocals', `${typeName('vocals')} ${fmtMin(vocals)} · ${Math.round(vocals / total * 100)}%`),
  );
  split.append(bar, legend);
  body.appendChild(split);

  // Mini calendar
  const cal = el('div', 'mini-cal');
  t('weekLetters').forEach(d => cal.appendChild(el('span', 'mc-head', d)));
  const offset = (m.getDay() + 6) % 7;
  for (let i = 0; i < offset; i++) cal.appendChild(el('span', 'mc-blank'));
  const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const key = `${m.getFullYear()}-${pad(m.getMonth() + 1)}-${pad(d)}`;
    const min = byDay[key] || 0;
    const c = el('span', 'mc-day' + (min ? ' has' : '') + (key === today() ? ' is-today' : ''), String(d));
    c.style.background = min ? SCALES.all[level(min)] : '';
    if (level(min) >= 3) c.style.color = '#fff';
    c.title = min ? `${d} ${monthShort(m.getMonth())}: ${fmtMin(min)}` : `${d} ${monthShort(m.getMonth())}`;
    cal.appendChild(c);
  }
  body.appendChild(cal);
}

document.getElementById('recap-prev').onclick = () => { recapMonth.setMonth(recapMonth.getMonth() - 1); renderRecap(); };
document.getElementById('recap-next').onclick = () => { recapMonth.setMonth(recapMonth.getMonth() + 1); renderRecap(); };

function render() { renderGraph(); renderStats(); renderGoal(); renderRecap(); renderSessions(); }

// Header date + translated dropdown options
function renderStatic() {
  document.getElementById('today').textContent =
    new Date().toLocaleDateString(LANG === 'uk' ? 'uk-UA' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  document.querySelectorAll('#minutes-select option').forEach(o => {
    o.textContent = +o.value >= 60 ? plural(o.value / 60, 'hours') : t('min', { n: o.value });
  });
  document.querySelectorAll('#goal-hours option').forEach(o => {
    o.textContent = +o.value % 60 ? fmtMin(+o.value) : plural(o.value / 60, 'hours');
  });
}
renderStatic();

// Switching language re-draws everything that JavaScript wrote
document.addEventListener('langchange', () => {
  renderStatic();
  if (syncState) setSync(syncState[0], syncState[1]);
  if (unlockErrKey) document.getElementById('unlock-error').textContent = t(unlockErrKey);
  animateNextGraph = true;
  render();
  movePill();
});

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
    alert(t('import.ok', { n: added.length }));
  } catch { alert(t('import.bad')); }
  e.target.value = '';
};

movePill();
document.fonts && document.fonts.ready.then(movePill);
render();   // show the cached copy right away
connect();  // then load from the online database
