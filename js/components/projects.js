// =================================================
// PROJECTS: RENDERER, FILTER, SLIDER
// =================================================
const Slider = (() => {
  const track = $('#track'), viewport = $('#viewport'), dotsEl = $('#dots');
  const prev = $('#prevBtn'), next = $('#nextBtn');
  let list = [], per = 3, pos = 0, busy = false, filter = 'All', timer = null, paused = false;
  const perView = () => innerWidth <= 768 ? 1 : innerWidth <= 992 ? 2 : 3;

  const imgHTML = (p, cls = '') => `<div class="p-img ph ${cls}"><span>${esc(p.number)}</span><img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" style="position:absolute;inset:0" onerror="this.remove()"></div>`;
  const card = p => `<div class="slide"><article class="project">${imgHTML(p)}
    <div class="p-body"><span class="num">${esc(p.number)}</span><span class="cat">${esc(p.category)}</span>
    <h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>
    <button class="btn btn-outline" data-open="${projects.indexOf(p)}">View Project</button></div></article></div>`;

  function build() {
    per = perView();
    const loop = list.length > per;
    const head = loop ? list.slice(-per) : [], tail = loop ? list.slice(0, per) : [];
    track.style.setProperty('--per', per);
    track.innerHTML = [...head, ...list, ...tail].map(card).join('');
    $$('.slide', track).forEach((s, i) => { if (i < head.length || i >= head.length + list.length) { s.setAttribute('aria-hidden', 'true'); $$('button', s).forEach(b => b.tabIndex = -1); } });
    pos = loop ? per : 0;
    place(false);
    prev.disabled = next.disabled = !loop;
    dotsEl.innerHTML = loop ? list.map((_, i) => `<button class="dot" aria-label="Go to project ${i + 1}" data-dot="${i}"></button>`).join('') : '';
    $('#projectCount').textContent = `Showing ${list.length} project${list.length === 1 ? '' : 's'}${filter === 'All' ? '' : ' in ' + filter}`;
    dots();
  }
  const offset = () => list.length > per ? per : 0;
  const cur = () => ((pos - offset()) % list.length + list.length) % list.length;
  function place(anim) {
    track.classList.toggle('no-anim', !anim || reduceMotion);
    track.style.transform = `translateX(-${pos * 100 / per}%)`;
  }
  const dots = () => $$('.dot', dotsEl).forEach((d, i) => { d.classList.toggle('active', i === cur()); d.setAttribute('aria-current', i === cur()); });

  function go(step) {
    if (list.length <= per || busy) return;
    busy = !reduceMotion; pos += step; place(true); dots();
    if (reduceMotion) wrap();
  }
  function wrap() { // jump silently when sitting on a clone
    const o = offset();
    if (pos >= o + list.length) pos -= list.length; else if (pos < o) pos += list.length;
    place(false); busy = false;
  }
  track.addEventListener('transitionend', e => { if (e.target === track) wrap(); });
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  dotsEl.addEventListener('click', e => { const d = e.target.closest('[data-dot]'); if (d) go(+d.dataset.dot - cur()); });

  function setFilter(f) {
    filter = f; list = f === 'All' ? projects : projects.filter(p => p.category === f);
    $$('.filter').forEach(b => { const on = b.dataset.f === f; b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
    build();
  }
  const cats = ['All', ...new Set(projects.map(p => p.category))];
  $('#filters').innerHTML = cats.map(c => `<button class="filter" data-f="${esc(c)}">${esc(c)}</button>`).join('');
  $('#filters').addEventListener('click', e => { const b = e.target.closest('.filter'); if (b) setFilter(b.dataset.f); });

  // Touch swipe (horizontal only, vertical scroll untouched)
  let sx = 0, sy = 0, dx = 0, lock = null;
  viewport.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; dx = 0; lock = null; paused = true; }, { passive: true });
  viewport.addEventListener('touchmove', e => {
    dx = e.touches[0].clientX - sx; const dy = e.touches[0].clientY - sy;
    if (lock === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) lock = Math.abs(dx) > Math.abs(dy);
  }, { passive: true });
  viewport.addEventListener('touchend', () => { if (lock && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); paused = false; });

  // Keyboard (when the slider is on screen)
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea') || !$('#modal').hidden) return;
    const r = $('#slider').getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); }
  });

  // Autoplay every 5s; pauses on hover/focus/touch and when reduced motion is on
  const sl = $('#slider');
  ['mouseenter', 'focusin'].forEach(ev => sl.addEventListener(ev, () => paused = true));
  ['mouseleave', 'focusout'].forEach(ev => sl.addEventListener(ev, () => paused = false));
  if (!reduceMotion) timer = setInterval(() => { if (!paused && !document.hidden && !$('#modal').classList.contains('open')) go(1); }, 5000);

  let lastPer = perView();
  addEventListener('resize', () => { if (perView() !== lastPer) { lastPer = perView(); build(); } });
  setFilter('All');
  return { go };
})();

// =================================================
// PROJECT MODAL
// =================================================
(() => {
  const m = $('#modal'); let opener = null;
  const close = () => { m.classList.remove('open'); setTimeout(() => m.hidden = true, 300); opener && opener.focus(); };
  $('#track').addEventListener('click', e => {
    const b = e.target.closest('[data-open]'); if (!b) return;
    const p = projects[+b.dataset.open]; opener = b;
    $('#mImg').innerHTML = `<span>${esc(p.number)}</span><img src="${esc(p.image)}" alt="${esc(p.title)}" onerror="this.remove()">`;
    $('#mNum').textContent = p.number; $('#mCat').textContent = p.category;
    $('#mTitle').textContent = p.title; $('#mDesc').textContent = p.description;
    $('#mTags').innerHTML = p.technologies.map(t => `<span>${esc(t)}</span>`).join('');
    const ghProfile = (socialLinks.find(l => l.id === 'github') || {}).url;
    [['#mLink', p.link], ['#mGit', p.github || ghProfile]].forEach(([sel, url]) => { const a = $(sel); a.hidden = !url; a.href = url || '#'; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    m.hidden = false; requestAnimationFrame(() => m.classList.add('open')); $('#modalClose').focus();
  });
  $('#modalClose').addEventListener('click', close);
  m.addEventListener('click', e => { if (e.target === m) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !m.hidden) close(); });
})();
