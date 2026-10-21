import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CircuitBreaker, CircuitOpenError } from './circuitBreaker.ts';

test('opens after repeated failures and closes after a successful probe', async () => {
  const breaker = new CircuitBreaker(2, 25);
  const failingCall = () => Promise.reject(new Error('provider unavailable'));

  await assert.rejects(breaker.call(failingCall), /provider unavailable/);
  await assert.rejects(breaker.call(failingCall), /provider unavailable/);
  assert.equal(breaker.snapshot().state, 'OPEN');
  await assert.rejects(breaker.call(async () => 'unavailable'), CircuitOpenError);

  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(await breaker.call(async () => 'recovered'), 'recovered');
  assert.deepEqual(breaker.snapshot().state, 'CLOSED');
  assert.equal(breaker.snapshot().failures, 0);
});

test('resets its failure count after a successful call', async () => {
  const breaker = new CircuitBreaker(3, 30_000);

  await assert.rejects(breaker.call(() => Promise.reject(new Error('temporary'))));
  await breaker.call(async () => 'ok');

  assert.equal(breaker.snapshot().state, 'CLOSED');
  assert.equal(breaker.snapshot().failures, 0);
});
