// Practice timer. The running state is kept in localStorage, so a reload or a
// sleeping phone doesn't lose time. Finished sessions go into the same log.
const TIMER_KEY = 'practice-log-timer';
const R = 108, CIRC = 2 * Math.PI * R;

let state = loadTimer();
let wakeLock = null;

function loadTimer() {
  const base = { type: myInstruments(loadSettings())[0], target: 0, startedAt: null, elapsed: 0, chimed: false };
  try { return { ...base, ...(JSON.parse(localStorage.getItem(TIMER_KEY)) || {}) }; } catch { return base; }
}
function saveTimer() { try { localStorage.setItem(TIMER_KEY, JSON.stringify(state)); } catch {} }

const running = () => state.startedAt != null;
const elapsedMs = () => state.elapsed + (running() ? Date.now() - state.startedAt : 0);

function fmtClock(ms) {
  const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

const $ = id => document.getElementById(id);
const fill = $('dial-fill');
fill.style.strokeDasharray = CIRC;

// ---------- Drawing ----------
function draw() {
  const ms = elapsedMs();
  $('time').textContent = fmtClock(ms);
  const targetMs = state.target * 60000;
  let progress;
  if (targetMs) {
    progress = Math.min(1, ms / targetMs);
    if (ms >= targetMs && !state.chimed && running()) { state.chimed = true; saveTimer(); goalReached(); }
  } else {
    progress = (ms % 60000) / 60000; // sweeps once a minute
  }
  fill.style.strokeDashoffset = CIRC * (1 - progress);
  $('dial').classList.toggle('done', !!targetMs && ms >= targetMs);
  $('dial').classList.toggle('running', running());
  // Ring takes the instrument's colour
  fill.style.stroke = instrColor(state.type);
  fill.style.filter = running() ? `drop-shadow(0 0 10px ${instrColor(state.type)}aa)` : '';

  let sub;
  if (running()) sub = targetMs ? (ms >= targetMs ? t('timer.reached') : t('timer.toGo', { t: fmtMin(Math.ceil((targetMs - ms) / 60000)) })) : t('timer.practising');
  else if (ms > 0) sub = t('timer.paused');
  else sub = t('timer.ready');
  if (!$('finish-form').hidden) sub = t('timer.finished');
  $('dial-sub').textContent = sub;

  document.title = running() ? `${fmtClock(ms)} · ${instrName(state.type)}` : t('title.timer');
}

function syncControls() {
  const ms = elapsedMs();
  $('start').textContent = running() ? t('timer.pause') : ms > 0 ? t('timer.resume') : t('timer.start');
  $('start').classList.toggle('paused', running());
  $('finish').disabled = ms === 0;
  $('discard').hidden = ms === 0 || !$('finish-form').hidden;
  document.querySelectorAll('.toggle button').forEach(b => {
    const on = b.dataset.type === state.type;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  });
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', +c.dataset.target === state.target));
  draw();
}

let raf;
function loop() { draw(); raf = requestAnimationFrame(loop); }
setInterval(draw, 500); // keeps the tab title ticking when the page is in the background

// ---------- Sound + screen ----------
let audio;
function chime() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    [880, 1318.5].forEach((f, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = 'sine'; o.frequency.value = f;
      const t = audio.currentTime + i * 0.18;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
      o.connect(g).connect(audio.destination);
      o.start(t); o.stop(t + 1);
    });
  } catch {}
}
function goalReached() { chime(); confetti($('dial')); }

async function keepAwake(on) {
  try {
    if (on && 'wakeLock' in navigator && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && running()) keepAwake(true); });

// ---------- Actions ----------
function start() {
  if (audio && audio.state === 'suspended') audio.resume();
  if (!audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch {} } // unlock sound on tap
  state.startedAt = Date.now();
  saveTimer(); keepAwake(true); syncControls();
  $('saved-msg').hidden = true;
}
function pause() {
  state.elapsed = elapsedMs();
  state.startedAt = null;
  saveTimer(); keepAwake(false); syncControls();
}
function reset() {
  state = { ...state, startedAt: null, elapsed: 0, chimed: false };
  saveTimer(); keepAwake(false);
  $('finish-form').hidden = true;
  $('controls').hidden = false;
  syncControls();
}

