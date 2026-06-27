import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { OpportunityModel } from '../models/Opportunity';
import { computeROI } from '@opportunityos/shared';
import type { OpportunityStatus, DecisionAction } from '@opportunityos/shared';
import { scheduleDeadlineAlerts, cancelDeadlineAlerts } from '../jobs/deadlineGuardian';

export const opportunitiesRouter = Router();

// ─── Validation schemas ───────────────────────────────────────────────────────

const BaseScoresSchema = z.object({
  resumeValue:    z.number().min(1).max(10),
  learningValue:  z.number().min(1).max(10),
  placementValue: z.number().min(1).max(10),
  timeRequired:   z.number().min(1).max(10),
  reachValue:     z.number().min(1).max(10),
});

const DatesSchema = z.object({
  registrationDeadline: z.string().datetime().optional(),
  submissionDeadline:   z.string().datetime().optional(),
  eventDate:            z.string().datetime().optional(),
  announcedAt:          z.string().datetime().optional(),
}).optional();

const CreateOpportunitySchema = z.object({
  title:       z.string().min(3).max(300),
  description: z.string().min(10),
  source:      z.enum(['manual','devpost','unstop','mlh','hackerearth','devfolio','gssoc','internshala','linkedin']),
  category:    z.enum(['hackathon','certification','internship','open-source','event','conference','hiring-challenge','fellowship','scholarship']),
  url:         z.string().url(),
  imageUrl:    z.string().url().optional(),
  organizer:   z.string().optional(),
  location:    z.string().optional(),
  isOnline:    z.boolean().default(true),
  prizePool:   z.string().optional(),
  teamSize:    z.string().optional(),
  dates:       DatesSchema,
  baseScores:  BaseScoresSchema,
  tags:        z.array(z.string()).default([]),
});

const UpdateOpportunitySchema = CreateOpportunitySchema.partial().extend({
  status: z.enum(['new','shortlisted','registered','in_progress','completed','skipped','expired']).optional(),
  decisionReason: z.string().optional(),
});

// ─── Actionable statuses for Deadline Guardian ────────────────────────────────
const ACTIONABLE_STATUSES: OpportunityStatus[] = ['new', 'shortlisted', 'registered', 'in_progress'];

// ─── POST /api/opportunities ──────────────────────────────────────────────────

opportunitiesRouter.post('/', async (req: Request, res: Response) => {
  const parsed = CreateOpportunitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  const data = parsed.data;
  const dates = {
    registrationDeadline: data.dates?.registrationDeadline ? new Date(data.dates.registrationDeadline) : undefined,
    submissionDeadline:   data.dates?.submissionDeadline   ? new Date(data.dates.submissionDeadline)   : undefined,
    eventDate:            data.dates?.eventDate            ? new Date(data.dates.eventDate)            : undefined,
    announcedAt:          data.dates?.announcedAt          ? new Date(data.dates.announcedAt)          : undefined,
  };

  const { roi } = computeROI({ baseScores: data.baseScores, dates, category: data.category });

  const opportunity = await OpportunityModel.create({
    ...data,
    dates,
    currentScore: roi,
    scoreUpdatedAt: new Date(),
  });

  // Emit socket event (attached in index.ts)
  req.app.get('io')?.emit('opportunity:new', opportunity.toJSON());

  // Schedule deadline alerts
  const dq = req.app.get('deadlineQueue');
  if (dq) {
    await scheduleDeadlineAlerts(dq, opportunity._id.toString(), opportunity.title, {
      registrationDeadline: opportunity.dates?.registrationDeadline,
      submissionDeadline:   opportunity.dates?.submissionDeadline,
      eventDate:            opportunity.dates?.eventDate,
    });
  }

  return res.status(201).json({ success: true, data: opportunity });
});

// ─── GET /api/opportunities ───────────────────────────────────────────────────

