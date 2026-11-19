// Friends page: activity of the people you follow (with cheers), this week's board,
// and the lists of people you follow, who follow you, and friends (both ways).
let data = { me: null, following: [], followers: [] };
let tab = 'friends', tabPicked = false;
let feedShown = 15;

function weekMinutes(days) {
  const start = weekStart(new Date());
  return Object.entries(days).reduce((sum, [k, m]) => sum + (new Date(k + 'T00:00') >= start ? m : 0), 0);
}

// ---------------------------------------------------------------- activity feed
// One entry per person per day: everything they logged that day, newest day first
function feedItems() {
  const items = [];
  for (const p of data.following) {
    if (!p.public) continue;
    const byDate = {};
    for (const s of p.recent || []) {
      const it = byDate[s.date] || (byDate[s.date] = { p, date: s.date, parts: {}, last: 0 });
      it.parts[s.type] = (it.parts[s.type] || 0) + s.minutes;
      it.last = Math.max(it.last, s.created || new Date(s.date + 'T12:00').getTime());
    }
    items.push(...Object.values(byDate));
  }
  return items.sort((a, b) => b.last - a.last);
}

// "just now", "2 hours ago", "yesterday" in the current language
function ago(time) {
  const s = Math.round((Date.now() - time) / 1000);
  if (s < 60) return t('feed.now');
  const rtf = new Intl.RelativeTimeFormat(LANG === 'uk' ? 'uk' : 'en', { numeric: 'auto' });
  if (s < 3600) return rtf.format(-Math.floor(s / 60), 'minute');
  if (s < 86400) return rtf.format(-Math.floor(s / 3600), 'hour');
  return rtf.format(-Math.floor(s / 86400), 'day');
}

const EMOJI = { clap: '👏', fire: '🔥' };

function renderFeed() {
  const items = feedItems();
  const ul = $('feed');
  ul.innerHTML = '';
  if (!items.length) ul.appendChild(el('li', 'people-empty muted', t('feed.empty')));
  items.slice(0, feedShown).forEach(it => {
    const { p } = it;
    const li = el('li', 'feed-item');
    const av = el('a', 'avatar'); av.href = '/u/' + p.username; paintAvatar(av, p);
    const body = el('div', 'feed-body');
    const line = el('p', 'feed-line');
    const name = el('a', 'person-name', p.name); name.href = '/u/' + p.username;
    const what = Object.entries(it.parts).map(([type, m]) => `${instrLower(type)} ${fmtMin(m)}`).join(', ');
    line.append(name, ' ' + t('feed.did', { what }));
    body.append(line, el('span', 'muted feed-when', ago(it.last)));
    li.append(av, body);

    const cheers = p.cheers[it.date] || { clap: 0, fire: 0, mine: null };
    const box = el('div', 'cheer-box');
    for (const e of ['clap', 'fire']) {
      const b = el('button', 'cheer' + (cheers.mine === e ? ' on' : ''));
      b.type = 'button';
      b.setAttribute('aria-pressed', cheers.mine === e);
      b.setAttribute('aria-label', t('cheer.' + e));
      b.title = t('cheer.' + e);
      b.append(EMOJI[e]);
      if (cheers[e]) b.append(el('span', null, String(cheers[e])));
      b.onclick = () => cheer(p, it.date, e, b);
      box.appendChild(b);
    }
    li.appendChild(box);
    ul.appendChild(li);
  });
  $('feed-more').hidden = items.length <= feedShown;
}

async function cheer(p, date, emoji, btn) {
  btn.disabled = true;
  const r = await api('POST', { username: p.username, date, emoji }, '?action=cheer', '/api/follow');
  btn.disabled = false;
  if (r.status !== 200) { alert(t('err.generic')); return; }
  const c = p.cheers[date] || (p.cheers[date] = { clap: 0, fire: 0, mine: null });
  if (c.mine) c[c.mine]--;
  c.mine = r.data.mine;
  if (c.mine) {
    c[c.mine]++;
    confetti(btn);
  }
  renderFeed();
}

// ---------------------------------------------------------------- this week's board
function renderBoard() {
  const people = [data.me, ...data.following.filter(p => p.public)].filter(Boolean)
    .map(p => ({ p, min: weekMinutes(p.days), me: p === data.me }))
    .sort((a, b) => b.min - a.min || (a.me ? -1 : 1));
  const top = Math.max(1, ...people.map(x => x.min));
  const ol = $('board');
  ol.innerHTML = '';
  people.forEach((x, i) => {
    const li = el('li', 'board-row' + (x.me ? ' me' : ''));
    const medal = x.min && i < 3 ? ['🥇', '🥈', '🥉'][i] : String(i + 1);
    li.append(el('span', 'board-rank', medal));
    const av = el('span', 'avatar'); paintAvatar(av, x.p);
    li.appendChild(av);
    const mid = el('div', 'board-mid');
    mid.append(el('span', 'board-name', x.me ? t('board.you') : x.p.name));
    const bar = el('span', 'board-bar');
    const fill = el('span'); fill.style.width = (x.min / top * 100) + '%';
    bar.appendChild(fill);
    mid.appendChild(bar);
    li.append(mid, el('b', 'board-min', fmtMin(x.min)));
    ol.appendChild(li);
  });
}

function lists() {
  const friends = data.following.filter(p => p.followsYou);
  return { friends, following: data.following, followers: data.followers };
}

function render() {
  $('friends-top').hidden = !data.following.length;
  if (data.following.length) { renderFeed(); renderBoard(); }
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
      const s = streaks(p.days).current, w = weekMinutes(p.days);
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
        c.style.background = ALL_SCALE[level(m)];
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
  if (!tabPicked) { const l = lists(); tab = ['friends', 'following', 'followers'].find(k => l[k].length) || 'friends'; }
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
    tabPicked = true;
    load();
  } else {
    const err = r.data && r.data.error;
    addMsg(err === 'not-found' ? 'follow.err.notFound' : err === 'private' ? 'follow.err.private' : err === 'self' ? 'follow.err.self' : 'err.generic', { name: '@' + name }, 'err');
  }
});

document.querySelectorAll('.friends-tabs button').forEach(b => { b.onclick = () => { tab = b.dataset.tab; tabPicked = true; render(); }; });
$('feed-more').onclick = () => { feedShown += 15; renderFeed(); };

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
