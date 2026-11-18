// Muza — sessions are saved online in your account (Vercel + Redis)
// and cached in this browser's localStorage. Without the online database it
// falls back to this browser only. Shared helpers live in store.js.
let sessions = loadSessions();
let settings = loadSettings();
let filter = 'all';
let instrument = myInstruments(settings)[0];
let cloud = false; // true when signed in and the online database answers
function save() { saveSessions(sessions); }

let syncState = null;    // [key, kind] of the badge, re-translated on language change
function setSync(key, kind) {
  syncState = key ? [key, kind] : null;
  const s = document.getElementById('sync');
  const text = key ? t(key) : '';
  s.textContent = text;
  s.className = 'sync ' + (kind || '');
  s.hidden = !text;
}

// Banner inviting visitors to log in / sign up so their progress is saved online
function showSignInBanner(on) {
  document.getElementById('signin-banner').hidden = !on;
}

// Try to load from the database. Falls back to this-browser-only mode when no database exists.
async function connect() {
  await authReady;
  const user = currentUser();
  if (!user) {
    cloud = false;
    showSignInBanner(!!authState); // accounts exist only when the online database is set up
    setSync(authState ? '' : 'sync.local', 'warn');
    render();
    return;
  }

  const res = await api('GET');
  if (res.status === 200 && res.data && Array.isArray(res.data.sessions)) {
    cloud = true;
    showSignInBanner(false);
    const remote = res.data.sessions;
    const remoteIds = new Set(remote.map(s => s.id));
    // Sessions logged on this device before signing in move into the account,
    // unless they belong to a different account that used this browser before.
    const mine = !cacheOwner() || cacheOwner() === user.id;
    const localOnly = mine ? sessions.filter(s => !remoteIds.has(s.id)) : [];
    if (!mine) settings = { weeklyGoal: 180 };
    setCacheOwner(user.id);
    sessions = remote.concat(localOnly);
    save();
    // Weekly goal lives online too
    const st = await api('GET', null, '', '/api/settings');
    if (st.status === 200 && st.data && st.data.settings && (st.data.settings.weeklyGoal || st.data.settings.instruments)) {
      settings = { ...settings, ...st.data.settings };
      saveSettingsLocal(settings);
    } else if (st.status === 200) {
      api('PUT', settings, '', '/api/settings'); // first time: upload the settings from this device
    }
    renderInstrumentUI();
    // New accounts: ask once which instruments they practise
    if (st.status === 200 && !(st.data.settings && st.data.settings.instruments)) openInstrumentPicker(true);
    if (localOnly.length) {
      const up = await api('POST', localOnly);
      if (up.status !== 200) { setSync('sync.partial', 'err'); render(); return; }
    }
    setSync('sync.ok', 'ok');
    render();
    return;
  }

  // Signed out on the server, database missing, or offline: this browser only
  cloud = false;
  showSignInBanner(res.status === 401);
  setSync(res.status === 503 ? 'sync.nodb' : 'sync.local', 'warn');
  render();
}

async function cloudSave(list) {
  if (!cloud) return;
  setSync('sync.saving');
  const r = await api('POST', list).catch(() => ({ status: 0 }));
  if (r.status === 200) setSync('sync.ok', 'ok');
  else if (r.status === 401) { cloud = false; showSignInBanner(true); setSync('sync.fail', 'err'); }
  else setSync('sync.fail', 'err');
}

async function cloudDelete(id) {
  if (!cloud) return;
  setSync('sync.saving');
  const r = await api('DELETE', null, '?id=' + encodeURIComponent(id)).catch(() => ({ status: 0 }));
  setSync(r.status === 200 ? 'sync.ok' : 'sync.delfail', r.status === 200 ? 'ok' : 'err');
}

