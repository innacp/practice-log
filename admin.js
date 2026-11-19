// Admin panel for the theory lessons.
// Loads the saved lessons (or the built-in ones), lets you edit them visually in
// English and Ukrainian, and saves the whole list to /api/lessons (admin account only).
const $ = id => document.getElementById(id);
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const LEVEL_NAMES = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const clone = x => JSON.parse(JSON.stringify(x));

let lessons = [];       // working copy
let savedJSON = '';     // what is published right now
let current = 0;        // index into lessons
let edLang = 'en';      // language being edited
let htmlMode = false;   // raw HTML textarea instead of the visual editor

// ------------------------------------------------------------------ messages
function message(text, kind) {
  const m = $('admin-msg');
  m.textContent = text;
  m.className = 'card admin-msg ' + (kind || '');
  m.hidden = !text;
}

// ------------------------------------------------------------------ sign in + load
async function load() {
  const r = await api('GET', null, '', '/api/lessons');
  if (r.status === 503 || r.status === 404 || r.status === 0) {
    $('admin-lock').hidden = true;
    message(r.status === 503
      ? 'The online database is not set up in Vercel yet, so lessons can’t be saved.'
      : 'The admin panel only works on the live site (it needs the online database).', 'warn');
    return;
  }
  if (r.status !== 200 || !r.data) { message('Could not load lessons. Try reloading the page.', 'err'); return; }
  if (!r.data.admin) {
    await authReady;
    $('admin-app').hidden = true;
    $('save-bar').hidden = true;
    $('admin-lock').hidden = false;
    if (currentUser()) $('admin-lock-text').textContent = 'You are logged in as ' + currentUser().name + ', which is not the admin account. Log in with the admin account to edit lessons.';
    return;
  }
  lessons = clone(r.data.lessons || window.LESSONS);
  savedJSON = JSON.stringify(lessons);
  usingBuiltIn = !r.data.lessons;
  $('admin-lock').hidden = true;
  message('');
  $('admin-app').hidden = false;
  $('admin-tabs').hidden = false;
  $('save-bar').hidden = false;
  current = 0;
  renderList();
  openLesson(0);
  updateSaveState();
}
let usingBuiltIn = true;


// ------------------------------------------------------------------ lesson list
function renderList() {
  const box = $('lesson-list');
  box.innerHTML = '';
  let n = 0;
  LEVELS.forEach(level => {
    const group = el('div', 'al-group');
    const head = el('div', 'al-head lv-' + level);
    head.append(el('span', 'level-badge', String(LEVELS.indexOf(level) + 1)), el('b', null, LEVEL_NAMES[level]));
    group.appendChild(head);
    lessons.forEach((l, i) => {
      if (l.level !== level) return;
      n++;
      const b = el('button', 'al-item' + (i === current ? ' on' : ''));
      b.type = 'button';
      b.append(el('span', 'al-num', String(n)), el('span', 'al-title', l.title.en || '(untitled)'));
      b.onclick = () => { syncEditor(); openLesson(i); };
      group.appendChild(b);
    });
    const add = el('button', 'al-add', '+ Add lesson');
    add.type = 'button';
    add.onclick = () => addLesson(level);
    group.appendChild(add);
    box.appendChild(group);
  });
  $('lesson-count').textContent = `${lessons.length} lessons`;
}

function addLesson(level) {
  syncEditor();
  let k = 1;
  while (lessons.some(l => l.id === `new-lesson-${k}`)) k++;
  const lesson = {
    id: `new-lesson-${k}`, level, mins: 5,
    title: { en: 'New lesson', uk: 'Новий урок' },
    body: { en: '<p>Write your lesson here.</p>', uk: '<p>Напишіть урок тут.</p>' },
  };
  // put it after the last lesson of that level
  let at = -1;
  lessons.forEach((l, i) => { if (l.level === level) at = i; });
  if (at < 0) at = LEVELS.indexOf(level) === 0 ? -1 : lessons.length - 1;
  lessons.splice(at + 1, 0, lesson);
  openLesson(at + 1);
  renderList();
  updateSaveState();
  $('f-title').select();
}

