// =================================================
// THEME MANAGER
// =================================================
(() => {
  const root = document.documentElement;
  $('#themeToggle').addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// =================================================
// MOBILE NAVIGATION
// =================================================
(() => {
  const btn = $('#menuBtn'), links = $('#navLinks');
  const set = open => { links.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => set(!links.classList.contains('open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => set(false)));
  addEventListener('resize', () => innerWidth > 768 && set(false));
  addEventListener('scroll', () => $('#navbar').classList.toggle('scrolled', scrollY > 10), { passive: true });
})();

// =================================================
// ACTIVE NAVIGATION
// =================================================
(() => {
  const links = $$('.nav-links a'), secs = links.map(a => $(a.getAttribute('href')));
  const update = () => {
    const y = scrollY + 120; let i = 0;
    secs.forEach((s, n) => { if (s && s.offsetTop <= y) i = n; });
    links.forEach((a, n) => { a.classList.toggle('active', n === i); n === i ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); });
  };
  addEventListener('scroll', update, { passive: true }); update();
})();

// =================================================
// BACK TO TOP
// =================================================
(() => {
  const b = $('#toTop');
  addEventListener('scroll', () => b.classList.toggle('show', scrollY > 600), { passive: true });
  b.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
})();
