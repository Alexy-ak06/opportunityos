import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

function required(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  env: optional('NODE_ENV', 'development'),
  port: parseInt(optional('PORT', '4000'), 10),

  mongo: {
    uri: optional('MONGO_URI', 'mongodb://localhost:27017/opportunityos'),
  },

  redis: {
    host: optional('REDIS_HOST', 'localhost'),
    port: parseInt(optional('REDIS_PORT', '6379'), 10),
    password: optional('REDIS_PASSWORD', ''),
  },

  telegram: {
    token: optional('TELEGRAM_BOT_TOKEN', ''),
    chatId: optional('TELEGRAM_CHAT_ID', ''),
    briefingTime: optional('BRIEFING_TIME', '07:30'), // HH:MM IST
  },

  scoring: {
    recomputeIntervalMs: parseInt(optional('SCORE_RECOMPUTE_INTERVAL_MS', String(60 * 60 * 1000)), 10), // 1 hour
  },

  cors: {
    origin: optional('CLIENT_ORIGIN', 'http://localhost:5173'),
  },
} as const;

export type Config = typeof config;