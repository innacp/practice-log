// Public profile page: /u/<username> (or /user?u=<username>)
const $ = id => document.getElementById(id);
const uname = (location.pathname.match(/^\/u\/([^/]+)/) || [])[1] || new URLSearchParams(location.search).get('u') || '';
const SCALE = ['#EEF0F3', '#F6C8FF', '#E58CFA', '#CC3FEB', '#9100B3'];
let profile = null, days = {};

function level(min) { return !min ? 0 : min <= 15 ? 1 : min <= 30 ? 2 : min < 60 ? 3 : 4; }
const total = d => (d ? d.drums + d.vocals : 0);

function streaks() {
  let current = 0, longest = 0, run = 0, prev = null;
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (!total(days[iso(d)])) d.setDate(d.getDate() - 1);
  while (total(days[iso(d)])) { current++; d.setDate(d.getDate() - 1); }
  for (const k of Object.keys(days).filter(k => total(days[k])).sort()) {
    const t0 = new Date(k + 'T00:00');
    run = prev && Math.round((t0 - prev) / 86400000) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run); prev = t0;
  }
  return { current, longest };
}

function render() {
  if (!profile) return;
  document.title = `${profile.name} · ${t('brand')}`;
  $('u-avatar').textContent = profile.name.charAt(0).toUpperCase();
  $('u-name').textContent = profile.name;
  $('u-admin').hidden = profile.role !== 'admin';
  $('u-handle').textContent = '@' + profile.username;
  $('u-joined').textContent = t('user.joined', { date: new Date(profile.created).toLocaleDateString(LANG === 'uk' ? 'uk-UA' : 'en-GB', { month: 'long', year: 'numeric' }) });
  $('u-bio').textContent = profile.bio;
  $('u-bio').hidden = !profile.bio;
  $('u-edit').hidden = !profile.own;
  $('u-private').hidden = !(profile.own && !profile.public);

  const { current, longest } = streaks();
  const practised = Object.keys(days).filter(k => total(days[k]));
  let drums = 0, vocals = 0;
  Object.values(days).forEach(d => { drums += d.drums; vocals += d.vocals; });
  $('u-streak').textContent = current;
  $('u-longest').textContent = longest;
  $('u-days').textContent = practised.length;
  $('u-days-label').textContent = plural(practised.length, 'recap.daysWord');
  $('u-hours').textContent = +((drums + vocals) / 60).toFixed(1);

  // Year graph (same look as the log page)
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
  const scroller = graph.closest('.graph-scroll'); scroller.scrollLeft = scroller.scrollWidth;
  $('year-summary').textContent = practised.length
    ? t('year.summary', { min: yearMin.toLocaleString(LANG), days: yearDays, dayWord: plural(yearDays, 'days') })
    : t('user.empty');
  const legend = $('legend'); legend.innerHTML = '';
  legend.append(t('legend.less'));
  SCALE.forEach(c => { const s = el('span', 'cell'); s.style.background = c; legend.appendChild(s); });
  legend.append(t('legend.more'));

  // Drums / vocals split
  const split = $('u-split'); split.innerHTML = '';
  const sum = drums + vocals;
  if (sum) {
    const bar = el('div', 'split-bar');
    const a = el('span', 'split-drums'); a.style.width = (drums / sum * 100) + '%';
    const b = el('span', 'split-vocals'); b.style.width = (vocals / sum * 100) + '%';
    bar.append(a, b);
    const lg = el('div', 'split-legend');
    lg.append(el('span', 'k drums', `${t('drums')} ${fmtMin(drums)} · ${Math.round(drums / sum * 100)}%`),
      el('span', 'k vocals', `${t('vocals')} ${fmtMin(vocals)} · ${Math.round(vocals / sum * 100)}%`));
    split.append(bar, lg);
  }
}

// Tooltip on the squares
const tip = $('tip');
$('graph').addEventListener('mousemove', e => {
  const c = e.target.closest('.cells .cell');
  if (!c || c.classList.contains('future')) { tip.hidden = true; return; }
  tip.textContent = c.dataset.tip; tip.hidden = false;
  tip.style.left = Math.min(e.clientX + 10, innerWidth - tip.offsetWidth - 8) + 'px';
  tip.style.top = (e.clientY - 32) + 'px';
});
$('graph').addEventListener('mouseleave', () => { tip.hidden = true; });

function message(key) { const m = $('u-msg'); m.textContent = t(key); m.hidden = false; $('u-page').hidden = true; }

(async () => {
  const r = await api('GET', null, '?u=' + encodeURIComponent(uname.toLowerCase()), '/api/profile');
  if (r.status === 200) { profile = r.data.profile; days = r.data.days || {}; $('u-page').hidden = false; render(); }
  else if (r.status === 403) message('user.private');
  else if (r.status === 404) message('user.notFound');
  else message(r.status === 503 || r.status === 0 ? 'auth.noDb' : 'err.generic');
})();
document.addEventListener('langchange', render);