// ------------------------------------------------------------------ editor <-> data
// Piano and metronome examples are stored as <div class="pw" data-...> / <div class="metro" ...>.
// In the editor they become non-editable "chips" you can click to change.
function chipLabel(kind, d) {
  if (kind === 'metro') return `⏱ Metronome · ${d.bpm || 90} BPM · ${d.beats || 4} beats`;
  const modes = { seq: 'one by one', chord: 'together', both: 'one by one + together', prog: 'chord after chord' };
  if (!d.notes) return `🎹 Keyboard to play freely${d.range ? ' · ' + d.range.replace('-', '–') : ''}`;
  return `🎹 Piano · ${d.notes} · ${modes[d.mode || 'seq']}${d.caption ? ' · “' + d.caption + '”' : ''}`;
}
function makeChip(kind, d) {
  const c = el('div', 'w-chip', chipLabel(kind, d));
  c.contentEditable = 'false';
  c.dataset.kind = kind;
  c.dataset.attrs = JSON.stringify(d);
  c.title = 'Click to edit';
  return c;
}
function toEditor(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll('.pw, .metro').forEach(w => {
    const kind = w.classList.contains('metro') ? 'metro' : 'pw';
    const d = { ...w.dataset };
    w.replaceWith(makeChip(kind, d));
  });
  return tpl.innerHTML;
}
function fromEditor(html) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  tpl.content.querySelectorAll('.w-chip').forEach(c => {
    const d = JSON.parse(c.dataset.attrs || '{}');
    const w = document.createElement('div');
    w.className = c.dataset.kind === 'metro' ? 'metro' : 'pw';
    Object.entries(d).forEach(([k, v]) => { if (v !== '' && v != null) w.dataset[k] = v; });
    c.replaceWith(w);
  });
  return tpl.innerHTML.replace(/<p><br><\/p>/g, '').trim();
}

function openLesson(i) {
  current = Math.max(0, Math.min(i, lessons.length - 1));
  const l = lessons[current];
  $('f-level').value = l.level;
  $('f-mins').value = l.mins;
  $('f-id').value = l.id;
  fillLang();
  document.querySelectorAll('.al-item').forEach(b => b.classList.remove('on'));
  renderList();
}
function fillLang() {
  const l = lessons[current];
  $('f-title').value = l.title[edLang];
  $('f-body').innerHTML = toEditor(l.body[edLang]);
  $('f-html').value = l.body[edLang];
}
// Copy what's on screen back into the data
function syncEditor() {
  const l = lessons[current];
  if (!l) return;
  l.title[edLang] = $('f-title').value;
  l.body[edLang] = htmlMode ? $('f-html').value : fromEditor($('f-body').innerHTML);
  l.mins = Math.max(1, Math.min(120, parseInt($('f-mins').value, 10) || 5));
  const newLevel = $('f-level').value;
  if (newLevel !== l.level) {
    // move to the end of the new level
    lessons.splice(current, 1);
    l.level = newLevel;
    let at = -1;
    lessons.forEach((x, j) => { if (x.level === newLevel) at = j; });
    if (at < 0) at = LEVELS.indexOf(newLevel) === 0 ? -1 : lessons.length - 1;
    lessons.splice(at + 1, 0, l);
    current = at + 1;
  }
}

// ------------------------------------------------------------------ field events
['f-title', 'f-mins'].forEach(id => $(id).addEventListener('input', () => { syncEditor(); updateSaveState(); if (id === 'f-title') renderList(); }));
$('f-level').addEventListener('change', () => { syncEditor(); renderList(); updateSaveState(); });
$('f-body').addEventListener('input', () => { syncEditor(); updateSaveState(); });
$('f-html').addEventListener('input', () => { syncEditor(); updateSaveState(); });
$('f-id').addEventListener('change', () => {
  const v = $('f-id').value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  if (!v || lessons.some((l, i) => i !== current && l.id === v)) {
    alert('That link name is empty or already used by another lesson.');
    $('f-id').value = lessons[current].id;
    return;
  }
  lessons[current].id = v;
  $('f-id').value = v;
  updateSaveState();
});

document.querySelectorAll('[data-edlang]').forEach(b => b.onclick = () => {
  syncEditor();
  edLang = b.dataset.edlang;
  document.querySelectorAll('[data-edlang]').forEach(x => x.classList.toggle('on', x === b));
  fillLang();
});

