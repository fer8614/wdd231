import './navigation.mjs';
import { loadGames, renderMarkup, escapeHTML as e } from './render.mjs';
const status = document.querySelector('#sources-status');
// Publisher credits correspond to the linked PC Steam editions, not every console edition.
const publishers = {
  'stardew-valley': 'ConcernedApe', 'hollow-knight': 'Team Cherry',
  hades: 'Supergiant Games', celeste: 'Maddy Makes Games', 'portal-2': 'Valve',
  terraria: 'Re-Logic', 'slay-the-spire': 'Mega Crit', 'baldurs-gate-3': 'Larian Studios',
  'elden-ring': 'FromSoftware / Bandai Namco Entertainment', 'outer-wilds': 'Annapurna Interactive',
  'a-short-hike': 'adamgryu', unpacking: 'Humble Games', 'disco-elysium': 'ZA/UM',
  'civilization-vi': '2K', 'dead-cells': 'Motion Twin'
};
async function initialize() {
  try {
    const games = await loadGames();
    renderMarkup(document.querySelector('#source-list'), games.map(game => `<article class="source-credit"><h3>${e(game.title)}</h3><p>${e(game.artCredit)}</p><p>Developer: ${e(game.developer)}. Steam-edition publisher: ${e(publishers[game.id])}. <a href="${e(game.source)}">Official Steam listing and factual reference</a> · <a href="${e(game.artSource)}">Original Steam CDN artwork</a> · <a href="${e(game.image)}">Optimized local artwork</a></p></article>`).join(''));
    status.textContent = `${games.length} games credited. Steam listings identify the relevant publisher and developer.`;
  } catch {
    status.textContent = 'Credits could not be loaded. Serve this site over HTTP and try again.';
    const retry = document.createElement('button');
    retry.type = 'button'; retry.textContent = 'Try again'; retry.className = 'button';
    retry.addEventListener('click', () => { retry.remove(); initialize(); });
    status.after(retry);
  }
}
initialize();
