import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const pages = ['index.html', 'games.html', 'game.html', 'thank-you.html', 'sources.html'];
test('implemented pages have valid local references and unique metadata', async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of pages) {
    const html = await readFile(new URL(page, root), 'utf8');
    titles.add(html.match(/<title>(.*?)<\/title>/)[1]);
    descriptions.add(html.match(/name="description" content="([^"]+)"/)[1]);
    assert.match(html, /name="author" content="Yesid Fernando Cepeda"/);
    assert.match(html, /href="sources.html"/);
    assert.match(html, /property="og:url"/);
    for (const [, reference] of html.matchAll(/(?:src|href|action)="([^"]+)"/g)) {
      if (/^(https?:|#)/.test(reference)) continue;
      await stat(new URL(reference.split('?')[0], root));
    }
  }
  assert.equal(titles.size, pages.length);
  assert.equal(descriptions.size, pages.length);
});
test('all collection artwork and conservative entire implemented-site payload meet budgets', async t => {
  const games = JSON.parse(await readFile(new URL('data/games.json', root)));
  let total = 0;
  const files = new Set([...pages, 'styles/site.css', 'data/games.json', 'images/favicon.svg', ...games.map(game => game.image)]);
  for (const file of await readdir(new URL('scripts/', root))) if (file.endsWith('.mjs')) files.add(`scripts/${file}`);
  for (const file of files) {
    const bytes = (await stat(new URL(file, root))).size;
    total += bytes;
    if (file.startsWith('images/')) assert.ok(bytes < 125000, `${file}: ${bytes}`);
  }
  assert.ok(total < 500000, `Entire implemented site: ${total} bytes`);
  t.diagnostic(`Entire implemented-site cold payload upper bound: ${total} bytes, excluding HTTP headers.`);
  for (const game of games) {
    assert.match(game.ratingBasis, /subjective demonstration/);
    assert.match(game.ratingBasis, /not aggregated/);
    assert.match(game.source, /^https:\/\/store\.steampowered\.com\/app\//);
  }
});
