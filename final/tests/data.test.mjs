import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { escapeHTML, gameCard, loadGames } from '../scripts/render.mjs';
const games = JSON.parse(fs.readFileSync(new URL('../data/games.json', import.meta.url)));
test('15 real games have complete, unique, credited records', () => {
  assert.equal(games.length, 15);
  assert.equal(new Set(games.map(game => game.id)).size, 15);
  for (const game of games) {
    for (const field of ['title', 'genre', 'description', 'developer', 'ratingBasis', 'artCredit']) assert.ok(game[field].length > 2);
    assert.ok(game.platforms.length);
    assert.ok(game.rating >= 0 && game.rating <= 10);
    assert.match(game.artSource, /^https:\/\/cdn\.akamai\.steamstatic\.com\/steam\/apps\/\d+\/header\.jpg$/);
    const bytes = fs.statSync(new URL(`../${game.image}`, import.meta.url)).size;
    assert.ok(bytes < 125000, `${game.image}: ${bytes}`);
  }
});
test('render helpers escape text and include intrinsic dimensions and editorial labels', () => {
  assert.equal(escapeHTML('<script>"&\''), '&lt;script&gt;&quot;&amp;&#39;');
  const card = gameCard({ ...games[0], title: '<script>alert(1)</script>' }, []);
  assert.ok(!card.includes('<script>'));
  assert.match(card, /width="460" height="215"/);
  assert.match(card, /Editorial discovery score/);
  assert.match(card, /aria-pressed="false"/);
});
test('fetch handles HTTP, malformed JSON, malformed records and success', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({ ok: false });
    await assert.rejects(loadGames());
    globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError('bad JSON'); } });
    await assert.rejects(loadGames());
    globalThis.fetch = async () => ({ ok: true, json: async () => [{}] });
    await assert.rejects(loadGames());
    globalThis.fetch = async () => ({ ok: true, json: async () => games });
    assert.equal((await loadGames()).length, 15);
  } finally { globalThis.fetch = original; }
});
