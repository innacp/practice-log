// Theory page: renders the lessons from lessons.js, the interactive piano,
// the metronome, level filters and "done" ticks (saved in this browser).
const DONE_KEY = 'practice-log-theory-done';
const LESSONS_CACHE = 'practice-log-lessons-cache';

// Lessons: edits saved in the admin panel win; otherwise the built-in lessons-1/2/3.js.
// The last downloaded version is cached so the page doesn't flash the old text first.
let lessonData = (() => {
  try { const c = JSON.parse(localStorage.getItem(LESSONS_CACHE)); if (Array.isArray(c) && c.length) return c; } catch {}
  return window.LESSONS;
})();
fetch('/api/lessons').then(r => (r.ok ? r.json() : null)).then(d => {
  if (!d) return;
  const next = Array.isArray(d.lessons) && d.lessons.length ? d.lessons : window.LESSONS;
  try { d.lessons ? localStorage.setItem(LESSONS_CACHE, JSON.stringify(d.lessons)) : localStorage.removeItem(LESSONS_CACHE); } catch {}
  if (JSON.stringify(next) !== JSON.stringify(lessonData)) { lessonData = next; render(); }
}).catch(() => {});
const LEVELS = ['beginner', 'intermediate', 'advanced'];

function loadDone() { try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY)) || []); } catch { return new Set(); } }
function saveDone() { try { localStorage.setItem(DONE_KEY, JSON.stringify([...done])); } catch {} }
let done = loadDone();
let filter = 'all';

