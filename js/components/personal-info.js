// PERSONAL INFO — fills [data-info], [data-info-src] and the About text from js/data/personalInfo.js
function renderPersonalInfo() {
  const info = { ...personalInfo, copyright: `© ${new Date().getFullYear()} ${personalInfo.name}. All rights reserved.` };
  $$('[data-info]').forEach(el => { el.textContent = info[el.dataset.info] ?? ''; });
  $$('[data-info-src]').forEach(el => { el.src = info[el.dataset.infoSrc]; });
  $('#aboutText').innerHTML = info.about.map(p => `<p>${esc(p)}</p>`).join('');
}
