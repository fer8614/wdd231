import { selectGames, readFavorites, saveFavorites, toggleFavorite } from './catalog.mjs';
import { loadGames, gameCard, gameQuickView, renderMarkup } from './render.mjs';

import './navigation.mjs';

let storage;
try { storage = window.localStorage; } catch { /* Session-only mode is still usable. */ }
let favorites = readFavorites(storage);
let games = [];
let activeGame;
let opener;
let noticeTimer;
const grid = document.querySelector('#game-grid');
const status = document.querySelector('#results-status');
const form = document.querySelector('#filters');
const dialog = document.querySelector('#quick-view');
const content = document.querySelector('#dialog-content');
const empty = document.querySelector('#empty-state');

function render() {
  const filters = form ? Object.fromEntries(new FormData(form)) : {};
  if (form) filters.savedOnly = form.elements.savedOnly.checked;
  const visible = form ? selectGames(games, filters, favorites)
    : ['hades', 'hollow-knight', 'a-short-hike', 'portal-2'].map(id => games.find(game => game.id === id)).filter(Boolean);
  renderMarkup(grid, visible.map(game => gameCard(game, favorites)).join(''));
  status.textContent = form ? `${visible.length} of ${games.length} games · ${favorites.filter(id => games.some(game => game.id === id)).length} saved` : 'Four picks to spark your curiosity';
  if (empty) empty.hidden = visible.length !== 0;
}

function notify(message) {
  const notice = document.querySelector('#save-status');
  clearTimeout(noticeTimer);
  notice.textContent = message;
  noticeTimer = setTimeout(() => { notice.textContent = ''; }, 6500);
}

document.addEventListener('click', event => {
  const save = event.target.closest('[data-favorite]');
  if (save) {
    const id = save.dataset.favorite;
    const game = games.find(item => item.id === id);
    if (!game) return;
    favorites = toggleFavorite(favorites, id);
    const persistent = saveFavorites(storage, favorites);
    const saved = favorites.includes(id);
    notify(`${game.title} ${saved ? 'saved' : 'removed from saved games'}.${persistent ? '' : ' Storage is unavailable; changes last only for this page session.'}`);
    // Update buttons in place so a keyboard user's focus is not lost.
    document.querySelectorAll('[data-favorite]').forEach(button => {
      if (button.dataset.favorite !== id) return;
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? 'Unsave' : 'Save'} ${game.title}`);
      button.textContent = saved ? '♥ Saved' : '♡ Save';
    });
    if (form?.elements.savedOnly.checked) {
      const insideDialog = dialog.open;
      render();
      if (!insideDialog) form.elements.savedOnly.focus();
    } else if (form) {
      status.textContent = `${grid.children.length} of ${games.length} games · ${favorites.filter(value => games.some(item => item.id === value)).length} saved`;
    }
  }
  const quick = event.target.closest('[data-quick]');
  if (quick) {
    activeGame = games.find(game => game.id === quick.dataset.quick);
    if (!activeGame) return;
    opener = quick;
    renderMarkup(content, gameQuickView(activeGame, favorites));
    dialog.showModal();
    dialog.querySelector('.dialog-close').focus();
  }
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  if (opener?.isConnected) opener.focus();
  else form?.elements.savedOnly.focus();
});

if (form) {
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', render);
  form.addEventListener('reset', () => {
    // Reset defaults are applied after the reset event finishes.
    queueMicrotask(render);
  });
  document.querySelector('#reset-empty').addEventListener('click', () => {
    form.reset(); form.elements.search.focus();
  });
}

async function initialize() {
  try {
    games = await loadGames();
    if (form) {
      for (const [field, options] of [
        ['genre', [...new Set(games.map(game => game.genre))].sort()],
        ['platform', [...new Set(games.flatMap(game => game.platforms))].sort()]
      ]) {
        options.forEach(value => form.elements[field].add(new Option(value, value)));
      }
      const parameters = new URLSearchParams(location.search);
      form.elements.search.value = parameters.get('search') || '';
      const genre = parameters.get('genre');
      if ([...form.elements.genre.options].some(option => option.value === genre)) form.elements.genre.value = genre;
      form.elements.savedOnly.checked = parameters.get('saved') === '1';
    }
    render();
  } catch {
    status.textContent = 'We could not load the games. Check your connection and try again. This site needs to be served over HTTP, not opened as a local file.';
    const retry = document.createElement('button');
    retry.type = 'button'; retry.className = 'button'; retry.textContent = 'Try again';
    retry.addEventListener('click', () => { grid.replaceChildren(); initialize(); });
    grid.replaceChildren(retry);
    if (form) [...form.elements].forEach(element => { element.disabled = true; });
  }
  if (games.length && form) [...form.elements].forEach(element => { element.disabled = false; });
}
initialize();
