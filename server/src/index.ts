import http from 'http';
import cron from 'node-cron';
import { createApp } from './app';
import { config } from './config';
import { connectMongo } from './config/mongo';
import { setupSocket } from './socket';
import { createScoreRecomputeQueue, createScoreRecomputeWorker } from './jobs/scoreRecompute';
import { createDeadlineQueue, createDeadlineWorker, scheduleDeadlineAlerts } from './jobs/deadlineGuardian';
import { OpportunityModel } from './models/Opportunity';

async function main() {
  // ─── Connect infrastructure ─────────────────────────────────────────────────
  await connectMongo();

  // ─── HTTP + Socket.IO ────────────────────────────────────────────────────────
  const app = createApp();
  const httpServer = http.createServer(app);
  const io = setupSocket(httpServer);

  app.set('io', io);

  // ─── BullMQ queues + workers ─────────────────────────────────────────────────
  const scoreQueue    = createScoreRecomputeQueue();
  const deadlineQueue = createDeadlineQueue();

  createScoreRecomputeWorker(io);
  createDeadlineWorker(io);

  // Make deadline queue available to routes (admin endpoint)
  app.set('deadlineQueue', deadlineQueue);

  // ─── Schedule alerts for all active opportunities on startup ─────────────────
  const activeOpps = await OpportunityModel.find({
    status: { $in: ['new', 'shortlisted', 'registered', 'in_progress'] },
  }).lean();

  for (const opp of activeOpps) {
    await scheduleDeadlineAlerts(
      deadlineQueue,
      opp._id.toString(),
      opp.title,
      {
        registrationDeadline: opp.dates?.registrationDeadline,
        submissionDeadline:   opp.dates?.submissionDeadline,
        eventDate:            opp.dates?.eventDate,
      }
    );
  }

  console.log(`⏰ Deadline Guardian: scheduled alerts for ${activeOpps.length} opportunities`);

  // ─── Cron: recompute scores every hour ───────────────────────────────────────
  cron.schedule('0 * * * *', async () => {
    await scoreQueue.add('recompute', {}, { removeOnComplete: 10, removeOnFail: 5 });
  });

  // Run once on startup
  await scoreQueue.add('recompute-startup', {}, { removeOnComplete: 1 });

  // ─── Start listening ──────────────────────────────────────────────────────────
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

  // ─── Graceful shutdown ────────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    await deadlineQueue.close();
    await scoreQueue.close();
    httpServer.close(() => process.exit(0));
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});
