// =================================================
// CONTACT INFO — built from socialLinks + personalInfo (empty items are hidden)
// =================================================
function renderContactInfo() {
  const rows = [
    ...socialLinks.filter(l => l.url).map(l => ({ label: l.label, text: l.url.replace(/^(mailto:|https?:\/\/(www\.)?)/, '').replace(/\/$/, ''), href: l.url })),
    ...(personalInfo.phone ? [{ label: 'Phone', text: personalInfo.phone, href: 'tel:' + personalInfo.phone.replace(/\s/g, '') }] : []),
    ...(personalInfo.location ? [{ label: 'Location', text: personalInfo.location }] : [])
  ];
  const ul = $('#contactInfo');
  ul.hidden = !rows.length;
  $('.contact-grid').classList.toggle('no-info', !rows.length);
  ul.innerHTML = rows.map(r => `<li><strong>${esc(r.label)}</strong>${r.href
    ? `<a href="${esc(r.href)}"${/^https?:/.test(r.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(r.text)}</a>`
    : `<span>${esc(r.text)}</span>`}</li>`).join('');
}

// =================================================
// CONTACT FORM
// =================================================
(() => {
  const form = $('#contactForm');
  const rules = {
    name: v => v.trim() ? '' : 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
    subject: v => v.trim() ? '' : 'Enter a subject.',
    message: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'
  };
  const check = k => { const f = form[k], msg = rules[k](f.value); f.parentElement.classList.toggle('err', !!msg); $('small', f.parentElement).textContent = msg; return !msg; };
  Object.keys(rules).forEach(k => form[k].addEventListener('blur', () => check(k)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    $('#formSuccess').hidden = !ok;
    if (ok) form.reset();
  });
})();
