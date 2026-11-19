// Light / dark theme. Loaded in <head> so the page never flashes the wrong colours.
// Follows the device setting until the visitor picks one with the sun/moon button.
(function () {
  const KEY = 'muza-theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  const current = () => saved || (media.matches ? 'dark' : 'light');
  const apply = () => {
    const theme = current();
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#14101A' : '#D100FF';
    const btn = document.querySelector('.theme-btn');
    if (btn) {
      const uk = document.documentElement.lang === 'uk';
      const label = theme === 'dark'
        ? (uk ? 'Увімкнути світлу тему' : 'Switch to light theme')
        : (uk ? 'Увімкнути темну тему' : 'Switch to dark theme');
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.setAttribute('aria-pressed', theme === 'dark');
    }
  };
  apply();
  media.addEventListener('change', () => { if (!saved) apply(); });

  const SUN = '<svg class="i-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg class="i-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>';

  document.addEventListener('DOMContentLoaded', () => {
    const bar = document.querySelector('.topbar-inner');
    if (!bar) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-btn';
    btn.innerHTML = SUN + MOON;
    btn.onclick = () => {
      saved = current() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, saved); } catch (e) {}
      apply();
    };
    const anchor = bar.querySelector('.lang-switch') || bar.querySelector('.account-btn');
    if (anchor && anchor.classList.contains('account-btn')) bar.insertBefore(btn, anchor);
    else if (anchor) anchor.after(btn);
    else bar.appendChild(btn);
    apply();
  });
  document.addEventListener('langchange', apply);
})();
