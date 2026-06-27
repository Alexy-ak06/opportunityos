import { Queue, Worker } from 'bullmq';
import { redis } from '../config/redis';
import { OpportunityModel } from '../models/Opportunity';
import { computeROI, isOpportunityExpired } from '@opportunityos/shared';
import type { Server as SocketServer } from 'socket.io';

const QUEUE_NAME = 'score-recompute';

export function createScoreRecomputeQueue() {
  return new Queue(QUEUE_NAME, { connection: redis });
}

export function createScoreRecomputeWorker(io?: SocketServer) {
  const worker = new Worker(
    QUEUE_NAME,
    async () => {
      console.log('⚙️  Recomputing ROI scores...');
      const now = new Date();

      // Only recompute actionable opportunities
      const opportunities = await OpportunityModel.find({
        status: { $in: ['new', 'shortlisted', 'registered', 'in_progress'] },
      });

      let updated = 0;

      for (const opp of opportunities) {
        const { roi } = computeROI({
          baseScores: opp.baseScores,
          dates: opp.dates,
          category: opp.category,
          now,
        });

        const expired = isOpportunityExpired(opp.dates, now);

        opp.currentScore = roi;
        opp.scoreUpdatedAt = now;
        if (expired) opp.status = 'expired';

        await opp.save();

        io?.emit('opportunity:scores_refreshed', {
          id: opp._id.toString(),
          currentScore: roi,
        });

        updated++;
      }

      console.log(`✅ Recomputed scores for ${updated} opportunities`);
    },
    { connection: redis }
  );

  worker.on('failed', (job, err) => {
    console.error(`❌ Score recompute job ${job?.id} failed:`, err);
  });

  return worker;
}
