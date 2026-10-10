export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function favoriteButton(game, favorites) {
  const saved = favorites.includes(game.id);
  return `<button class="favorite-button" type="button" data-favorite="${escapeHTML(game.id)}" aria-pressed="${saved}" aria-label="${saved ? 'Unsave' : 'Save'} ${escapeHTML(game.title)}">${saved ? '♥ Saved' : '♡ Save'}</button>`;
}

export function gameCard(game, favorites) {
  return `<article class="game-card">
    <img src="${escapeHTML(game.image)}" width="460" height="215" loading="lazy" alt="${escapeHTML(game.title)} official store artwork">
    <div class="card-content"><div class="card-meta"><span>${escapeHTML(game.genre)}</span><span class="score" aria-label="Editorial discovery score ${game.rating} out of 10">${game.rating.toFixed(1)} <small>/ 10</small></span></div>
    <h3>${escapeHTML(game.title)}</h3><p class="platforms">${game.platforms.map(escapeHTML).join(' · ')}</p><p class="description">${escapeHTML(game.description)}</p>
    <div class="card-actions"><button type="button" class="quick-button" data-quick="${escapeHTML(game.id)}">Quick view <span aria-hidden="true">↗</span></button>${favoriteButton(game, favorites)}</div></div>
  </article>`;
}

export function gameQuickView(game, favorites) {
  return `<img class="dialog-art" src="${escapeHTML(game.image)}" width="460" height="215" alt="${escapeHTML(game.title)} official store artwork">
    <p class="eyebrow">${escapeHTML(game.genre)} · ${escapeHTML(game.developer)}</p><h2 id="dialog-title">${escapeHTML(game.title)}</h2>
    <p>${escapeHTML(game.description)}</p><p><strong>Platforms:</strong> ${game.platforms.map(escapeHTML).join(', ')}</p>
    <p><strong>Editorial discovery score: ${game.rating.toFixed(1)} / 10</strong></p><p class="fine-print">${escapeHTML(game.ratingBasis)}</p>
    <div class="dialog-actions">${favoriteButton(game, favorites)}<a class="button" href="game.html?id=${encodeURIComponent(game.id)}">Full game details →</a></div>
    <p class="fine-print">${escapeHTML(game.artCredit)} <a href="${escapeHTML(game.artSource)}">Artwork source</a> · <a href="${escapeHTML(game.source)}">Official Steam listing</a></p>`;
}

// Keep template rendering safe even if a future data source is not trusted.
export function renderMarkup(target, markup) {
  const document = new DOMParser().parseFromString(markup, 'text/html');
  const tags = new Set(['ARTICLE', 'IMG', 'DIV', 'SPAN', 'SMALL', 'H2', 'H3', 'P', 'BUTTON', 'A', 'STRONG']);
  const attributes = new Set(['class', 'src', 'width', 'height', 'loading', 'alt', 'aria-label', 'aria-pressed', 'type', 'data-favorite', 'data-quick', 'id', 'href']);
  for (const element of document.body.querySelectorAll('*')) {
    if (!tags.has(element.tagName)) { element.remove(); continue; }
    for (const attribute of [...element.attributes]) {
      if (!attributes.has(attribute.name)) element.removeAttribute(attribute.name);
      else if (['href', 'src'].includes(attribute.name)) {
        const url = new URL(attribute.value, location.href);
        if (!['http:', 'https:'].includes(url.protocol)) element.removeAttribute(attribute.name);
      }
    }
  }
  target.replaceChildren(...document.body.childNodes);
}

export async function loadGames() {
  const response = await fetch(new URL('../data/games.json', import.meta.url));
  if (!response.ok) throw new Error('The game collection could not be loaded.');
  const games = await response.json();
  if (!Array.isArray(games) || games.length < 15 || !games.every(game =>
    typeof game.id === 'string' && typeof game.title === 'string' &&
    typeof game.genre === 'string' && typeof game.description === 'string' &&
    typeof game.image === 'string' && Array.isArray(game.platforms) &&
    game.platforms.every(platform => typeof platform === 'string') &&
    Number.isFinite(game.rating) && game.rating >= 0 && game.rating <= 10
  )) throw new Error('The collection data is unavailable.');
  return games;
}
