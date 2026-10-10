const STORAGE_KEY = 'game-guide:favorites';

export function selectGames(games, filters = {}, favorites = []) {
  const query = (filters.search || '').trim().toLowerCase();
  return games.filter(game =>
    (!query || `${game.title} ${game.description} ${game.genre}`.toLowerCase().includes(query)) &&
    (!filters.genre || game.genre === filters.genre) &&
    (!filters.platform || game.platforms.includes(filters.platform)) &&
    game.rating >= Number(filters.minimum || 0) &&
    (!filters.savedOnly || favorites.includes(game.id))
  ).sort((a, b) => filters.sort === 'rating'
    ? b.rating - a.rating || a.title.localeCompare(b.title)
    : a.title.localeCompare(b.title));
}

export function readFavorites(storage) {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string'))] : [];
  } catch { return []; }
}

export function saveFavorites(storage, ids) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(ids)); return true; }
  catch { return false; }
}

export function toggleFavorite(ids, id) {
  return ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id];
}