// ---------------------------------------------------------------- sound
let ctx;
function audio() {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
// A soft piano-like tone: a few partials with a quick attack and long decay
function pianoNote(freqHz, when, dur = 1.2, vol = 0.22) {
  const a = audio(), g = a.createGain(), f = a.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = Math.min(6000, freqHz * 6);
  g.gain.setValueAtTime(0, when);
  g.gain.linearRampToValueAtTime(vol, when + 0.008);
  g.gain.exponentialRampToValueAtTime(vol * 0.35, when + 0.25);
  g.gain.exponentialRampToValueAtTime(0.0008, when + dur);
  [[1, 'triangle', 1], [2, 'sine', 0.35], [3, 'sine', 0.12]].forEach(([mult, type, lvl]) => {
    const o = a.createOscillator(), og = a.createGain();
    o.type = type; o.frequency.value = freqHz * mult; og.gain.value = lvl;
    o.connect(og).connect(f);
    o.start(when); o.stop(when + dur + 0.05);
  });
  f.connect(g).connect(a.destination);
}
function click(when, accent) {
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.type = 'square'; o.frequency.value = accent ? 1500 : 1000;
  g.gain.setValueAtTime(0.12, when); g.gain.exponentialRampToValueAtTime(0.001, when + 0.05);
  o.connect(g).connect(a.destination); o.start(when); o.stop(when + 0.06);
}

// ---------------------------------------------------------------- notes
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const LETTER = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const BLACK = new Set([1, 3, 6, 8, 10]);
// "C4" -> 60, "F#3" -> 54, "Bb4" -> 70
function midi(name) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(name.trim());
  if (!m) return null;
  return 12 * (+m[3] + 1) + LETTER[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
}
const freqOf = n => 440 * Math.pow(2, (n - 69) / 12);

// One sound/demo at a time
let stopCurrent = null;
function stopAll() { if (stopCurrent) stopCurrent(); stopCurrent = null; }

// ---------------------------------------------------------------- piano widget
// <div class="pw" data-notes="C4 E4 G4 | F4 A4 C5" data-mode="seq|chord|both|prog"
//      data-labels="1 3 5" data-range="C4-B4" data-caption="..."></div>
function buildPiano(box) {
  const groups = (box.dataset.notes || '').split('|')
    .map(g => g.trim().split(/\s+/).filter(Boolean).map(midi).filter(n => n != null))
    .filter(g => g.length);
  const all = groups.flat();
  const mode = box.dataset.mode || 'seq';
  const labels = (box.dataset.labels || '').split(/\s+/).filter(Boolean);

  // Range: whole octaves around the notes, at least one octave
  let lo, hi;
  if (box.dataset.range) [lo, hi] = box.dataset.range.split('-').map(midi);
  else if (all.length) {
    // a little room around the notes, and always at least one full octave visible
    lo = Math.min(...all) - 2;
    hi = Math.max(Math.max(...all) + 2, lo + 12);
  } else { lo = 60; hi = 71; }
  if (BLACK.has(lo % 12)) lo--;
  if (BLACK.has(hi % 12)) hi++;

  const kb = el('div', 'kb');
  const whites = [];
  for (let n = lo; n <= hi; n++) if (!BLACK.has(n % 12)) whites.push(n);
  kb.style.setProperty('--whites', whites.length);
  const keyEls = {};
  const octave = n => Math.floor(n / 12) - 1;
  whites.forEach(n => {
    const k = el('button', 'key white');
    k.type = 'button';
    k.setAttribute('aria-label', NAMES[n % 12] + octave(n));
    k.append(el('span', 'kname' + (n % 12 === 0 ? ' c' : ''), NAMES[n % 12] + (n % 12 === 0 ? octave(n) : '')));
    kb.appendChild(k); keyEls[n] = k;
  });
  for (let n = lo; n <= hi; n++) {
    if (!BLACK.has(n % 12)) continue;
    const leftWhite = whites.indexOf(n - 1);
    const k = el('button', 'key black');
    k.type = 'button';
    k.setAttribute('aria-label', NAMES[n % 12] + octave(n));
    k.style.left = `calc(${leftWhite + 1} * 100% / var(--whites) - var(--bw) / 2)`;
    kb.appendChild(k); keyEls[n] = k;
  }
  // Mark the notes this example is about, with optional labels under them
  all.forEach(n => keyEls[n] && keyEls[n].classList.add('mark'));
  if (labels.length && groups[0]) groups[0].forEach((n, i) => {
    if (keyEls[n] && labels[i]) keyEls[n].appendChild(el('span', 'klabel', labels[i].replace(/_/g, ' ')));
  });
  const flash = (n, ms = 450) => {
    const k = keyEls[n]; if (!k) return;
    k.classList.add('on'); setTimeout(() => k.classList.remove('on'), ms);
  };
  Object.entries(keyEls).forEach(([n, k]) => { k.onclick = () => { pianoNote(freqOf(+n), audio().currentTime); flash(+n); }; });

  box.innerHTML = '';
  const scroll = el('div', 'kb-scroll');
  scroll.appendChild(kb);
  box.appendChild(scroll);

  if (all.length) {
    const row = el('div', 'pw-row');
    const btn = el('button', 'primary small pw-play');
    btn.type = 'button';
    const label = () => t(mode === 'chord' ? 'theory.playChord' : mode === 'prog' ? 'theory.playProg' : 'theory.play');
    btn.textContent = '▶ ' + label();
    btn.onclick = () => {
      if (btn.classList.contains('playing')) { stopAll(); return; }
      stopAll();
      const a = audio();
      let at = a.currentTime + 0.05;
      const timers = [];
      const schedule = (n, when, dur, ms) => {
        pianoNote(freqOf(n), when, dur);
        timers.push(setTimeout(() => flash(n, ms), (when - a.currentTime) * 1000));
      };
      if (mode === 'chord') groups.forEach(g => { g.forEach(n => schedule(n, at, 2, 900)); at += 1.3; });
      else if (mode === 'prog') groups.forEach(g => { g.forEach(n => schedule(n, at, 1.4, 850)); at += 1.0; });
      else {
        groups.forEach(g => { g.forEach(n => { schedule(n, at, 1, 380); at += 0.42; }); at += 0.25; });
        if (mode === 'both') { all.forEach(n => schedule(n, at, 2, 900)); at += 1.4; }
      }
      btn.classList.add('playing');
      btn.textContent = '■ ' + t('theory.stop');
      const end = setTimeout(() => stopAll(), (at - a.currentTime) * 1000 + 300);
      stopCurrent = () => {
        timers.forEach(clearTimeout); clearTimeout(end);
        btn.classList.remove('playing');
        btn.textContent = '▶ ' + label();
        Object.values(keyEls).forEach(k => k.classList.remove('on'));
      };
    };
    row.appendChild(btn);
    if (box.dataset.caption) row.appendChild(el('span', 'pw-cap', box.dataset.caption));
    box.appendChild(row);
  }
  // Keep the interesting part in view on narrow screens
  requestAnimationFrame(() => {
    const first = all.length ? keyEls[Math.min(...all)] : null;
    if (first && scroll.scrollWidth > scroll.clientWidth) scroll.scrollLeft = Math.max(0, first.offsetLeft - 20);
  });
}

// ---------------------------------------------------------------- metronome widget
function buildMetro(box) {
  let bpm = +(box.dataset.bpm || 90);
  const beats = +(box.dataset.beats || 4);
  box.innerHTML = '';
  const dots = el('div', 'metro-dots');
  for (let i = 0; i < beats; i++) dots.appendChild(el('span', null, String(i + 1)));
  const row = el('div', 'demo-row');
  const btn = el('button', 'primary small');
  [60, 90, 120].forEach(v => {
    const c = el('button', 'chip' + (v === bpm ? ' on' : ''), String(v));
    c.type = 'button';
    c.onclick = () => {
      bpm = v;
      row.querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === c));
      if (btn.classList.contains('playing')) { stopAll(); btn.click(); }
    };
    row.appendChild(c);
  });
  row.appendChild(el('span', 'muted', 'BPM'));
  btn.type = 'button';
  btn.textContent = '▶ ' + t('theory.playClick');
  btn.onclick = () => {
    if (btn.classList.contains('playing')) { stopAll(); return; }
    stopAll();
    const a = audio();
    let i = 0, next = a.currentTime + 0.05, live = true;
    const tick = () => {
      while (next < a.currentTime + 0.12) {
        const beat = i % beats, wait = (next - a.currentTime) * 1000;
        click(next, beat === 0);
        setTimeout(() => { if (live) [...dots.children].forEach((d, j) => d.classList.toggle('on', j === beat)); }, Math.max(0, wait));
        next += 60 / bpm; i++;
      }
    };
    tick();
    const timer = setInterval(tick, 25);
    btn.classList.add('playing');
    btn.textContent = '■ ' + t('theory.stop');
    stopCurrent = () => {
      live = false; clearInterval(timer);
      btn.classList.remove('playing');
      btn.textContent = '▶ ' + t('theory.playClick');
      [...dots.children].forEach(d => d.classList.remove('on'));
    };
  };
  row.appendChild(btn);
  box.append(dots, row);
}

