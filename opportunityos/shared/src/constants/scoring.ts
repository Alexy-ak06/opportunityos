import { OpportunityCategory } from '../types';

// ─── Scoring weights (must sum to 1.0) ───────────────────────────────────────
// Tune these to reprioritize what matters to your career without touching code

export const SCORING_WEIGHTS = {
  resumeValue: 0.30,
  learningValue: 0.25,
  placementValue: 0.30,
  reachValue: 0.15,
} as const;

// timeRequired is a penalty, not a reward — handled separately
export const TIME_PENALTY_FACTOR = 0.12; // max 12% score reduction for high-effort

// ─── Urgency multiplier curve ─────────────────────────────────────────────────
// Days until deadline → multiplier
// >30 days: neutral. Curve rises as deadline approaches. 0 after deadline.

export const URGENCY_THRESHOLDS = {
  EXPIRED: 0,           // past deadline
  CRITICAL: 1,          // < 1 day  → multiplier 1.4
  HOT: 3,               // < 3 days → multiplier 1.3
  URGENT: 7,            // < 7 days → multiplier 1.2
  APPROACHING: 14,      // < 14 days → multiplier 1.1
  NORMAL: 30,           // < 30 days → multiplier 1.0
  DISTANT: Infinity,    // > 30 days → multiplier 0.9 (deprioritize)
} as const;

export const URGENCY_MULTIPLIERS = {
  EXPIRED: 0,
  CRITICAL: 1.4,
  HOT: 1.3,
  URGENT: 1.2,
  APPROACHING: 1.1,
  NORMAL: 1.0,
  DISTANT: 0.9,
} as const;

// ─── Deadline alert thresholds (days before deadline) ────────────────────────

export const ALERT_THRESHOLDS_DAYS = [7, 5, 3, 1] as const;
export type AlertThreshold = typeof ALERT_THRESHOLDS_DAYS[number];

// ─── Category base multipliers ────────────────────────────────────────────────
// Some categories are inherently more valuable for a CS student targeting placements

export const CATEGORY_MULTIPLIERS: Record<OpportunityCategory, number> = {
  'hackathon': 1.15,
  'internship': 1.20,
  'hiring-challenge': 1.20,
  'open-source': 1.10,
  'certification': 1.05,
  'fellowship': 1.15,
  'scholarship': 1.10,
  'event': 0.95,
  'conference': 1.00,
};

// ─── XP rewards ───────────────────────────────────────────────────────────────

export const XP_REWARDS = {
  register: 50,
  submit: 150,
  complete_module: 75,
  push_commit: 30,
  attend: 40,
  publish_post: 60,
  custom: 25,
  streak_bonus: 100,    // awarded on 7-day streak
  completion_bonus: 200, // awarded on opportunity completion
} as const;

// ─── Score bands (for UI display) ────────────────────────────────────────────

export const SCORE_BANDS = [
  { min: 85, label: 'Must do', color: '#22c55e' },
  { min: 70, label: 'High value', color: '#3b82f6' },
  { min: 50, label: 'Worth it', color: '#f59e0b' },
  { min: 0,  label: 'Low priority', color: '#6b7280' },
] as const;

export function getScoreBand(score: number) {
  return SCORE_BANDS.find(b => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];
}

// ─── Opportunity categories metadata ─────────────────────────────────────────

export const CATEGORY_META: Record<OpportunityCategory, { label: string; icon: string }> = {
  'hackathon':        { label: 'Hackathon',        icon: '⚡' },
  'certification':    { label: 'Certification',    icon: '🎓' },
  'internship':       { label: 'Internship',        icon: '💼' },
  'open-source':      { label: 'Open Source',       icon: '🌐' },
  'event':            { label: 'Event',             icon: '📅' },
  'conference':       { label: 'Conference',        icon: '🎤' },
  'hiring-challenge': { label: 'Hiring Challenge',  icon: '🏆' },
  'fellowship':       { label: 'Fellowship',        icon: '🚀' },
  'scholarship':      { label: 'Scholarship',       icon: '💡' },
};
