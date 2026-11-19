// Metronome on the timer page. Clicks are scheduled ahead on the Web Audio clock, so they
// stay steady even when the page is busy. Tempo, beats and "with the timer" are remembered.
// Uses `audio`, `keepAwake` and `running` from timer.js.
const METRO_KEY = 'muza-metronome';
const metro = (() => {
  const base = { bpm: 90, beats: 4, withTimer: false };
  try { return { ...base, ...(JSON.parse(localStorage.getItem(METRO_KEY)) || {}) }; } catch { return base; }
})();
const saveMetro = () => { try { localStorage.setItem(METRO_KEY, JSON.stringify({ bpm: metro.bpm, beats: metro.beats, withTimer: metro.withTimer })); } catch {} };

let metroTimer = null, metroNext = 0, metroBeat = 0;
const metroOn = () => metroTimer !== null;
const clampBpm = v => Math.min(240, Math.max(30, Math.round(v) || 90));

// Classic tempo names, same in every language
function tempoName(bpm) {
  return bpm < 60 ? 'Largo' : bpm < 76 ? 'Adagio' : bpm < 108 ? 'Andante' : bpm < 120 ? 'Moderato'
    : bpm < 168 ? 'Allegro' : bpm < 200 ? 'Presto' : 'Prestissimo';
}

function metroClick(when, accent) {
  const o = audio.createOscillator(), g = audio.createGain();
  o.type = 'square'; o.frequency.value = accent ? 1500 : 1000;
  g.gain.setValueAtTime(accent ? 0.16 : 0.1, when);
  g.gain.exponentialRampToValueAtTime(0.001, when + 0.05);
  o.connect(g).connect(audio.destination);
  o.start(when); o.stop(when + 0.06);
}

function lightBeat(beat) {
  [...$('metro-dots').children].forEach((d, i) => d.classList.toggle('on', i === beat));
}

// Schedule every click due soon. Background tabs only wake up about once a second,
// so look further ahead there.
function metroSchedule() {
  const ahead = document.hidden ? 1.5 : 0.12;
  while (metroNext < audio.currentTime + ahead) {
    const beat = metroBeat % metro.beats;
    metroClick(metroNext, beat === 0);
    setTimeout(() => { if (metroOn()) lightBeat(beat); }, Math.max(0, (metroNext - audio.currentTime) * 1000));
    metroNext += 60 / metro.bpm;
    metroBeat++;
  }
}

function metroStart() {
  if (metroOn()) return;
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
  if (audio.state === 'suspended') audio.resume();
  metroBeat = 0;
  metroNext = audio.currentTime + 0.06;
  metroSchedule();
  metroTimer = setInterval(metroSchedule, 25);
  keepAwake(true);
  renderMetro();
}
function metroStop() {
  if (!metroOn()) return;
  clearInterval(metroTimer);
  metroTimer = null;
  lightBeat(-1);
  if (!running()) keepAwake(false);
  renderMetro();
}

function setBpm(v) {
  metro.bpm = clampBpm(v);
  saveMetro();
  renderMetro();
}
function setBeats(n) {
  metro.beats = n;
  metroBeat = 0;
  saveMetro();
  renderMetro();
}

function renderMetro() {
  $('metro-bpm').textContent = metro.bpm;
  $('metro-name').textContent = tempoName(metro.bpm);
  $('metro-range').value = metro.bpm;
  $('metro-with-timer').checked = metro.withTimer;
  document.querySelectorAll('[data-beats]').forEach(c => c.classList.toggle('on', +c.dataset.beats === metro.beats));
  const dots = $('metro-dots');
  if (dots.children.length !== metro.beats) {
    dots.innerHTML = '';
    for (let i = 0; i < metro.beats; i++) dots.appendChild(el('span', i === 0 ? 'accent' : null));
  }
  const play = $('metro-play');
  play.textContent = metroOn() ? t('metro.stop') : t('metro.start');
  play.classList.toggle('paused', metroOn());
}

// Tap tempo: the average gap between the last few taps
let taps = [];
$('metro-tap').onclick = () => {
  const now = performance.now();
  taps = taps.filter(x => now - x < 2500).concat(now).slice(-6);
  if (taps.length >= 2) setBpm(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
};

$('metro-play').onclick = () => (metroOn() ? metroStop() : metroStart());
$('metro-down').onclick = () => setBpm(metro.bpm - 1);
$('metro-up').onclick = () => setBpm(metro.bpm + 1);
$('metro-range').addEventListener('input', e => setBpm(+e.target.value));
document.querySelectorAll('[data-beats]').forEach(c => { c.onclick = () => setBeats(+c.dataset.beats); });
$('metro-with-timer').onchange = e => { metro.withTimer = e.target.checked; saveMetro(); };
// Space bar starts / stops the metronome when nothing else is focused
document.addEventListener('keydown', e => {
  if (e.code !== 'Space' || e.target.closest('input, textarea, button, select, a')) return;
  e.preventDefault();
  metroOn() ? metroStop() : metroStart();
});
document.addEventListener('langchange', renderMetro);
renderMetro();
