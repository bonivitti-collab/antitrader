import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.NODE_ENV = 'test';
process.env.LIVE_QUOTE_DATA_ENABLED = 'false';
delete process.env.GEMINI_API_KEY;
delete process.env.GEMINI_API_KEY_BACKUP;

const { default: app, getLiveQuoteDetails } = await import('./server.ts');

test('disabled market data never calls providers, even without a local snapshot', async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    throw new Error('External calls are forbidden');
  };
  try {
    assert.equal(await getLiveQuoteDetails('UNKNOWN-TICKER', 'US'), null);
    const snapshot = await getLiveQuoteDetails('PETR4', 'B3');
    assert.ok(snapshot && snapshot.price > 0);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('health check works without optional provider or Gemini keys', async () => {
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    assert.equal(response.status, 200);
    const health = await response.json();
    assert.equal(health.status, 'FROZEN');
    assert.equal(health.marketDataEnabled, false);
    assert.ok(health.providers);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  }
});
