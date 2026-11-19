// Public profile page: /u/<username> (or /user?u=<username>)
const uname = (location.pathname.match(/^\/u\/([^/]+)/) || [])[1] || new URLSearchParams(location.search).get('u') || '';
const SCALE = ALL_SCALE;
let profile = null, days = {}, chosen = null, follow = null;

const total = d => (d ? Object.values(d).reduce((a, b) => a + b, 0) : 0);


function render() {
  if (!profile) return;
  document.title = `${profile.name} · ${t('brand')}`;
  paintAvatar($('u-avatar'), profile);
  $('u-name').textContent = profile.name;
  $('u-admin').hidden = profile.role !== 'admin';
  $('u-handle').textContent = '@' + profile.username;
  $('u-joined').textContent = t('user.joined', { date: new Date(profile.created).toLocaleDateString(LANG === 'uk' ? 'uk-UA' : 'en-GB', { month: 'long', year: 'numeric' }) });
  $('u-bio').textContent = profile.bio;
  $('u-bio').hidden = !profile.bio;
  $('u-edit').hidden = !profile.own;
  $('u-private').hidden = !(profile.own && !profile.public);
  renderFollow();

  const { current, longest } = streaks(Object.fromEntries(Object.entries(days).map(([k, d]) => [k, total(d)])));
  const practised = Object.keys(days).filter(k => total(days[k]));
  const per = {};
  Object.values(days).forEach(d => Object.entries(d).forEach(([id, m]) => { per[id] = (per[id] || 0) + m; }));
  const sumAll = Object.values(per).reduce((a, b) => a + b, 0);
  $('u-streak').textContent = current;
  $('u-longest').textContent = longest;
  $('u-days').textContent = practised.length;
  $('u-days-label').textContent = plural(practised.length, 'recap.daysWord');
  $('u-hours').textContent = +(sumAll / 60).toFixed(1);

  // Year graph (same look as the practice page)
  const graph = $('graph');
  graph.innerHTML = '';
  const end = new Date(); end.setHours(0, 0, 0, 0);
  const start = new Date(end); start.setDate(start.getDate() - 364 - start.getDay());
  const months = el('div', 'months'); months.appendChild(el('span'));
  let last = -1;
  for (let w = 0; w < 53; w++) {
    const d = new Date(start); d.setDate(start.getDate() + w * 7);
    if (d.getMonth() !== last && d.getDate() <= 7) {
      const m = el('span', null, monthShort(d.getMonth())); m.style.gridColumn = `${w + 2} / span 4`; months.appendChild(m); last = d.getMonth();
    }
  }
  graph.appendChild(months);
  const row = el('div', 'graph-row');
  const label = el('div', 'graph-label');
  t('weekShort').forEach((w, r) => label.appendChild(el('span', null, r % 2 ? w : '')));
  const cells = el('div', 'cells');
  let yearMin = 0, yearDays = 0;
  for (let d = new Date(start); d <= end || d.getDay() !== 0; d.setDate(d.getDate() + 1)) {
    const key = iso(d), min = total(days[key]);
    const c = el('span', 'cell' + (d > end ? ' future' : ''));
    c.style.background = SCALE[level(min)];
    c.dataset.tip = (min ? t('tip.some', { n: min, type: t('tip.all') }) : t('tip.none', { type: t('tip.all') })) + ` · ${d.getDate()} ${monthShort(d.getMonth())} ${d.getFullYear()}`;
    cells.appendChild(c);
    if (d <= end && min) { yearMin += min; yearDays++; }
  }
  row.append(label, cells);
  graph.appendChild(row);
  fitGraph(graph);
  $('year-summary').textContent = practised.length
    ? t('year.summary', { min: yearMin.toLocaleString(LANG), days: yearDays, dayWord: plural(yearDays, 'days') })
    : t('user.empty');
  const legend = $('legend'); legend.innerHTML = '';
  legend.append(t('legend.less'));
  SCALE.forEach(c => { const s = el('span', 'cell'); s.style.background = c; legend.appendChild(s); });
  legend.append(t('legend.more'));

  // Instruments: the ones they chose, then anything else they logged; split bar by time
  const order = (chosen || []).filter(id => INSTR[id]);
  Object.keys(per).forEach(id => { if (!order.includes(id)) order.push(id); });
  const ib = $('u-instruments'); ib.innerHTML = '';
  order.forEach(id => { const c = el('span', 'tag', instrName(id)); c.style.cssText = instrTagStyle(id); ib.appendChild(c); });
  const split = $('u-split'); split.innerHTML = '';
  if (sumAll) {
    const bar = el('div', 'split-bar');
    const lg = el('div', 'split-legend');
    order.filter(id => per[id]).forEach(id => {
      const p = el('span'); p.style.width = (per[id] / sumAll * 100) + '%'; p.style.background = instrColor(id); bar.appendChild(p);
      const k = el('span', 'k', `${instrName(id)} ${fmtMin(per[id])} · ${Math.round(per[id] / sumAll * 100)}%`);
      k.style.setProperty('--k', instrColor(id)); lg.appendChild(k);
    });
    split.append(bar, lg);
  }
}

attachGraphTip($('graph'));

// Followers / following counts and the Follow button
function renderFollow() {
  if (!follow) return;
  const line = $('u-follow');
  line.innerHTML = '';
  const count = (n, key) => { const s = el('span'); s.append(el('b', null, String(n)), ' ' + plural(n, key)); return s; };
  line.append(count(follow.followers, 'follow.followersWord'), ' · ', count(follow.following, 'follow.followingWord'));
  if (follow.youFollow && follow.followsYou) line.append(' ', el('span', 'friend-badge', t('follow.friends')));
  else if (follow.followsYou) line.append(' ', el('span', 'friend-badge soft', t('follow.followsYou')));
  const btn = $('u-followbtn');
  btn.hidden = profile.own;
  btn.textContent = follow.youFollow ? t('follow.following') : follow.followsYou ? t('follow.back') : t('follow.follow');
  btn.className = follow.youFollow ? 'ghost follow-btn' : 'primary follow-btn';
}
$('u-followbtn').onclick = async () => {
  if (!currentUser()) { location.href = '/login?next=' + encodeURIComponent(location.pathname); return; }
  const btn = $('u-followbtn');
  if (follow.youFollow && !confirm(t('follow.confirmUn', { name: profile.name }))) return;
  btn.disabled = true;
  const r = await api(follow.youFollow ? 'DELETE' : 'POST', { username: profile.username }, '', '/api/follow');
  btn.disabled = false;
  if (r.status !== 200) { alert(t('err.generic')); return; }
  follow.followers += r.data.youFollow ? 1 : -1;
  follow.youFollow = r.data.youFollow;
  follow.followsYou = r.data.followsYou;
  renderFollow();
};

function message(key) { const m = $('u-msg'); m.textContent = t(key); m.hidden = false; $('u-page').hidden = true; }

(async () => {
  const r = await api('GET', null, '?u=' + encodeURIComponent(uname.toLowerCase()), '/api/profile');
  if (r.status === 200) { profile = r.data.profile; days = r.data.days || {}; chosen = r.data.instruments; follow = r.data.follow; await authReady; $('u-page').hidden = false; render(); }
  else if (r.status === 403) message('user.private');
  else if (r.status === 404) message('user.notFound');
  else message(r.status === 503 || r.status === 0 ? 'auth.noDb' : 'err.generic');
})();
document.addEventListener('langchange', render);
