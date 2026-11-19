// Home page: an example year graph and the right buttons for visitors / signed-in people.

// Example graph: practice gets more regular through the year (fixed pattern, not real data)
(function drawSample() {
  const box = document.getElementById('hg-cells');
  let seed = 7;
  const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let w = 0; w < 30; w++) {
    for (let d = 0; d < 7; d++) {
      const chance = 0.25 + (w / 30) * 0.6;
      const level = rand() < chance ? 1 + Math.floor(rand() * 4) : 0;
      const c = el('span', 'cell');
      c.style.background = ALL_SCALE[level];
      c.style.animationDelay = (w * 18 + d * 6) + 'ms';
      box.appendChild(c);
    }
  }
})();

authReady.then(() => {
  const user = currentUser();
  document.getElementById('cta-out').hidden = !!user;
  document.getElementById('cta-in').hidden = !user;
});
