// Theory page: filters, "done" ticks (saved in this browser) and small sound demos.
const DONE_KEY = 'practice-log-lessons';
const lessons = [...document.querySelectorAll('.lesson')];

function loadDone() { try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY)) || []); } catch { return new Set(); } }
function saveDone() { try { localStorage.setItem(DONE_KEY, JSON.stringify([...done])); } catch {} }
let done = loadDone();

// ---------- Done ticks + progress ----------
function renderProgress() {
  const n = lessons.filter(l => done.has(l.id)).length;
  document.getElementById('lp-fill').style.width = (n / lessons.length * 100) + '%';
  document.getElementById('lp-text').textContent =
    n === lessons.length ? t('theory.allDone', { n }) : t('theory.progress', { n, total: lessons.length });
}

// "Basics · 3 min" under each title
function renderMeta() {
  lessons.forEach(l => {
    l.querySelector('.l-title small').textContent = `${t('l.' + l.dataset.topic)} · ${t('l.min', { n: l.dataset.mins })}`;
  });
}

const doneSyncs = [];
lessons.forEach(l => {
  const btn = el('button', 'ghost mark-done');
  btn.type = 'button';
  const sync = () => {
    const on = done.has(l.id);
    l.classList.toggle('is-done', on);
    btn.textContent = on ? t('theory.done') : t('theory.mark');
    btn.setAttribute('aria-pressed', on);
  };
  btn.onclick = () => {
    const was = done.has(l.id);
    was ? done.delete(l.id) : done.add(l.id);
    saveDone(); sync(); renderProgress();
    if (!was) confetti(btn);
  };
  l.querySelector('.l-body').appendChild(btn);
  doneSyncs.push(sync);
  sync();
});
renderMeta();
renderProgress();

// Open a lesson from a link like /theory#rudiments
if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target && target.tagName === 'DETAILS') target.open = true;
}

// ---------- Filters ----------
const chips = document.querySelectorAll('.theory-intro .chip');
chips.forEach(c => c.onclick = () => {
  chips.forEach(x => x.classList.toggle('on', x === c));
  const f = c.dataset.filter;
  lessons.forEach(l => { l.hidden = f !== 'all' && l.dataset.topic !== f; });
});

// ---------- Sound ----------
let ctx;
function audio() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, t, dur = 0.5, type = 'sine', vol = 0.3) {
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t); o.stop(t + dur + 0.05);
}
function noise(t, dur, filterFreq, vol) {
  const a = audio(), len = Math.ceil(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
  src.buffer = buf; f.type = 'highpass'; f.frequency.value = filterFreq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
}
function kick(t) {
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
  g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.35);
}
const snare = t => { noise(t, 0.18, 1200, 0.5); tone(190, t, 0.1, 'triangle', 0.25); };
const hat = t => noise(t, 0.05, 7000, 0.25);

// Only one demo plays at a time
let stopCurrent = null;
function stopAll() { if (stopCurrent) stopCurrent(); stopCurrent = null; }

function loopDemo(btn, labelKey, stepSec, steps, onStep, onVisual) {
  if (btn.classList.contains('playing')) { stopAll(); return; }
  stopAll();
  const a = audio();
  let i = 0, next = a.currentTime + 0.05, timer, live = true;
  const tick = () => {
    while (next < a.currentTime + 0.12) {
      onStep(i % steps, next);
      const step = i % steps, wait = (next - a.currentTime) * 1000;
      setTimeout(() => { if (live && onVisual) onVisual(step); }, Math.max(0, wait));
      next += stepSec; i++;
    }
  };
  tick();
  timer = setInterval(tick, 25);
  btn.classList.add('playing'); btn.textContent = t('theory.stop');
  stopCurrent = () => {
    clearInterval(timer);
    live = false;
    btn.classList.remove('playing'); btn.textContent = t(labelKey);
    onVisual && onVisual(-1);
  };
}

// Tempo click
let bpm = 90;
document.querySelectorAll('[data-bpm]').forEach(c => c.onclick = () => {
  document.querySelectorAll('[data-bpm]').forEach(x => x.classList.toggle('on', x === c));
  bpm = +c.dataset.bpm;
  const btn = document.getElementById('click-play');
  if (btn.classList.contains('playing')) { stopAll(); btn.click(); }
});
document.getElementById('click-play').onclick = e =>
  loopDemo(e.currentTarget, 'theory.playClick', 60 / bpm, 4, (s, t) => tone(s === 0 ? 1500 : 1000, t, 0.06, 'square', 0.15));

// Rock beat: 8 eighth notes at 90 BPM, columns light up as they play
const grid = document.getElementById('beat-grid');
const cols = [...Array(8)].map((_, i) => [...grid.children].filter((c, idx) => idx % 9 === i + 1));
document.getElementById('beat-play').onclick = e =>
  loopDemo(e.currentTarget, 'theory.playBeat', 60 / 90 / 2, 8,
    (s, t) => { hat(t); if (s === 2 || s === 6) snare(t); if (s === 0 || s === 4) kick(t); },
    s => cols.forEach((col, i) => col.forEach(c => c.classList.toggle('now', i === s))));

// Scale keys
const keys = [...document.querySelectorAll('#keys button')];
function flash(k) { k.classList.add('now'); setTimeout(() => k.classList.remove('now'), 380); }
keys.forEach(k => k.onclick = () => { tone(+k.dataset.f, audio().currentTime, 0.8, 'triangle', 0.35); flash(k); });
document.getElementById('scale-play').onclick = () => {
  stopAll();
  const a = audio(), start = a.currentTime + 0.05;
  keys.forEach((k, i) => {
    tone(+k.dataset.f, start + i * 0.42, 0.7, 'triangle', 0.35);
    setTimeout(() => flash(k), i * 420 + 50);
  });
};

// Stop sounds when a lesson is closed or the page is hidden
lessons.forEach(l => l.addEventListener('toggle', () => { if (!l.open) stopAll(); }));
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });

// Language switch: re-translate what JavaScript wrote
document.addEventListener('langchange', () => {
  renderMeta();
  renderProgress();
  doneSyncs.forEach(f => f());
  document.querySelectorAll('.primary.playing').forEach(b => { b.textContent = t('theory.stop'); });
});
