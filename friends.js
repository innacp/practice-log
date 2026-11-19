// Friends page: people you follow, people who follow you, and friends (both ways).
const $ = id => document.getElementById(id);
let data = { following: [], followers: [] };
let tab = 'friends';

// Days in a row with practice, counting back from today (or yesterday)
function streakOf(days) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (!days[iso(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days[iso(d)]) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function weekMinutes(days) {
  const start = weekStart(new Date());
  return Object.entries(days).reduce((sum, [k, m]) => sum + (new Date(k + 'T00:00') >= start ? m : 0), 0);
}

function lists() {
  const friends = data.following.filter(p => p.followsYou);
  return { friends, following: data.following, followers: data.followers };
}

function render() {
  const l = lists();
  $('n-friends').textContent = l.friends.length;
  $('n-following').textContent = l.following.length;
  $('n-followers').textContent = l.followers.length;
  document.querySelectorAll('.friends-tabs button').forEach(b => {
    b.classList.toggle('on', b.dataset.tab === tab);
    b.setAttribute('aria-selected', b.dataset.tab === tab);
  });

  const ul = $('people');
  ul.innerHTML = '';
  const list = l[tab];
  if (!list.length) {
    ul.appendChild(el('li', 'people-empty muted', t('follow.empty.' + tab)));
    return;
  }
  list.forEach(p => {
    const li = el('li', 'person');
    const av = el('a', 'avatar'); av.href = '/u/' + p.username; paintAvatar(av, p);
    const who = el('div', 'person-who');
    const name = el('a', 'person-name', p.name); name.href = '/u/' + p.username;
    const sub = el('span', 'muted', '@' + p.username);
    if (p.youFollow && p.followsYou && tab !== 'friends') sub.append(' ', el('span', 'friend-badge', t('follow.friends')));
    else if (p.followsYou && !p.youFollow) sub.append(' ', el('span', 'friend-badge soft', t('follow.followsYou')));
    who.append(name, sub);
    li.append(av, who);

    const stats = el('div', 'person-stats');
    if (p.public) {
      const s = streakOf(p.days), w = weekMinutes(p.days);
      stats.append(
        el('span', 'p-stat' + (s ? ' hot' : ''), t('follow.streak', { n: s })),
        el('span', 'p-stat', t('follow.week', { t: fmtMin(w) })),
      );
      // last 5 weeks as small squares
      const strip = el('span', 'p-strip');
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 34);
      for (let i = 0; i < 35; i++, d.setDate(d.getDate() + 1)) {
        const m = p.days[iso(d)] || 0;
        const c = el('span', 'cell');
        c.style.background = ALL_SCALE[!m ? 0 : m <= 15 ? 1 : m <= 30 ? 2 : m < 60 ? 3 : 4];
        strip.appendChild(c);
      }
      stats.appendChild(strip);
    } else {
      stats.appendChild(el('span', 'p-stat', t('follow.private')));
    }
    li.appendChild(stats);

    const btn = el('button', p.youFollow ? 'ghost' : 'primary',
      p.youFollow ? t('follow.following') : t('follow.back'));
    btn.type = 'button';
    btn.onclick = () => toggle(p, btn);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

async function toggle(p, btn) {
  if (p.youFollow && !confirm(t('follow.confirmUn', { name: p.name }))) return;
  btn.disabled = true;
  const r = await api(p.youFollow ? 'DELETE' : 'POST', { username: p.username }, '', '/api/follow');
  btn.disabled = false;
  if (r.status === 403) { alert(t('follow.err.private')); return; }
  if (r.status !== 200) { alert(t('err.generic')); return; }
  await load();
}

async function load() {
  const r = await api('GET', null, '', '/api/follow');
  if (r.status === 200) data = r.data;
  render();
}

function addMsg(key, vars, kind) {
  const m = $('add-msg');
  m.textContent = t(key, vars);
  m.className = 'friends-msg ' + (kind || 'muted');
  m.hidden = false;
}

$('add-form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = $('add-name').value.trim().replace(/^@/, '').replace(/^.*\/u\//, '').toLowerCase();
  if (!name) return;
  const r = await api('POST', { username: name }, '', '/api/follow');
  if (r.status === 200) {
    $('add-name').value = '';
    addMsg(r.data.followsYou ? 'follow.ok.friends' : 'follow.ok', { name: '@' + name }, 'ok');
    tab = r.data.followsYou ? 'friends' : 'following';
    load();
  } else {
    const err = r.data && r.data.error;
    addMsg(err === 'not-found' ? 'follow.err.notFound' : err === 'private' ? 'follow.err.private' : err === 'self' ? 'follow.err.self' : 'err.generic', { name: '@' + name }, 'err');
  }
});

document.querySelectorAll('.friends-tabs button').forEach(b => { b.onclick = () => { tab = b.dataset.tab; render(); }; });

$('copy-link').onclick = async () => {
  try { await navigator.clipboard.writeText($('my-link').textContent); $('copy-link').textContent = t('follow.copied'); }
  catch { $('copy-link').textContent = t('follow.copyFail'); }
};

(async () => {
  await authReady;
  const me = currentUser();
  if (!me) { location.replace('/login?next=/friends'); return; }
  $('my-link').textContent = location.origin + '/u/' + me.username;
  $('friends-main').hidden = false;
  load();
})();
document.addEventListener('langchange', render);
