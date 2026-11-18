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
  $('p-avatar').textContent = (me.name || '?').charAt(0).toUpperCase();
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

$('p-logout').onclick = logOut;
document.addEventListener('langchange', () => { if (me) renderUrl(); });

authReady.then(state => {
  if (!state || !state.user) { location.href = '/login?next=/profile'; return; }
  me = state.user;
  fill();
  $('profile-main').hidden = false;
});
