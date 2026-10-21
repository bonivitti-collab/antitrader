import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.NODE_ENV = 'test';
process.env.LIVE_QUOTE_DATA_ENABLED = 'true';
delete process.env.FINNHUB_API_KEY;
delete process.env.ALPHA_VANTAGE_API_KEY;

const { getLiveQuoteDetails } = await import('./server.ts');

test('fails over from Brapi to Yahoo, caches results and serves stale cache on outage', async (t) => {
  const requests: string[] = [];
  let offline = false;
  t.mock.method(globalThis, 'fetch', async (input: string | URL) => {
    const url = String(input);
    requests.push(url);
    if (offline || new URL(url).hostname === 'brapi.dev') {
      return new Response('{}', { status: 503 });
    }
    return Response.json({
      chart: { result: [{ meta: { regularMarketPrice: 35, chartPreviousClose: 34 } }] },
    });
  });

  const quote = await getLiveQuoteDetails('PETR4', 'B3');
  assert.equal(quote?.price, 35);
  assert.equal(quote?.currency, 'BRL');
  assert.match(quote?.source ?? '', /Yahoo Finance/);
  assert.equal(new URL(requests[0]).hostname, 'brapi.dev');
  assert.equal(new URL(requests[1]).hostname, 'query1.finance.yahoo.com');

  requests.length = 0;
  assert.deepEqual(await getLiveQuoteDetails('PETR4', 'B3'), quote);
  assert.equal(requests.length, 0);

  offline = true;
  const expiredTime = Date.now() + 31_000;
  t.mock.method(Date, 'now', () => expiredTime);
  const stale = await getLiveQuoteDetails('PETR4', 'B3');
  assert.equal(stale?.price, 35);
  assert.match(stale?.source ?? '', /desatualizado/);
  assert.equal(requests.length, 3);
});
