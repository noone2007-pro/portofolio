// SKILLS — cards generated from js/data/skills.js
function renderSkills() {
  $('#skillsGrid').innerHTML = skills.map(s => `
  <article class="skill-card reveal"><div class="skill-head"><div class="ico">${ICONS[s.icon] || ''}</div><h3>${esc(s.category)}</h3></div>
  <ul>${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></article>`).join('');
}
