import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pages = ['index.html', 'games.html', 'game.html', 'thank-you.html', 'sources.html'];

test('all five menu triggers retain Menu name and state with a decorative hamburger', async () => {
  for (const page of pages) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    const buttons = [...html.matchAll(/<button\b[^>]*class="menu-toggle"[^>]*>(.*?)<\/button>/gs)];
    assert.equal(buttons.length, 1, page);
    const [button, content] = buttons[0];
    assert.match(button, /type="button"/, page);
    assert.match(button, /aria-expanded="false"/, page);
    assert.match(button, /aria-controls="navigation"/, page);
    assert.match(button, /\shidden[\s>]/, page);
    assert.equal(content, '<span aria-hidden="true">☰</span> Menu', page);
    assert.match(html, /<nav id="navigation" aria-label="Main navigation">/, page);
  }
});