opportunitiesRouter.get('/', async (req: Request, res: Response) => {
  const {
    status,
    category,
    source,
    sort = 'roi',
    page = '1',
    limit = '20',
    deadlineBefore,
    actionableOnly,
  } = req.query;

  const filter: Record<string, unknown> = {};

  if (status)         filter.status = status;
  if (category)       filter.category = category;
  if (source)         filter.source = source;
  if (actionableOnly === 'true') filter.status = { $in: ACTIONABLE_STATUSES };

  if (deadlineBefore) {
    filter['dates.registrationDeadline'] = { $lte: new Date(deadlineBefore as string) };
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    roi:      { currentScore: -1 },
    deadline: { 'dates.registrationDeadline': 1 },
    created:  { createdAt: -1 },
  };

  const sortQuery = sortMap[sort as string] ?? sortMap.roi;
  const pageNum   = Math.max(1, parseInt(page as string, 10));
  const limitNum  = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
  const skip      = (pageNum - 1) * limitNum;

  const [data, total] = await Promise.all([
    OpportunityModel.find(filter).sort(sortQuery).skip(skip).limit(limitNum).lean(),
    OpportunityModel.countDocuments(filter),
  ]);

  return res.json({ success: true, data, total, page: pageNum, limit: limitNum });
});

// ─── GET /api/opportunities/:id ───────────────────────────────────────────────

opportunitiesRouter.get('/:id', async (req: Request, res: Response) => {
  const opportunity = await OpportunityModel.findById(req.params.id).lean();
  if (!opportunity) return res.status(404).json({ success: false, error: 'Not found' });
  return res.json({ success: true, data: opportunity });
});

// ─── PATCH /api/opportunities/:id ────────────────────────────────────────────

opportunitiesRouter.patch('/:id', async (req: Request, res: Response) => {
  const parsed = UpdateOpportunitySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.flatten() });
  }

  const { decisionReason, status, ...rest } = parsed.data;

  const opportunity = await OpportunityModel.findById(req.params.id);
  if (!opportunity) return res.status(404).json({ success: false, error: 'Not found' });

  // Merge updates
  Object.assign(opportunity, rest);

  // Status transition → write decision log (training signal)
  if (status && status !== opportunity.status) {
    opportunity.status = status;
    opportunity.decisionLog.push({
      action:    status as DecisionAction,
      timestamp: new Date(),
      reason:    decisionReason,
    });
  }

  // Recompute score if scores or dates changed
  if (rest.baseScores || rest.dates) {
    const { roi } = computeROI({
      baseScores: opportunity.baseScores,
      dates: opportunity.dates,
      category: opportunity.category,
    });
    opportunity.currentScore = roi;
    opportunity.scoreUpdatedAt = new Date();
  }

  await opportunity.save();

  req.app.get('io')?.emit('opportunity:updated', opportunity.toJSON());

  // Reschedule alerts if dates changed, cancel if skipped/completed/expired
  const dq2 = req.app.get('deadlineQueue');
  if (dq2) {
    if (['skipped','completed','expired'].includes(opportunity.status)) {
      await cancelDeadlineAlerts(dq2, opportunity._id.toString());
    } else if (rest.dates) {
      await scheduleDeadlineAlerts(dq2, opportunity._id.toString(), opportunity.title, {
        registrationDeadline: opportunity.dates?.registrationDeadline,
        submissionDeadline:   opportunity.dates?.submissionDeadline,
        eventDate:            opportunity.dates?.eventDate,
      });
    }
  }

  return res.json({ success: true, data: opportunity });
});

// ─── DELETE /api/opportunities/:id ───────────────────────────────────────────

opportunitiesRouter.delete('/:id', async (req: Request, res: Response) => {
  const result = await OpportunityModel.findByIdAndDelete(req.params.id);
  if (!result) return res.status(404).json({ success: false, error: 'Not found' });
  return res.json({ success: true, message: 'Deleted' });
});
