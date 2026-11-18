// "My profile": edit name / username / bio / public, change password, log out, delete account.
const $ = id => document.getElementById(id);
let me = null;

function showError(form, code) {
  const p = form.querySelector('.error');
  const key = 'err.' + code;
  p.textContent = t(key) === key ? t('err.generic') : t(key);
  p.hidden = false;
}
function flash(form) {
  const n = form.querySelector('.saved-note');
  n.hidden = false; setTimeout(() => { n.hidden = true; }, 2500);
}
function fill() {
  paintAvatar($('p-avatar'), me);
  $('p-photo-add').textContent = t(me.avatar ? 'prof.changePhoto' : 'prof.addPhoto');
  $('p-photo-remove').hidden = !me.avatar;
  $('p-name').textContent = me.name;
  $('p-email').textContent = me.email;
  $('p-admin').hidden = me.role !== 'admin';
  $('p-view').href = '/u/' + me.username;
  const f = $('f-profile');
  f.elements.name.value = me.name; f.username.value = me.username; f.bio.value = me.bio; f.public.checked = me.public;
  renderUrl();
  $('f-delete').hidden = me.role === 'admin'; // the admin account stays
}
function renderUrl() {
  $('p-url').textContent = t('prof.usernameHint', { url: `${location.host}/u/${$('f-profile').username.value || '…'}` });
}
$('f-profile').username.addEventListener('input', e => {
  e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
  renderUrl();
});

$('f-profile').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; f.querySelector('.error').hidden = true;
  const r = await api('PATCH', { name: f.elements.name.value, username: f.username.value, bio: f.bio.value, public: f.public.checked }, '', '/api/me');
  if (r.status === 200) { me = r.data.user; authState.user = me; fill(); renderAccountButton(); flash(f); }
  else showError(f, r.data && r.data.error);
});

$('f-password').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; f.querySelector('.error').hidden = true;
  const r = await api('POST', { current: f.current.value, password: f.password.value }, '?action=password', '/api/me');
  if (r.status === 200) { f.reset(); flash(f); } else showError(f, r.data && r.data.error);
});

$('f-delete').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; f.querySelector('.error').hidden = true;
  if (!confirm(t('prof.deleteConfirm'))) return;
  const r = await api('DELETE', { password: f.password.value }, '', '/api/me');
  if (r.status === 200) { clearLocalData(); location.href = '/'; } else showError(f, r.data && r.data.error);
});

// My instruments (stored with the weekly goal in the account settings)
let readInst = null, instSettings = null;
async function loadInstruments() {
  const r = await api('GET', null, '', '/api/settings');
  instSettings = r.status === 200 && r.data ? r.data.settings : loadSettings();
  readInst = buildInstrumentPicker($('p-inst-picker'), myInstruments(instSettings));
}
$('f-instruments').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; f.querySelector('.error').hidden = true;
  const chosen = readInst();
  if (!chosen.length) { f.querySelector('.error').textContent = t('inst.needOne'); f.querySelector('.error').hidden = false; return; }
  const r = await api('PUT', { instruments: chosen }, '', '/api/settings');
  if (r.status === 200) {
    saveSettingsLocal({ ...loadSettings(), instruments: chosen });
    instSettings = r.data.settings; flash(f);
  } else showError(f, r.data && r.data.error);
});

// ---------- Profile photo: crop to a square, shrink to 256 px, upload ----------
function photoMsg(key, isError) {
  const m = $('p-photo-msg');
  m.textContent = key ? t(key) : '';
  m.classList.toggle('error', !!isError);
}
function squareImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const c = document.createElement('canvas');
      c.width = c.height = 256;
      const g = c.getContext('2d');
      g.imageSmoothingQuality = 'high';
      g.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, 256, 256);
      URL.revokeObjectURL(url);
      let data = c.toDataURL('image/webp', 0.85);
      if (!data.startsWith('data:image/webp')) data = c.toDataURL('image/jpeg', 0.85); // older Safari
      resolve(data);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad-image')); };
    img.src = url;
  });
}
const pickPhoto = () => $('p-photo').click();
$('p-avatar').onclick = pickPhoto;
$('p-photo-add').onclick = pickPhoto;
$('p-photo').addEventListener('change', async e => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  if (!file.type.startsWith('image/')) { photoMsg('err.bad-image', true); return; }
  let data;
  try { data = await squareImage(file); } catch { photoMsg('err.bad-image', true); return; }
  // show it straight away, then save
  $('p-avatar').innerHTML = ''; const preview = el('img'); preview.src = data; preview.alt = ''; $('p-avatar').appendChild(preview);
  photoMsg('prof.photoSaving');
  const r = await api('PUT', { image: data }, '?action=avatar', '/api/me');
  if (r.status === 200) { me = r.data.user; authState.user = me; fill(); renderAccountButton(); photoMsg('prof.saved'); setTimeout(() => photoMsg(''), 2500); }
  else { fill(); photoMsg('err.' + ((r.data && r.data.error) || 'generic'), true); }
});
$('p-photo-remove').onclick = async () => {
  const r = await api('DELETE', null, '?action=avatar', '/api/me');
  if (r.status === 200) { me = r.data.user; authState.user = me; fill(); renderAccountButton(); photoMsg(''); }
  else photoMsg('err.generic', true);
};

$('p-logout').onclick = logOut;
document.addEventListener('langchange', () => {
  if (me) { renderUrl(); $('p-photo-add').textContent = t(me.avatar ? 'prof.changePhoto' : 'prof.addPhoto'); }
  if (readInst) { const keep = readInst(); readInst = buildInstrumentPicker($('p-inst-picker'), keep); }
});

authReady.then(state => {
  if (!state || !state.user) { location.href = '/login?next=/profile'; return; }
  me = state.user;
  fill();
  loadInstruments();
  $('profile-main').hidden = false;
});