const typeName = instrName;    // "Guitar" / "Гітара"
const typeLower = instrLower;  // "guitar" / "гітара"
// Instruments to show: the ones you chose, plus any you logged earlier
function shownInstruments() {
  const mine = myInstruments(settings);
  const used = [...new Set(sessions.map(s => s.type))].filter(id => INSTR[id] && !mine.includes(id));
  return mine.concat(used);
}
// Label used in the graph tooltip ("30 min guitar" / "Гітара: 30 хв")
const tipType = type => (type === 'all' ? t('tip.all') : LANG === 'uk' ? typeName(type) : typeLower(type));
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
    // Weekday labels down the left, like GitHub: Mon, Wed, Fri
    const label = el('div', 'graph-label');
    t('weekShort').forEach((w, r) => label.appendChild(el('span', null, r % 2 ? w : '')));
    const cells = el('div', 'cells');
    let i = 0;
    for (let d = new Date(start); d <= end || d.getDay() !== 0; d.setDate(d.getDate() + 1), i++) {
      const key = iso(d);
      const min = byDay[key] || 0;
      const c = el('span', 'cell' + (d > end ? ' future' : '') + (key === todayKey ? ' today' : '') + (key === justAddedDate ? ' just' : ''));
      c.style.setProperty('--d', (Math.floor(i / 7) * 14 + (i % 7) * 18) + 'ms');
      c.style.background = scaleFor(type)[level(min)];
      c.dataset.date = key;
      c.dataset.tip = (min ? t('tip.some', { n: min, type: tipType(type) }) : t('tip.none', { type: tipType(type) })) +
        ` · ${d.getDate()} ${monthShort(d.getMonth())} ${d.getFullYear()}`;
      cells.appendChild(c);
      if (d <= end && min) { yearMin += min; daysPractised.add(key); }
    }
    row.append(label, cells);
    graph.appendChild(row);
  }
  // On narrow screens, start scrolled to the most recent weeks
  const scroller = graph.closest('.graph-scroll');
  scroller.scrollLeft = scroller.scrollWidth;

  document.getElementById('year-summary').textContent =
    t('year.summary', { min: yearMin.toLocaleString(LANG), days: daysPractised.size, dayWord: plural(daysPractised.size, 'days') });

  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  legend.append(t('legend.less'));
  for (const c of scaleFor(filter)) {
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
      Object.assign(el('span', 'tag', typeLower(s.type)), { style: instrTagStyle(s.type) }),
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
  const byDayType = {};
  weekList.forEach(s => { const d = byDayType[s.date] || (byDayType[s.date] = {}); d[s.type] = (d[s.type] || 0) + s.minutes; });
  const order = shownInstruments();
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
    const parts = order.map(id => [id, (byDayType[key] || {})[id] || 0]).filter(([, m]) => m);
    col.title = `${d.toLocaleDateString(LANG, { weekday: 'long' })}: ` +
      (min ? parts.map(([id, m]) => `${typeLower(id)} ${fmtMin(m)}`).join(', ') : t('goal.none'));
    const track = el('div', 'wb-track');
    // Stacked bar: first instrument at the bottom
    const bar = el('div', 'wb-bar');
    bar.style.height = (min / max * 100) + '%';
    bar.style.setProperty('--d', i * 60 + 'ms');
    parts.slice().reverse().forEach(([id, m]) => {
      const seg = el('span', 'seg'); seg.style.flexBasis = (m / min * 100) + '%'; seg.style.background = instrColor(id);
      bar.appendChild(seg);
    });
    const line = el('div', 'wb-line'); line.style.bottom = (daily / max * 100) + '%';
    track.append(line, bar);
    col.append(track, el('span', null, label));
    bars.appendChild(col);
  });

  // Legend: your instruments + the daily target line
  const gl = document.getElementById('goal-legend');
  gl.innerHTML = '';
  myInstruments(settings).forEach(id => { const k = el('span', 'k', typeName(id)); k.style.setProperty('--k', instrColor(id)); gl.appendChild(k); });
  gl.appendChild(el('span', 'k target', t('goal.daily')));

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
  const perType = {};
  list.forEach(s => { perType[s.type] = (perType[s.type] || 0) + s.minutes; });
  const typesUsed = shownInstruments().filter(id => perType[id]);
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

  // Split by instrument
  const split = el('div', 'split');
  const bar = el('div', 'split-bar');
  const legend = el('div', 'split-legend');
  typesUsed.forEach(id => {
    const part = el('span'); part.style.width = (perType[id] / total * 100) + '%'; part.style.background = instrColor(id);
    bar.appendChild(part);
    const k = el('span', 'k', `${typeName(id)} ${fmtMin(perType[id])} · ${Math.round(perType[id] / total * 100)}%`);
    k.style.setProperty('--k', instrColor(id));
    legend.appendChild(k);
  });
  split.append(bar, legend);
  body.appendChild(split);

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
  renderInstrumentUI();
  if (syncState) setSync(syncState[0], syncState[1]);
  animateNextGraph = true;
  render();
  movePill();
});

