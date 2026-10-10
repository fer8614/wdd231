export function selectDetail(games, query) {
  const params = new URLSearchParams(query);
  const id = params.has('id') ? params.get('id') : 'stardew-valley';
  return games.find(game => game.id === id) || null;
}

export function relatedGames(games, selected, limit = 3) {
  if (!selected) return [];
  const affinity = game => (game.genre === selected.genre ? 10 : 0) +
    game.platforms.filter(platform => selected.platforms.includes(platform)).length;
  return games.filter(game => game.id !== selected.id)
    .sort((a, b) => affinity(b) - affinity(a) || a.id.localeCompare(b.id))
    .slice(0, limit);
}

export function confirmationFields(query) {
  const params = new URLSearchParams(query);
  return [['name', 'Name'], ['email', 'Email'], ['platform', 'Preferred platform'],
    ['game', 'Selected game'], ['message', 'Message or recommendation']]
    .filter(([key]) => params.get(key)?.trim())
    .map(([key, label]) => [label, params.get(key)]);
}

export function displayConfirmation(target, query) {
  const nodes = confirmationFields(query).flatMap(([label, value]) => {
    const term = target.ownerDocument.createElement('dt');
    const detail = target.ownerDocument.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    return [term, detail];
  });
  target.replaceChildren(...nodes);
  return nodes.length > 0;
}
