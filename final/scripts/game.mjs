import './navigation.mjs';
import { selectDetail, relatedGames } from './details.mjs';
import { readFavorites, saveFavorites, toggleFavorite } from './catalog.mjs';
import { loadGames, gameCard, gameQuickView, favoriteButton, escapeHTML as e, renderMarkup } from './render.mjs';

let games = [];
let storage;
try { storage = window.localStorage; } catch { /* Favorites remain session-only. */ }
let favorites = readFavorites(storage);
let opener;
const dialog = document.querySelector('#quick-view');
const status = document.querySelector('#detail-status');
const formSection = document.querySelector('#feedback');
const content = document.querySelector('#detail-content');

document.addEventListener('click', event => {
  const button = event.target.closest('[data-favorite], [data-quick]');
  if (!button) return;
  const game = games.find(item => item.id === (button.dataset.favorite || button.dataset.quick));
  if (!game) return;
  if (button.hasAttribute('data-quick')) {
    opener = button;
    renderMarkup(document.querySelector('#dialog-content'), gameQuickView(game, favorites));
    dialog.showModal();
    dialog.querySelector('.dialog-close').focus();
    return;
  }
  favorites = toggleFavorite(favorites, game.id);
  const persistent = saveFavorites(storage, favorites);
  const saved = favorites.includes(game.id);
  document.querySelectorAll('[data-favorite]').forEach(item => {
    if (item.dataset.favorite !== game.id) return;
    item.setAttribute('aria-pressed', String(saved));
    item.setAttribute('aria-label', `${saved ? 'Unsave' : 'Save'} ${game.title}`);
    item.textContent = saved ? '♥ Saved' : '♡ Save';
  });
  document.querySelector('#save-status').textContent = `${game.title} ${saved ? 'saved' : 'removed'}.${persistent ? '' : ' Storage unavailable; saved only for this page session.'}`;
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => opener?.isConnected && opener.focus());

async function initialize() {
  try {
    games = await loadGames();
    const game = selectDetail(games, location.search);
    if (!game) {
      document.querySelector('#detail-title').textContent = 'Game not found';
      status.textContent = 'That game is not in this collection. Choose a game from the catalog.';
      return;
    }
    document.querySelector('#detail-title').textContent = game.title;
    document.title = `${game.title} | Video Game Guide`;
    status.textContent = '';
    renderMarkup(content, `<div class="detail-layout"><img src="${e(game.image)}" width="460" height="215" alt="${e(game.title)} official store artwork"><div>
      <p class="eyebrow">${e(game.genre)} · ${e(game.developer)}</p><p class="lead">${e(game.description)}</p>
      <p><strong>Platforms:</strong> ${game.platforms.map(e).join(' · ')}</p>
      <p><strong>Editorial recommendation score: ${game.rating.toFixed(1)} / 10</strong></p><p class="fine-print">${e(game.ratingBasis)}</p>
      <div class="dialog-actions">${favoriteButton(game, favorites)}<a class="button" href="${e(game.source)}">Official Steam listing →</a></div>
      <p class="fine-print">${e(game.artCredit)} <a href="${e(game.artSource)}">Original artwork</a></p></div></div>`);
    renderMarkup(document.querySelector('#similar-grid'), relatedGames(games, game).map(item => gameCard(item, favorites)).join(''));
    document.querySelector('#similar').hidden = false;
    const form = document.querySelector('#recommendation-form');
    form.elements.game.value = game.title;
    game.platforms.forEach(platform => form.elements.platform.add(new Option(platform, platform)));
    formSection.hidden = false;
  } catch {
    status.textContent = 'The collection could not be loaded. Serve this site over HTTP and try again.';
    const retry = document.createElement('button');
    retry.type = 'button'; retry.className = 'button'; retry.textContent = 'Try again';
    retry.addEventListener('click', () => { content.replaceChildren(); initialize(); });
    content.replaceChildren(retry);
  }
}
initialize();
