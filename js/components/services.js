// SERVICES — cards generated from js/data/services.js
function renderServices() {
  $('#servicesGrid').innerHTML = services.map(s => `
  <article class="service reveal"><div class="ico">${ICONS[s.icon] || ''}</div><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></article>`).join('');
}
