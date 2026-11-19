// Record a short clip (up to a minute) to attach to a practice session, and play clips back.
// Used by the practice page and the timer page. Recordings are private to their owner.
const CLIP_MAX_SEC = 60;

// Best format this browser can record: Opus in WebM (Chrome, Firefox, Edge) or AAC in MP4 (Safari)
function clipMime() {
  if (!window.MediaRecorder) return null;
  return ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
    .find(m => MediaRecorder.isTypeSupported(m)) || '';
}

// Builds the recorder inside `box`. Returns { blob(), clear(), stop(), recording() };
// stop() resolves once the clip is ready.
function createRecorder(box) {
  let blob = null, rec = null, stream = null, timer = null, startedAt = 0, url = null, error = '';
  let waiting = [], discard = false;

  function render() {
    box.innerHTML = '';
    if (clipMime() === null) { box.appendChild(el('p', 'muted rec-note', t('rec.unsupported'))); return; }
    if (rec) {
      const sec = Math.min(CLIP_MAX_SEC, Math.floor((Date.now() - startedAt) / 1000));
      const live = el('div', 'rec-live');
      live.append(el('span', 'rec-dot'), el('span', 'rec-time', `${fmtSec(sec)} / ${fmtSec(CLIP_MAX_SEC)}`));
      const stopBtn = el('button', 'ghost small', t('rec.stop'));
      stopBtn.type = 'button';
      stopBtn.onclick = stop;
      live.appendChild(stopBtn);
      box.appendChild(live);
      return;
    }
    if (blob) {
      const done = el('div', 'rec-done');
      const audio = el('audio');
      audio.controls = true;
      audio.src = url;
      const again = el('button', 'link', t('rec.again'));
      again.type = 'button';
      again.onclick = () => { clear(); start(); };
      const del = el('button', 'link', t('rec.delete'));
      del.type = 'button';
      del.onclick = clear;
      done.append(audio, again, del);
      box.appendChild(done);
      return;
    }
    const startBtn = el('button', 'ghost rec-start');
    startBtn.type = 'button';
    startBtn.append(el('span', 'rec-dot idle'), t('rec.start'));
    startBtn.onclick = start;
    box.append(startBtn, el('span', 'muted rec-note', t('rec.max')));
    if (error) box.appendChild(el('p', 'error rec-error', t(error)));
  }

  async function start() {
    error = '';
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
    } catch {
      error = 'rec.noMic';
      render();
      return;
    }
    const mime = clipMime();
    const chunks = [];
    rec = new MediaRecorder(stream, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 32000 });
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      stream.getTracks().forEach(tr => tr.stop());
      clearInterval(timer);
      blob = chunks.length && !discard ? new Blob(chunks, { type: (rec.mimeType || mime || 'audio/webm') }) : null;
      discard = false;
      if (url) URL.revokeObjectURL(url);
      url = blob ? URL.createObjectURL(blob) : null;
      rec = null;
      render();
      waiting.splice(0).forEach(done => done());
    };
    rec.start();
    startedAt = Date.now();
    timer = setInterval(() => {
      if (Date.now() - startedAt >= CLIP_MAX_SEC * 1000) stop(); else render();
    }, 250);
    render();
  }

  function stop() {
    if (!rec || rec.state === 'inactive') return Promise.resolve();
    return new Promise(done => { waiting.push(done); if (rec.state !== 'inactive') rec.stop(); });
  }

  function clear() {
    if (rec) { discard = true; stop(); }
    blob = null;
    if (url) URL.revokeObjectURL(url);
    url = null;
    error = '';
    render();
  }

  document.addEventListener('langchange', render);
  render();
  return { blob: () => blob, clear, stop, recording: () => !!rec };
}

const fmtSec = s => `${Math.floor(s / 60)}:${pad(s % 60)}`;

// Upload a clip for a saved session. Resolves to the clip version, or 0 if it failed.
async function uploadClip(sessionId, blob) {
  const audio = await new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => ok(''); r.readAsDataURL(blob); });
  const r = await api('PUT', { audio }, '?action=clip&id=' + encodeURIComponent(sessionId));
  return r.status === 200 ? r.data.clip : 0;
}

// One shared player, so only one clip plays at a time. Returns the button for a session row.
let clipPlayer = null, clipPlaying = null;
function clipButton(session) {
  const b = el('button', 'clip-btn');
  b.type = 'button';
  const show = on => {
    b.textContent = on ? '❚❚' : '▶';
    b.classList.toggle('on', on);
    b.setAttribute('aria-label', t(on ? 'rec.pause' : 'rec.play'));
    b.title = t(on ? 'rec.pause' : 'rec.play');
  };
  show(clipPlaying === session.id && clipPlayer && !clipPlayer.paused);
  b.onclick = () => {
    if (clipPlaying === session.id && clipPlayer) {
      if (clipPlayer.paused) clipPlayer.play(); else clipPlayer.pause();
      return;
    }
    if (clipPlayer) clipPlayer.pause();
    clipPlayer = new Audio('/api/sessions?clip=' + encodeURIComponent(session.id) + '&v=' + session.clip);
    clipPlaying = session.id;
    const mine = clipPlayer;
    mine.onplay = () => show(true);
    mine.onpause = mine.onended = () => show(false);
    mine.onerror = () => { show(false); alert(t('rec.playFail')); };
    mine.play().catch(() => {});
  };
  return b;
}