// ---------- Instruments: buttons in the form, graph tabs, picker ----------
function renderInstrumentUI() {
  const mine = myInstruments(settings);
  if (!mine.includes(instrument)) instrument = mine[0];
  const box = document.getElementById('inst-toggle');
  box.innerHTML = '';
  box.classList.toggle('many', mine.length > 3);
  mine.forEach(id => {
    const b = el('button', id === instrument ? 'on' : null, typeName(id));
    b.type = 'button'; b.dataset.type = id; b.setAttribute('aria-pressed', id === instrument);
    b.onclick = () => {
      instrument = id;
      box.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    };
    box.appendChild(b);
  });

  const list = shownInstruments();
  if (filter !== 'all' && !list.includes(filter)) filter = 'all';
  const tabsBox = document.getElementById('tabs');
  tabsBox.querySelectorAll('button').forEach(b => b.remove());
  ['all', ...list].forEach(id => {
    const b = el('button', id === filter ? 'on' : null, id === 'all' ? t('all') : typeName(id));
    b.type = 'button'; b.setAttribute('role', 'tab'); b.dataset.filter = id; b.setAttribute('aria-selected', id === filter);
    b.onclick = () => {
      filter = id;
      tabsBox.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      movePill();
      animateNextGraph = true;
      render();
    };
    tabsBox.appendChild(b);
  });
  movePill();
}

const instDialog = document.getElementById('inst-dialog');
let readPicker = null;
function openInstrumentPicker() {
  readPicker = buildInstrumentPicker(document.getElementById('inst-picker'), myInstruments(settings));
  document.getElementById('inst-error').hidden = true;
  if (!instDialog.open) instDialog.showModal();
}
document.getElementById('inst-edit').onclick = () => openInstrumentPicker();
document.getElementById('inst-cancel').onclick = () => instDialog.close();
document.getElementById('inst-form').addEventListener('submit', async e => {
  e.preventDefault();
  const chosen = readPicker();
  if (!chosen.length) { document.getElementById('inst-error').hidden = false; return; }
  settings.instruments = chosen;
  saveSettingsLocal(settings);
  instDialog.close();
  renderInstrumentUI();
  render();
  if (cloud) {
    const r = await api('PUT', { instruments: chosen }, '', '/api/settings');
    setSync(r.status === 200 ? 'sync.ok' : 'sync.fail', r.status === 200 ? 'ok' : 'err');
  }
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
  a.download = `muza-${today()}.json`;
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
    const added = data.filter(s => s && s.id && s.date && INSTR[s.type] && s.minutes > 0 && !ids.has(s.id));
    sessions.push(...added);
    save(); renderInstrumentUI(); render();
    if (added.length) cloudSave(added);
    alert(t('import.ok', { n: added.length }));
  } catch { alert(t('import.bad')); }
  e.target.value = '';
};

renderInstrumentUI();
document.fonts && document.fonts.ready.then(movePill);
render();   // show the cached copy right away
connect();  // then load from the online database
