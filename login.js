// Log in / sign up / forgot password / new password, all on one page.
const params = new URLSearchParams(location.search);
const next = (params.get('next') || '/practice').startsWith('/') ? (params.get('next') || '/practice') : '/practice';
const resetToken = params.get('reset');
const forms = [...document.querySelectorAll('.auth-form')];

function show(mode) {
  forms.forEach(f => { f.hidden = f.dataset.mode !== mode; });
  const f = forms.find(x => x.dataset.mode === mode);
  const first = f && f.querySelector('input');
  if (first) first.focus();
}
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => show(b.dataset.go));

function busy(form, on) {
  form.querySelectorAll('button[type=submit]').forEach(b => { b.disabled = on; });
  if (on) form.querySelector('.error').hidden = true;
}
const data = form => Object.fromEntries(new FormData(form).entries());

// After logging in: data cached in this browser is kept only if it is this
// same account's; anything else (another person's, or from before accounts) is cleared.
function done(user) {
  if (cacheOwner() !== user.id) clearLocalData();
  location.href = next;
}

document.getElementById('f-login').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; busy(f, true);
  const r = await api('POST', data(f), '?action=login', '/api/auth');
  busy(f, false);
  if (r.status === 200) done(r.data.user); else showError(f, r.data && r.data.error);
});

document.getElementById('f-signup').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; busy(f, true);
  const body = data(f);
  if (!body.ownerPasscode) delete body.ownerPasscode;
  const r = await api('POST', body, '?action=register', '/api/auth');
  busy(f, false);
  if (r.status === 200) { confetti(f.querySelector('.primary')); setTimeout(() => done(r.data.user), 600); }
  else showError(f, r.data && r.data.error);
});

document.getElementById('f-forgot').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; busy(f, true);
  const r = await api('POST', data(f), '?action=forgot', '/api/auth');
  busy(f, false);
  const ok = f.querySelector('.auth-ok');
  if (r.status === 200) { ok.textContent = t('auth.sent'); ok.hidden = false; }
  else if (r.status === 501) { ok.hidden = true; const p = f.querySelector('.error'); p.textContent = t('auth.noEmail'); p.hidden = false; }
  else showError(f, r.data && r.data.error);
});

document.getElementById('f-reset').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.currentTarget; busy(f, true);
  const r = await api('POST', { token: resetToken, password: data(f).password }, '?action=reset', '/api/auth');
  busy(f, false);
  if (r.status === 200) done(r.data.user); else showError(f, r.data && r.data.error);
});

// Start: already signed in? go on. Owner not claimed yet? offer the owner box.
authReady.then(state => {
  if (!state) { document.getElementById('auth-nodb').hidden = false; forms.forEach(f => f.querySelectorAll('button[type=submit]').forEach(b => { b.disabled = true; })); }
  else if (state.user && !resetToken) { location.href = next; return; }
  if (state && state.ownerClaimable) document.getElementById('owner-box').hidden = false;
});
show(resetToken ? 'reset' : params.get('mode') === 'signup' ? 'signup' : 'login');
