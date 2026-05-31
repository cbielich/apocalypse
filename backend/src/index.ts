import Fastify from 'fastify';
import cors from '@fastify/cors';
import cron from 'node-cron';
import { config } from './config';
import { registerRoutes } from './routes';
import { runPoll } from './poller/poll';
import './db';

async function main(): Promise<void> {
  const app = Fastify({ logger: false });
  await app.register(cors, { origin: true });
  await registerRoutes(app);

  app.setErrorHandler((err: Error & { statusCode?: number }, _req, reply) => {
    reply.status(err.statusCode || 500).send({ error: { message: err.message } });
  });

  await app.listen({ port: config.port, host: '0.0.0.0' });
  console.log(`[server] listening on :${config.port}`);

  // Poll once on boot, then on the configured schedule.
  void runPoll();
  cron.schedule(config.pollCron, () => void runPoll());
  console.log(`[poller] scheduled: ${config.pollCron}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
