// LOGO — the mark lives in assets/icons/logo.svg (also the favicon). Edit that file to redesign it.
function renderLogo() {
  $$('[data-logo]').forEach(el => {
    const size = el.dataset.size || 36;
    el.innerHTML = `<img class="logo-mark" src="assets/icons/logo.svg" width="${size}" height="${size}" alt=""><span class="logo-word">${esc(personalInfo.name)}</span>`;
  });
}
