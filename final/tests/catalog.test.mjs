import test from 'node:test';
import assert from 'node:assert/strict';
import { selectGames, readFavorites, saveFavorites, toggleFavorite } from '../scripts/catalog.mjs';
const games = [
  { id: 'b', title: 'Beta', genre: 'RPG', platforms: ['PC'], rating: 9, description: 'Space journey' },
  { id: 'a', title: 'Alpha', genre: 'Adventure', platforms: ['Switch'], rating: 8, description: 'Quiet island' },
  { id: 'c', title: 'Gamma', genre: 'RPG', platforms: ['PC', 'Switch'], rating: 7, description: 'Forest journey' }
];
test('combines search, genre, platform, score and saved filters', () => {
  assert.deepEqual(selectGames(games, { search: ' JOURNEY ', genre: 'RPG', platform: 'PC', minimum: 8, savedOnly: true }, ['b']).map(g => g.id), ['b']);
  assert.equal(selectGames(games, { search: 'missing' }).length, 0);
  assert.equal(selectGames(games, {}).length, 3);
});
test('sorts without mutating source and supports score ordering', () => {
  assert.deepEqual(selectGames(games, { sort: 'title' }).map(g => g.id), ['a', 'b', 'c']);
  assert.deepEqual(selectGames(games, { sort: 'rating' }).map(g => g.id), ['b', 'a', 'c']);
  assert.equal(games[0].id, 'b');
});
test('favorites reject corrupt storage and normalize IDs', () => {
  for (const value of ['broken', '{}', 'null']) assert.deepEqual(readFavorites({ getItem: () => value }), []);
  assert.deepEqual(readFavorites({ getItem: () => '["a","a",4,"b"]' }), ['a', 'b']);
  assert.deepEqual(readFavorites({ getItem() { throw Error('denied'); } }), []);
  assert.deepEqual(toggleFavorite(['a'], 'a'), []);
  assert.deepEqual(toggleFavorite([], 'a'), ['a']);
});
test('storage failures do not stop session favorites', () => {
  assert.equal(saveFavorites({ setItem() { throw Error('quota'); } }, ['a']), false);
  let stored;
  assert.equal(saveFavorites({ setItem(key, value) { stored = JSON.parse(value); } }, ['a']), true);
  assert.deepEqual(stored, ['a']);
});
