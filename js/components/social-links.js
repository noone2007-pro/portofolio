// SOCIAL LINKS — renders every [data-social] container from js/data/socialLinks.js
function renderSocialLinks() {
  $$('[data-social]').forEach(box => {
    const links = socialLinks.filter(l => l.url && l.url.trim());
    box.hidden = !links.length;
    box.innerHTML = links.map(l => {
      const external = !/^(mailto|tel):/.test(l.url);
      return `<a class="social-link" href="${esc(l.url)}" aria-label="${esc(l.label)}" title="${esc(l.label)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${ICONS[l.icon] || ICONS.link}</a>`;
    }).join('');
  });
}

// ACCOUNTS SECTION — one card per configured link in js/data/socialLinks.js
function renderAccounts() {
  const links = socialLinks.filter(l => l.url && l.url.trim());
  $('#accounts').hidden = !links.length;
  $$('.nav-links a[href="#accounts"]').forEach(a => { a.parentElement.hidden = !links.length; });
  $('#accountsGrid').innerHTML = links.map(l => {
    const external = !/^(mailto|tel):/.test(l.url);
    const text = l.url.replace(/^(mailto:|https?:\/\/(www\.)?)/, '').replace(/\/$/, '');
    return `<a class="account reveal" href="${esc(l.url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>
      <span class="ico">${ICONS[l.icon] || ICONS.link}</span>
      <span class="account-text"><strong>${esc(l.label)}</strong><small>${esc(text)}</small></span><span class="account-go" aria-hidden="true">&rarr;</span></a>`;
  }).join('');
}
