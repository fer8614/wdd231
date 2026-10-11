import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const pages = ['index.html', 'games.html', 'game.html', 'thank-you.html', 'sources.html'];

test('all five heads load Roboto before local CSS with both preconnects', async () => {
  for (const page of pages) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    const head = html.match(/<head>(.*?)<\/head>/s)[1];
    const links = [...head.matchAll(/<link\b[^>]*>/g)].map(match => match[0]);
    const styles = links.filter(link => /rel="stylesheet"/.test(link));
    assert.equal(styles.length, 2, page);
    assert.match(styles[0], /href="https:\/\/fonts\.googleapis\.com\/css2\?family=Roboto:wght@400;700&amp;display=swap"/, page);
    assert.match(styles[1], /href="styles\/site\.css"/, page);
    for (const host of ['fonts.googleapis.com', 'fonts.gstatic.com']) {
      const connections = links.filter(link => link.includes(`href="https://${host}"`) && /rel="preconnect"/.test(link));
      assert.equal(connections.length, 1, `${page}: ${host}`);
      if (host === 'fonts.gstatic.com') assert.match(connections[0], /\scrossorigin(?:="(?:anonymous)?")?[\s>]/, page);
    }
  }
});

test('body keeps size, line height, fallback stack and inherited controls', async () => {
  const css = await readFile(new URL('../styles/site.css', import.meta.url), 'utf8');
  assert.match(css, /body\s*\{[^}]*font:\s*16px\/1\.6 "Roboto", Arial, Helvetica, sans-serif;/);
  assert.match(css, /button, input, select\s*\{\s*font: inherit;/);
  assert.match(css, /#recommendation-form input, textarea\s*\{[^}]*font: inherit;/);
});

test('brand images stay decorative beside visible text and site-plan links stay absent', async () => {
  for (const page of pages) {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    const brand = html.match(/<a class="brand"[^>]*>(.*?)<\/a>/s)[1];
    const images = [...brand.matchAll(/<img\b[^>]*>/g)];
    assert.equal(images.length, 1, page);
    assert.match(images[0][0], /\salt=""/, page);
    assert.match(images[0][0], /\saria-hidden="true"/, page);
    assert.match(brand, />Video Game <span>Guide<\/span>/, page);
    assert.doesNotMatch(html, /href="[^"]*(?:game-guide|site-plan)[^"]*"/i, page);
  }
});

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