// ---------------------------------------------------------------- lessons
const list = document.getElementById('lessons');
const openIds = new Set(location.hash ? [location.hash.slice(1)] : []);

function render() {
  stopAll();
  // remember which lessons are open so re-rendering (language switch, ticks) keeps them open
  list.querySelectorAll('details').forEach(d => { d.open ? openIds.add(d.id) : openIds.delete(d.id); });
  list.innerHTML = '';
  let num = 0;
  LEVELS.forEach((level, li) => {
    const lessons = lessonData.filter(l => l.level === level);
    const doneN = lessons.filter(l => done.has(l.id)).length;
    const hidden = filter !== 'all' && filter !== level;

    const head = el('div', 'level-head lv-' + level);
    head.hidden = hidden;
    const txt = el('div', 'level-text');
    txt.append(el('h2', null, t('level.' + level)), el('p', 'muted', t('level.' + level + '.desc')));
    const prog = el('div', 'level-prog');
    const bar = el('div', 'lp-bar'); const fill = el('span');
    fill.style.width = (doneN / lessons.length * 100) + '%';
    bar.appendChild(fill);
    prog.append(bar, el('span', 'muted', `${doneN}/${lessons.length}`));
    head.append(el('span', 'level-badge', String(li + 1)), txt, prog);
    list.appendChild(head);

    lessons.forEach(l => {
      num++;
      const d = el('details', 'card lesson lv-' + level + (done.has(l.id) ? ' is-done' : ''));
      d.id = l.id;
      d.hidden = hidden;
      if (openIds.has(l.id)) d.open = true;
      const sum = el('summary');
      const title = el('span', 'l-title', l.title[LANG]);
      title.appendChild(el('small', null, `${t('level.' + level)} · ${t('l.min', { n: l.mins })}`));
      sum.append(el('span', 'l-num', String(num)), title, el('span', 'l-done'));
      const body = el('div', 'l-body');
      body.innerHTML = l.body[LANG];
      const btn = el('button', 'ghost mark-done', done.has(l.id) ? t('theory.done') : t('theory.mark'));
      btn.type = 'button';
      btn.setAttribute('aria-pressed', done.has(l.id));
      btn.onclick = () => {
        const was = done.has(l.id);
        was ? done.delete(l.id) : done.add(l.id);
        saveDone();
        if (!was) confetti(btn);
        render();
      };
      body.appendChild(btn);
      d.append(sum, body);
      // Pianos and metronomes are built the first time a lesson opens
      const build = () => {
        body.querySelectorAll('.pw:not(.built)').forEach(p => { buildPiano(p); p.classList.add('built'); });
        body.querySelectorAll('.metro:not(.built)').forEach(m => { buildMetro(m); m.classList.add('built'); });
      };
      if (d.open) build();
      d.addEventListener('toggle', () => { if (d.open) build(); else stopAll(); });
      list.appendChild(d);
    });
  });

  const total = lessonData.length, n = lessonData.filter(l => done.has(l.id)).length;
  document.getElementById('lp-fill').style.width = (n / total * 100) + '%';
  document.getElementById('lp-text').textContent = n === total ? t('theory.allDone', { n }) : t('theory.progress', { n, total });
}

const chips = document.querySelectorAll('.theory-intro .chip');
chips.forEach(c => c.onclick = () => {
  chips.forEach(x => x.classList.toggle('on', x === c));
  filter = c.dataset.filter;
  render();
});

document.addEventListener('langchange', render);
document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
render();
if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) setTimeout(() => target.scrollIntoView({ block: 'start' }), 50);
}
