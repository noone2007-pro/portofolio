// SCROLL REVEAL (called from main.js after content is rendered)
function initReveal() {
  const els = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) return els.forEach(e => e.classList.add('visible'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .12 });
  els.forEach(e => io.observe(e));
}
