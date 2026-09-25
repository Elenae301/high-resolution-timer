import test from 'node:test';
import assert from 'node:assert/strict';

import { HighResolutionTimer } from '../src/core.js';

function fakeClock() {
  let t = 0;
  return () => {
    const current = t;
    t += 10;
    return current;
  };
}

test('mark returns the current clock value', () => {
  const clock = fakeClock();
  const timer = new HighResolutionTimer(clock);

  assert.equal(timer.mark('a'), 0);
  assert.equal(timer.mark('b'), 10);
});

test('measure returns elapsed time between two marks', () => {
  const clock = fakeClock();
  const timer = new HighResolutionTimer(clock);

  timer.mark('start');
  timer.mark('end');

  assert.equal(timer.measure('start', 'end'), 10);
});

test('measure is order independent', () => {
  const clock = fakeClock();
  const timer = new HighResolutionTimer(clock);

  timer.mark('first');
  timer.mark('second');

  assert.equal(timer.measure('second', 'first'), 10);
});

test('measure throws when start mark is unknown', () => {
  const timer = new HighResolutionTimer(fakeClock());
  timer.mark('end');

  assert.throws(() => timer.measure('missing', 'end'), /Unknown mark: missing/);
});

test('measure throws when end mark is unknown', () => {
  const timer = new HighResolutionTimer(fakeClock());
  timer.mark('start');

  assert.throws(() => timer.measure('start', 'missing'), /Unknown mark: missing/);
});

test('clearMark removes a single mark', () => {
  const timer = new HighResolutionTimer(fakeClock());
  timer.mark('a');
  timer.mark('b');

  assert.equal(timer.clearMark('a'), true);
  assert.equal(timer.clearMark('a'), false);
  assert.throws(() => timer.measure('a', 'b'), /Unknown mark: a/);
  assert.equal(timer.measure('b', 'b'), 0);
});

test('clear removes all marks', () => {
  const timer = new HighResolutionTimer(fakeClock());
  timer.mark('a');
  timer.mark('b');

  timer.clear();

  assert.throws(() => timer.measure('a', 'b'), /Unknown mark: a/);
});

test('re-marking overwrites previous timestamp', () => {
  const clock = fakeClock();
  const timer = new HighResolutionTimer(clock);

  timer.mark('x');
  timer.mark('y');
  timer.mark('x');

  assert.equal(timer.measure('x', 'y'), 10);
});

test('measure with identical mark names returns zero', () => {
  const timer = new HighResolutionTimer(fakeClock());
  timer.mark('same');

  assert.equal(timer.measure('same', 'same'), 0);
});
