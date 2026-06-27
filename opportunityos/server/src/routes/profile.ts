import { Router } from 'express';
import { ProfileModel } from '../models';
import { GoalModel } from '../models';
import { ActivityLogModel } from '../models';

// ─── Profile ──────────────────────────────────────────────────────────────────

export const profileRouter = Router();

profileRouter.get('/', async (_req, res) => {
  const profile = await ProfileModel.findOne().lean();
  if (!profile) return res.status(404).json({ success: false, error: 'Profile not set up yet' });
  return res.json({ success: true, data: profile });
});

profileRouter.post('/', async (req, res) => {
  const existing = await ProfileModel.findOne();
  if (existing) {
    Object.assign(existing, req.body);
    await existing.save();
    return res.json({ success: true, data: existing });
  }
  const profile = await ProfileModel.create(req.body);
  return res.status(201).json({ success: true, data: profile });
});

profileRouter.patch('/', async (req, res) => {
  const profile = await ProfileModel.findOneAndUpdate({}, req.body, { new: true, upsert: true });
  return res.json({ success: true, data: profile });
});

// ─── Goals ────────────────────────────────────────────────────────────────────

export const goalsRouter = Router();

goalsRouter.get('/', async (_req, res) => {
  const goals = await GoalModel.find().sort({ isActive: -1, targetDate: 1 }).lean();
  return res.json({ success: true, data: goals });
});

goalsRouter.post('/', async (req, res) => {
  // Deactivate old active goal on new version
  if (req.body.isActive) {
    await GoalModel.updateMany({ isActive: true }, { isActive: false });
  }
  const goal = await GoalModel.create(req.body);
  return res.status(201).json({ success: true, data: goal });
});

goalsRouter.patch('/:id', async (req, res) => {
  const goal = await GoalModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!goal) return res.status(404).json({ success: false, error: 'Not found' });
  return res.json({ success: true, data: goal });
});

// ─── Mission ──────────────────────────────────────────────────────────────────

export const missionRouter = Router();

missionRouter.get('/today', async (_req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const log = await ActivityLogModel.findOne({ date: today }).lean();
  return res.json({ success: true, data: log ?? null });
});

missionRouter.patch('/today/complete/:itemIndex', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const idx = parseInt(req.params.itemIndex, 10);

  const log = await ActivityLogModel.findOne({ date: today });
  if (!log?.mission) return res.status(404).json({ success: false, error: 'No mission today' });

  const item = log.mission.items[idx];
  if (!item) return res.status(404).json({ success: false, error: 'Mission item not found' });

  item.completed = true;
  item.completedAt = new Date();
  log.mission.earnedXp += item.xpReward;
  log.totalXp += item.xpReward;
  log.xpEvents.push({ type: item.type, title: item.title, xp: item.xpReward, timestamp: new Date() });

  await log.save();

  req.app.get('io')?.emit('mission:updated', log.mission);
  req.app.get('io')?.emit('xp:earned', log.xpEvents[log.xpEvents.length - 1]);

  return res.json({ success: true, data: log });
});
