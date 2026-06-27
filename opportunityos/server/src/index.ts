import http from 'http';
import cron from 'node-cron';
import { createApp } from './app';
import { config } from './config';
import { connectMongo } from './config/mongo';
import { setupSocket } from './socket';
import { createScoreRecomputeQueue, createScoreRecomputeWorker } from './jobs/scoreRecompute';

async function main() {
  // ─── Connect infrastructure ─────────────────────────────────────────────────
  await connectMongo();

  // ─── HTTP + Socket.IO ────────────────────────────────────────────────────────
  const app = createApp();
  const httpServer = http.createServer(app);
  const io = setupSocket(httpServer);

  // Make io available to route handlers via app locals
  app.set('io', io);

  // ─── BullMQ workers ──────────────────────────────────────────────────────────
  const scoreQueue = createScoreRecomputeQueue();
  createScoreRecomputeWorker(io);

  // ─── Cron: recompute scores every hour ──────────────────────────────────────
  cron.schedule('0 * * * *', async () => {
    await scoreQueue.add('recompute', {}, { removeOnComplete: 10, removeOnFail: 5 });
  });

  // Run once on startup
  await scoreQueue.add('recompute-startup', {}, { removeOnComplete: 1 });

  // ─── Start listening ─────────────────────────────────────────────────────────
  httpServer.listen(config.port, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║          OpportunityOS Server v1.0            ║
╠═══════════════════════════════════════════════╣
║  Mode  : ${config.env.padEnd(35)}║
║  Port  : ${String(config.port).padEnd(35)}║
║  Mongo : ${config.mongo.uri.padEnd(35)}║
╚═══════════════════════════════════════════════╝
    `);
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    httpServer.close(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