// ------------------------------------------------------------------ toolbar
const body = $('f-body');
let savedRange = null;
function rememberSelection() {
  const s = getSelection();
  if (s.rangeCount && body.contains(s.anchorNode)) savedRange = s.getRangeAt(0).cloneRange();
}
document.addEventListener('selectionchange', rememberSelection);
function restoreSelection() {
  body.focus();
  if (savedRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(savedRange); }
}
function insertHTML(html) {
  restoreSelection();
  document.execCommand('insertHTML', false, html);
  syncEditor(); updateSaveState();
}
function insertNode(node) {
  restoreSelection();
  const s = getSelection();
  if (!s.rangeCount || !body.contains(s.anchorNode)) { body.appendChild(node); }
  else {
    const r = s.getRangeAt(0);
    // put block widgets after the current paragraph, not inside it
    let block = r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement;
    while (block && block.parentElement !== body) block = block.parentElement;
    if (block) block.after(node); else body.appendChild(node);
  }
  syncEditor(); updateSaveState();
}

document.querySelectorAll('.ed-toolbar button').forEach(b => {
  b.addEventListener('mousedown', e => e.preventDefault()); // keep the text selection
  b.onclick = () => {
    const cmd = b.dataset.cmd;
    if (cmd === 'html') return toggleHTML();
    if (htmlMode) { alert('Switch back from HTML mode to use the formatting buttons.'); return; }
    restoreSelection();
    if (cmd === 'h3') document.execCommand('formatBlock', false, 'h3');
    else if (cmd === 'p') document.execCommand('formatBlock', false, 'p');
    else if (cmd === 'bold') document.execCommand('bold');
    else if (cmd === 'italic') document.execCommand('italic');
    else if (cmd === 'ul') document.execCommand('insertUnorderedList');
    else if (cmd === 'ol') document.execCommand('insertOrderedList');
    else if (cmd === 'tip') insertHTML(`<p class="tip"><b>${edLang === 'uk' ? 'Порада:' : 'Practice tip:'}</b> …</p>`);
    else if (cmd === 'keyidea') insertHTML(`<div class="key-idea"><b>${edLang === 'uk' ? 'Головне:' : 'Key idea:'}</b> …</div>`);
    else if (cmd === 'piano') openWidget('pw');
    else if (cmd === 'metro') openWidget('metro');
    syncEditor(); updateSaveState();
  };
});

function toggleHTML() {
  syncEditor();
  htmlMode = !htmlMode;
  $('f-html').value = lessons[current].body[edLang];
  if (!htmlMode) $('f-body').innerHTML = toEditor(lessons[current].body[edLang]);
  $('f-html').hidden = !htmlMode;
  $('f-body').hidden = htmlMode;
  $('html-toggle').classList.toggle('on', htmlMode);
}

// Click a chip to edit it
body.addEventListener('click', e => {
  const chip = e.target.closest('.w-chip');
  if (chip) openWidget(chip.dataset.kind, chip);
});

