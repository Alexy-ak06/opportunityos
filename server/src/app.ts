import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { healthRouter } from './routes/health';
import { opportunitiesRouter } from './routes/opportunities';
import { profileRouter } from './routes/profile';
import { goalsRouter } from './routes/goals';
import { missionRouter } from './routes/mission';

export function createApp() {
  const app = express();

  // ─── Security & parsing ─────────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Logging ────────────────────────────────────────────────────────────────
  if (config.env !== 'test') {
    app.use(morgan(config.env === 'development' ? 'dev' : 'combined'));
  }

  // ─── Routes ─────────────────────────────────────────────────────────────────
  app.use('/health', healthRouter);
  app.use('/api/opportunities', opportunitiesRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/goals', goalsRouter);
  app.use('/api/mission', missionRouter);

  // ─── 404 ────────────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
  });

  // ─── Error handler ──────────────────────────────────────────────────────────
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ success: false, error: err.message ?? 'Internal server error' });
  });

  return app;
}
