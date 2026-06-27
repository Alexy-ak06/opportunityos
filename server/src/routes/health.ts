import { Router } from 'express';
import mongoose from 'mongoose';

export const healthRouter = Router();

const startedAt = Date.now();

healthRouter.get('/', (_req, res) => {
  const uptimeMs = Date.now() - startedAt;
  const mongoState = mongoose.connection.readyState;
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const mongoStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoState] ?? 'unknown';

  res.status(mongoState === 1 ? 200 : 503).json({
    success: true,
    status: 'ok',
    uptime: {
      ms: uptimeMs,
      human: formatUptime(uptimeMs),
    },
    services: {
      mongo: mongoStatus,
    },
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
  });
});

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}
