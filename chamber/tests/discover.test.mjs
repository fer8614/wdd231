import test from 'node:test';
import assert from 'node:assert/strict';
import { visitMessage } from '../scripts/discover-visit.mjs';

const now = 1760000000000;
const day = 86400000;
const welcome = 'Welcome! Let us know if you have any questions.';

test('absent, empty, invalid and future timestamps welcome visitors', () => {
  for (const value of [null, undefined, '', ' ', 'broken', 'Infinity', '-1', String(now + 1)]) {
    assert.equal(visitMessage(value, now), welcome);
  }
});
test('less than 24 hours includes a visit right now', () => {
  for (const elapsed of [0, day - 1]) {
    assert.equal(visitMessage(String(now - elapsed), now), 'Back so soon! Awesome!');
  }
});
test('exactly 24 hours uses singular', () => {
  assert.equal(visitMessage(String(now - day), now), 'You last visited 1 day ago.');
});
test('multiple days are floored and pluralized', () => {
  assert.equal(visitMessage(String(now - 2.9 * day), now), 'You last visited 2 days ago.');
});
