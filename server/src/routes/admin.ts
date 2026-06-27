import { Router } from 'express';
import { listScheduledAlerts, detectConflicts } from '../jobs/deadlineGuardian';

export const adminRouter = Router();

// GET /api/admin/alerts — list all scheduled deadline alerts
adminRouter.get('/alerts', async (req, res) => {
  const queue = req.app.get('deadlineQueue');
  if (!queue) return res.status(503).json({ success: false, error: 'Deadline queue not available' });

  const alerts = await listScheduledAlerts(queue);
  return res.json({ success: true, data: alerts, total: alerts.length });
});

// GET /api/admin/conflicts/:id — check event date conflicts
adminRouter.get('/conflicts/:id', async (req, res) => {
  const conflicts = await detectConflicts(req.params.id);
  return res.json({ success: true, data: { conflicts, hasConflicts: conflicts.length > 0 } });
});
