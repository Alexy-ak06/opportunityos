import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../config/redis';
import { OpportunityModel } from '../models/Opportunity';
import { ALERT_THRESHOLDS_DAYS } from '@opportunityos/shared';
import type { DeadlineAlert, AlertThreshold, OpportunityStatus } from '@opportunityos/shared';
import type { Server as SocketServer } from 'socket.io';

// ─── Queue ────────────────────────────────────────────────────────────────────

const QUEUE_NAME = 'deadline-guardian';

export function createDeadlineQueue() {
  return new Queue(QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
      removeOnComplete: 20,
      removeOnFail: 10,
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    },
  });
}

// ─── Job payload ──────────────────────────────────────────────────────────────

export interface DeadlineJobPayload {
  opportunityId: string;
  opportunityTitle: string;
  deadlineType: 'registration' | 'submission' | 'event';
  deadlineDate: string; // ISO string
  threshold: AlertThreshold; // days
}

// ─── Statuses that deserve alerts ────────────────────────────────────────────

const ACTIONABLE_STATUSES: OpportunityStatus[] = ['new', 'shortlisted', 'registered', 'in_progress'];

// ─── Job ID — deterministic, prevents duplicate alerts ───────────────────────

function jobId(opportunityId: string, deadlineType: string, threshold: number): string {
  return `deadline-${opportunityId}-${deadlineType}-${threshold}d`;
}

// ─── Schedule alerts for one opportunity ─────────────────────────────────────

export async function scheduleDeadlineAlerts(
  queue: Queue,
  opportunityId: string,
  opportunityTitle: string,
  dates: {
    registrationDeadline?: Date;
    submissionDeadline?: Date;
    eventDate?: Date;
  }
): Promise<void> {
  const now = Date.now();

  const deadlines: Array<{ type: DeadlineJobPayload['deadlineType']; date: Date | undefined }> = [
    { type: 'registration', date: dates.registrationDeadline },
    { type: 'submission',   date: dates.submissionDeadline   },
    { type: 'event',        date: dates.eventDate            },
  ];

  for (const { type, date } of deadlines) {
    if (!date) continue;
    const deadlineMs = new Date(date).getTime();

    for (const thresholdDays of ALERT_THRESHOLDS_DAYS) {
      const fireAt = deadlineMs - thresholdDays * 24 * 60 * 60 * 1000;
      const delay  = fireAt - now;

      // Skip if the alert time has already passed
      if (delay <= 0) continue;

      const id = jobId(opportunityId, type, thresholdDays);

      const payload: DeadlineJobPayload = {
        opportunityId,
        opportunityTitle,
        deadlineType: type,
        deadlineDate: date.toISOString(),
        threshold: thresholdDays,
      };

      // Upsert: remove old job with same ID then re-add
      // This handles deadline changes correctly
      const existing = await queue.getJob(id);
      if (existing) await existing.remove();

      await queue.add('alert', payload, {
        jobId: id,
        delay,
      });

      console.log(
        `⏰ Scheduled ${thresholdDays}d alert for "${opportunityTitle}" [${type}] ` +
        `fires in ${Math.round(delay / 1000 / 60 / 60)}h`
      );
    }
  }
}

// ─── Cancel all alerts for an opportunity ────────────────────────────────────

export async function cancelDeadlineAlerts(
  queue: Queue,
  opportunityId: string
): Promise<void> {
  const types: DeadlineJobPayload['deadlineType'][] = ['registration', 'submission', 'event'];

  for (const type of types) {
    for (const threshold of ALERT_THRESHOLDS_DAYS) {
      const id = jobId(opportunityId, type, threshold);
      const job = await queue.getJob(id);
      if (job) {
        await job.remove();
        console.log(`🗑️  Cancelled alert: ${id}`);
      }
    }
  }
}

// ─── List all scheduled alerts (admin/debug endpoint) ────────────────────────

export async function listScheduledAlerts(queue: Queue) {
  const delayed = await queue.getDelayed();
  return delayed.map(job => ({
    id: job.id,
    payload: job.data as DeadlineJobPayload,
    fireAt: new Date(Date.now() + (job.opts.delay ?? 0)).toISOString(),
    delayMs: job.opts.delay,
  }));
}

// ─── Detect overlapping events ────────────────────────────────────────────────

export async function detectConflicts(opportunityId: string): Promise<string[]> {
  const opp = await OpportunityModel.findById(opportunityId).lean();
  if (!opp?.dates?.eventDate) return [];

  const eventDate = new Date(opp.dates.eventDate);
  const dayBefore  = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
  const dayAfter   = new Date(eventDate.getTime() + 24 * 60 * 60 * 1000);

  const conflicts = await OpportunityModel.find({
    _id: { $ne: opportunityId },
    status: { $in: ACTIONABLE_STATUSES },
    'dates.eventDate': { $gte: dayBefore, $lte: dayAfter },
  }).select('title').lean();

  return conflicts.map(c => c.title);
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export function createDeadlineWorker(io?: SocketServer) {
  const worker = new Worker<DeadlineJobPayload>(
    QUEUE_NAME,
    async (job: Job<DeadlineJobPayload>) => {
      const { opportunityId, opportunityTitle, deadlineType, deadlineDate, threshold } = job.data;

      // Verify opportunity is still actionable
      const opp = await OpportunityModel.findById(opportunityId).select('status').lean();
      if (!opp || !ACTIONABLE_STATUSES.includes(opp.status as OpportunityStatus)) {
        console.log(`⏭️  Skipping alert for ${opportunityTitle} — status: ${opp?.status ?? 'not found'}`);
        return;
      }

      const deadlineMs   = new Date(deadlineDate).getTime();
      const hoursRemaining = Math.round((deadlineMs - Date.now()) / (1000 * 60 * 60));

      const alert: DeadlineAlert = {
        opportunityId,
        opportunityTitle,
        deadlineType,
        deadlineDate: new Date(deadlineDate),
        hoursRemaining,
        threshold,
      };

      // ── In-app alert via Socket.IO ──────────────────────────────────────────
      io?.emit('deadline:alert', alert);

      // ── Console log (Telegram wired in Phase 1.7) ──────────────────────────
      console.log(
        `🔔 DEADLINE ALERT: "${opportunityTitle}" — ${deadlineType} deadline in ${threshold} days ` +
        `(${hoursRemaining}h remaining)`
      );
    },
    { connection: redis }
  );

  worker.on('completed', job => {
    console.log(`✅ Alert fired: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Alert failed: ${job?.id}`, err);
  });

  return worker;
}