// ------------------------------------------------------------------ piano / metronome dialog
const dlg = $('w-dialog');
let editingChip = null, dlgKind = 'pw', dlgRange = '';
function openWidget(kind, chip) {
  dlgKind = kind;
  editingChip = chip || null;
  const d = chip ? JSON.parse(chip.dataset.attrs || '{}') : {};
  $('w-title').textContent = kind === 'metro' ? 'Metronome' : 'Piano example';
  $('w-piano-fields').hidden = kind === 'metro';
  $('w-metro-fields').hidden = kind !== 'metro';
  $('w-notes').required = kind !== 'metro' && !d.range;
  dlgRange = d.range || '';
  $('w-notes').value = d.notes || '';
  $('w-mode').value = d.mode || 'seq';
  $('w-labels').value = d.labels || '';
  $('w-caption').value = d.caption || '';
  $('w-bpm').value = d.bpm || '90';
  $('w-beats').value = d.beats || '4';
  $('w-remove').hidden = !chip;
  $('w-ok').textContent = chip ? 'Update' : 'Insert';
  dlg.showModal();
  (kind === 'metro' ? $('w-bpm') : $('w-notes')).focus();
}
$('w-cancel').onclick = () => dlg.close();
$('w-remove').onclick = () => { if (editingChip) { editingChip.remove(); syncEditor(); updateSaveState(); } dlg.close(); };
$('w-form').addEventListener('submit', e => {
  e.preventDefault();
  let d;
  if (dlgKind === 'metro') {
    d = { bpm: $('w-bpm').value, beats: String(Math.max(2, Math.min(12, parseInt($('w-beats').value, 10) || 4))) };
  } else {
    const notes = $('w-notes').value.trim().replace(/\s+/g, ' ');
    const bad = notes.split(/[\s|]+/).filter(Boolean).filter(n => !/^[A-Ga-g](#|b)?[0-8]$/.test(n));
    if (bad.length) { alert('These don’t look like notes: ' + bad.join(', ') + '\nUse a letter, optional # or b, and an octave number, like C4, F#3 or Bb4.'); return; }
    d = { notes: notes.replace(/(^|[\s|])([a-g])/g, (m, a, b) => a + b.toUpperCase()), mode: $('w-mode').value };
    if ($('w-labels').value.trim()) d.labels = $('w-labels').value.trim();
    if ($('w-caption').value.trim()) d.caption = $('w-caption').value.trim();
    if (dlgRange) d.range = dlgRange;            // keep a fixed keyboard size if the example had one
    if (!notes) delete d.notes;
  }
  const chip = makeChip(dlgKind, d);
  if (editingChip) { editingChip.replaceWith(chip); syncEditor(); updateSaveState(); }
  else insertNode(chip);
  dlg.close();
});

// ------------------------------------------------------------------ reorder / delete
function move(dir) {
  syncEditor();
  const l = lessons[current];
  let j = current + dir;
  while (j >= 0 && j < lessons.length && lessons[j].level !== l.level) j += dir;
  if (j < 0 || j >= lessons.length) return;
  [lessons[current], lessons[j]] = [lessons[j], lessons[current]];
  current = j;
  renderList(); updateSaveState();
}
$('move-up').onclick = () => move(-1);
$('move-down').onclick = () => move(1);
$('delete-lesson').onclick = () => {
  if (lessons.length <= 1) { alert('Keep at least one lesson.'); return; }
  if (!confirm(`Delete “${lessons[current].title.en}”? It disappears from the site when you save.`)) return;
  lessons.splice(current, 1);
  openLesson(Math.min(current, lessons.length - 1));
  updateSaveState();
};

// ------------------------------------------------------------------ save bar
function dirty() { return JSON.stringify(lessons) !== savedJSON; }
function updateSaveState() {
  const d = dirty();
  $('save-state').textContent = d ? 'Unsaved changes' : usingBuiltIn ? 'Showing the original lessons' : 'All changes published';
  $('save-state').className = d ? 'dirty' : '';
  $('save').disabled = !d;
  $('discard').disabled = !d;
}
$('save').onclick = async () => {
  syncEditor();
  const missing = lessons.find(l => !l.title.en.trim() || !l.title.uk.trim());
  if (missing) { alert('Every lesson needs a title in both English and Ukrainian.'); return; }
  $('save').disabled = true;
  $('save-state').textContent = 'Saving…';
  const r = await api('PUT', { lessons }, '', '/api/lessons');
  if (r.status === 200) {
    savedJSON = JSON.stringify(lessons);
    usingBuiltIn = false;
    updateSaveState();
    confetti($('save'));
  } else if (r.status === 401 || r.status === 403) {
    alert('You are no longer logged in as admin. Log in again in another tab, then press Save again (your edits are still here).');
    updateSaveState();
  } else {
    alert('Saving failed' + (r.data && r.data.error ? ` (${r.data.error})` : '') + '. Your edits are still here; try again.');
    updateSaveState();
  }
};
$('discard').onclick = () => {
  if (!confirm('Throw away all unsaved changes?')) return;
  lessons = JSON.parse(savedJSON);
  openLesson(Math.min(current, lessons.length - 1));
  updateSaveState();
};
$('reset-all').onclick = async () => {
  if (!confirm('Go back to the original built-in lessons? All your published edits will be removed from the site.')) return;
  const r = await api('DELETE', null, '', '/api/lessons');
  if (r.status !== 200) { alert('Reset failed. Try again.'); return; }
  lessons = clone(window.LESSONS);
  savedJSON = JSON.stringify(lessons);
  usingBuiltIn = true;
  openLesson(0);
  updateSaveState();
};
window.addEventListener('beforeunload', e => { if (lessons.length && dirty()) { e.preventDefault(); e.returnValue = ''; } });


// ------------------------------------------------------------------ users
let users = [];
function showPane(pane) {
  document.querySelectorAll('#admin-tabs button').forEach(b => {
    const on = b.dataset.pane === pane;
    b.classList.toggle('on', on); b.setAttribute('aria-selected', on);
  });
  $('admin-app').hidden = pane !== 'lessons';
  $('save-bar').hidden = pane !== 'lessons';
  $('admin-users').hidden = pane !== 'users';
  if (pane === 'users') loadUsers();
}
document.querySelectorAll('#admin-tabs button').forEach(b => { b.onclick = () => showPane(b.dataset.pane); });

async function loadUsers() {
  $('users-count').textContent = 'Loading\u2026';
  const r = await api('GET', null, '?action=users', '/api/admin');
  if (r.status !== 200) { $('users-count').textContent = 'Could not load users. Try reloading the page.'; return; }
  users = r.data.users;
  renderUsers();
}
function renderUsers() {
  const q = $('users-search').value.trim().toLowerCase();
  const list = users.filter(u => !q || (u.name + ' ' + u.email + ' ' + u.username).toLowerCase().includes(q));
  $('users-count').textContent = `${users.length} account${users.length === 1 ? '' : 's'}` + (q ? ` \u00b7 ${list.length} shown` : '');
  const ul = $('users-list');
  ul.innerHTML = '';
  list.forEach(u => {
    const li = el('li', 'user-row');
    const av = el('span', 'avatar'); paintAvatar(av, u);
    const who = el('div', 'user-who');
    const name = el('a', null, u.name); name.href = '/u/' + u.username; name.target = '_blank'; name.rel = 'noopener';
    who.append(name, el('span', 'muted', `${u.email} \u00b7 @${u.username} \u00b7 joined ${new Date(u.created).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`));
    li.append(av, who);
    if (u.role === 'admin') li.appendChild(el('span', 'role-badge', 'Admin'));
    const btn = el('button', 'ghost', 'Reset password');
    btn.type = 'button';
    btn.onclick = async () => {
      if (!confirm(`Give ${u.name} (${u.email}) a new temporary password? Their current password will stop working.`)) return;
      btn.disabled = true;
      const r = await api('POST', { id: u.id }, '?action=reset', '/api/admin');
      btn.disabled = false;
      if (r.status !== 200) { alert('Resetting the password failed. Try again.'); return; }
      $('pw-who').textContent = `${u.name} (${u.email})`;
      $('pw-value').textContent = r.data.password;
      $('pw-copy').textContent = 'Copy';
      $('pw-reset').hidden = false;
      $('pw-reset').scrollIntoView({ block: 'nearest' });
    };
    li.appendChild(btn);
    ul.appendChild(li);
  });
  if (!list.length) ul.appendChild(el('li', 'muted', 'No users match.'));
}
$('users-search').addEventListener('input', renderUsers);
$('dedupe-btn').onclick = async () => {
  const btn = $('dedupe-btn'), out = $('dedupe-result');
  btn.disabled = true;
  const r = await api('POST', {}, '?action=dedupe', '/api/admin');
  btn.disabled = false;
  out.hidden = false;
  if (r.status !== 200) { out.textContent = 'Something went wrong. Try again.'; return; }
  out.textContent = r.data.removed
    ? `Removed ${r.data.removed} copied session${r.data.removed === 1 ? '' : 's'} from: ` + r.data.accounts.map(a => `${a.name} (${a.removed})`).join(', ') + '.'
    : 'No copies found. Every account only has its own practice.';
};
$('pw-copy').onclick = async () => {
  try { await navigator.clipboard.writeText($('pw-value').textContent); $('pw-copy').textContent = 'Copied!'; }
  catch { $('pw-copy').textContent = 'Select and copy it'; }
};

load();
