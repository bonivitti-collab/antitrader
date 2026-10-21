import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { Pool } from 'pg';
import { createClient } from 'redis';
import type { HealthResponse } from './types/index.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? '127.0.0.1';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT deve ser um inteiro entre 1 e 65535.');
}
if (!process.env.DATABASE_URL || !process.env.REDIS_URL ||
    !process.env.POSTGRES_PASSWORD || !process.env.REDIS_PASSWORD) {
  throw new Error('Configure as URLs e senhas de PostgreSQL e Redis no arquivo .env.');
}

const databaseUrl = new URL(process.env.DATABASE_URL);
databaseUrl.password = process.env.POSTGRES_PASSWORD;
const database = new Pool({
  connectionString: databaseUrl.toString(),
  connectionTimeoutMillis: 5000,
  query_timeout: 5000,
});
const cache = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  disableOfflineQueue: true,
  socket: { connectTimeout: 5000, reconnectStrategy: false },
});

database.on('error', () => console.error('Conexão PostgreSQL interrompida.'));
cache.on('error', () => console.error('Conexão Redis interrompida.'));

const app = express();
app.disable('x-powered-by');
app.use('/api', rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_request, response) => {
  const results = await Promise.allSettled([database.query('SELECT 1'), cache.ping()]);
  const healthy = results.every((result) => result.status === 'fulfilled');
  const body: HealthResponse = {
    status: healthy ? 'ok' : 'degraded',
    services: {
      postgres: results[0].status === 'fulfilled' ? 'up' : 'down',
      redis: results[1].status === 'fulfilled' ? 'up' : 'down',
    },
  };
  response.set('Cache-Control', 'no-store').status(healthy ? 200 : 503).json(body);
});

try {
  const connections = await Promise.allSettled([database.query('SELECT 1'), cache.connect()]);
  if (connections.some((connection) => connection.status === 'rejected')) {
    throw new Error('Serviços indisponíveis.');
  }
  const server = app.listen(port, host, () => {
    console.log(`AntiTrader API: http://${host}:${port}`);
  });

  let stopping = false;
  const shutdown = () => {
    if (stopping) return;
    stopping = true;
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(() => {
      void Promise.allSettled([
        database.end(),
        cache.isOpen ? cache.quit() : Promise.resolve(),
      ]).then(() => {
        clearTimeout(timeout);
      });
    });
  };
  server.on('error', () => {
    console.error('Não foi possível iniciar o servidor HTTP.');
    process.exitCode = 1;
    shutdown();
  });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch {
  console.error('Falha na inicialização. Verifique PostgreSQL, Redis e as variáveis de ambiente.');
  await database.end();
  if (cache.isOpen) cache.destroy();
  process.exitCode = 1;
}
