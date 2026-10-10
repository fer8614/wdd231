import test from 'node:test';
import assert from 'node:assert/strict';
import { selectDetail, relatedGames, confirmationFields, displayConfirmation } from '../scripts/details.mjs';
const games = [
  { id: 'stardew-valley', genre: 'Simulation', platforms: ['PC'] },
  { id: 'farm', genre: 'Simulation', platforms: ['Switch'] },
  { id: 'puzzle', genre: 'Puzzle', platforms: ['PC'] },
  { id: 'other', genre: 'Action', platforms: ['Xbox'] }
];
test('missing id defaults; explicit empty and unknown ids do not', () => {
  assert.equal(selectDetail(games, '').id, 'stardew-valley');
  assert.equal(selectDetail(games, '?id=puzzle').id, 'puzzle');
  assert.equal(selectDetail(games, '?id='), null);
  assert.equal(selectDetail(games, '?id=missing'), null);
});
test('related games prioritize genre then shared platform without mutating or including self', () => {
  assert.deepEqual(relatedGames(games, games[0], 2).map(game => game.id), ['farm', 'puzzle']);
  assert.equal(games[0].id, 'stardew-valley');
  assert.deepEqual(relatedGames(games, null), []);
  assert.deepEqual(relatedGames([games[0]], games[0]), []);
});
test('confirmation allowlists fields, preserves malicious text and handles empty queries', () => {
  assert.deepEqual(confirmationFields(''), []);
  assert.deepEqual(confirmationFields('?name=%3Cscript%3Ealert(1)%3C%2Fscript%3E&email=a%40b.com&unknown=bad&game=Portal+2'), [
    ['Name', '<script>alert(1)</script>'], ['Email', 'a@b.com'], ['Selected game', 'Portal 2']
  ]);
  assert.deepEqual(confirmationFields('?message=&name=First&name=Second'), [['Name', 'First']]);
});
test('confirmation renderer uses textContent rather than interpreting markup', () => {
  const nodes = [];
  const document = { createElement: tag => ({ tag, textContent: '' }) };
  const target = { ownerDocument: document, replaceChildren: (...children) => nodes.push(...children) };
  displayConfirmation(target, '?message=%3Cimg+src=x+onerror=alert(1)%3E');
  assert.equal(nodes[1].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(nodes[1].tag, 'dd');
});