$('start').onclick = () => (running() ? pause() : start());

$('finish').onclick = () => {
  if (running()) pause();
  const min = Math.round(elapsedMs() / 60000);
  if (min < 1) {
    showMsg(t('timer.min1'), 'warn');
    return;
  }
  $('finish-title').textContent = niceText(min);
  $('finish-form').hidden = false;
  $('controls').hidden = true;
  syncControls();
  $('notes').focus();
};

$('keep-going').onclick = () => {
  $('finish-form').hidden = true;
  $('controls').hidden = false;
  start();
};

$('discard').onclick = () => {
  if (confirm(t('timer.discardConfirm'))) reset();
};

$('finish-form').addEventListener('submit', async e => {
  e.preventDefault();
  const minutes = Math.max(1, Math.round(elapsedMs() / 60000));
  const session = {
    id: newId(), date: today(), type: state.type, minutes,
    notes: $('notes').value.trim(), created: Date.now(),
  };
  const list = loadSessions();
  list.push(session);
  saveSessions(list);
  $('notes').value = '';
  confetti(document.querySelector('#finish-form .primary'));
  reset();
  renderToday();

  const r = await api('POST', [session]);
  lastSaved = { key: r.status === 200 ? 'timer.savedOk' : 'timer.savedLocal', vars: { t: fmtMin(minutes), type: instrLower(session.type) }, minutes, type: session.type };
  showMsg(t(lastSaved.key, lastSaved.vars), r.status === 200 ? 'ok' : 'warn', true);
});

let lastSaved = null; // remembered so the message can be re-translated
function niceText(min) { return t('timer.nice', { t: fmtMin(min), type: instrLower(state.type) }); }
function showMsg(text, kind, withLink) {
  const m = $('saved-msg');
  m.innerHTML = '';
  m.append(text + ' ');
  if (!withLink) lastSaved = null;
  if (withLink) {
    const a = el('a', null, t('timer.seeLog'));
    a.href = '/';
    m.append(a);
  }
  m.className = 'saved-msg ' + (kind || '');
  m.hidden = false;
}

function renderToggle() {
  const mine = myInstruments(loadSettings());
  if (!mine.includes(state.type) && !running() && !elapsedMs()) { state.type = mine[0]; saveTimer(); }
  const list = mine.includes(state.type) ? mine : mine.concat(state.type);
  const box = $('inst-toggle');
  box.innerHTML = '';
  box.classList.toggle('many', list.length > 3);
  list.forEach(id => {
    const b = el('button', null, instrName(id));
    b.type = 'button'; b.dataset.type = id;
    b.onclick = () => {
      state.type = id; saveTimer(); syncControls();
      if ($('finish-form').hidden === false) $('finish-title').textContent = niceText(Math.round(elapsedMs() / 60000));
    };
    box.appendChild(b);
  });
}
document.querySelectorAll('.chip').forEach(c => c.onclick = () => {
  state.target = +c.dataset.target;
  state.chimed = elapsedMs() >= state.target * 60000 && state.target > 0; // don't chime for a goal already passed
  saveTimer(); syncControls();
});

function renderToday() {
  const todayKey = today();
  const list = loadSessions().filter(s => s.date === todayKey);
  const total = list.reduce((a, s) => a + s.minutes, 0);
  $('today-total').textContent = total
    ? t('timer.today', { t: fmtMin(total), n: list.length, word: plural(list.length, 'sessionsWord') })
    : t('timer.todayNone');
}

function renderChips() {
  document.querySelectorAll('.chip[data-target]').forEach(c => {
    const n = +c.dataset.target;
    c.textContent = !n ? t('timer.none') : n % 60 ? t('dur.m', { m: n }) : t('dur.h', { h: n / 60 });
  });
}
document.addEventListener('langchange', () => {
  renderToggle();
  renderChips(); syncControls(); renderToday();
  if (!$('finish-form').hidden) $('finish-title').textContent = niceText(Math.round(elapsedMs() / 60000));
  if (lastSaved && !$('saved-msg').hidden) showMsg(t(lastSaved.key, lastSaved.vars), lastSaved.key === 'timer.savedOk' ? 'ok' : 'warn', true);
});

renderToggle();
renderChips();
syncControls();
renderToday();
if (running()) keepAwake(true);
loop();
