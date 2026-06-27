import { BaseScores, Opportunity, OpportunityDates } from '../types';
import {
  SCORING_WEIGHTS,
  TIME_PENALTY_FACTOR,
  URGENCY_THRESHOLDS,
  URGENCY_MULTIPLIERS,
  CATEGORY_MULTIPLIERS,
} from '../constants/scoring';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScoringInput {
  baseScores: BaseScores;
  dates: OpportunityDates;
  category: Opportunity['category'];
  now?: Date; // injectable for testing
}

export interface ScoringResult {
  roi: number;            // final 0–100 score
  baseValue: number;      // weighted avg of positive scores
  urgencyMultiplier: number;
  effortFactor: number;
  categoryMultiplier: number;
  daysUntilDeadline: number | null;
  isExpired: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getDaysUntilDeadline(dates: OpportunityDates, now: Date): number | null {
  // Priority: submissionDeadline > registrationDeadline > eventDate
  const deadline =
    dates.submissionDeadline ??
    dates.registrationDeadline ??
    dates.eventDate ??
    null;

  if (!deadline) return null;

  const ms = new Date(deadline).getTime() - now.getTime();
  return ms / (1000 * 60 * 60 * 24); // fractional days
}

export function computeUrgencyMultiplier(daysUntilDeadline: number | null): number {
  if (daysUntilDeadline === null) {
    // No deadline: treat as distant but still viable
    return URGENCY_MULTIPLIERS.DISTANT;
  }

  if (daysUntilDeadline <= URGENCY_THRESHOLDS.EXPIRED) return URGENCY_MULTIPLIERS.EXPIRED;
  if (daysUntilDeadline <= URGENCY_THRESHOLDS.CRITICAL) return URGENCY_MULTIPLIERS.CRITICAL;
  if (daysUntilDeadline <= URGENCY_THRESHOLDS.HOT)      return URGENCY_MULTIPLIERS.HOT;
  if (daysUntilDeadline <= URGENCY_THRESHOLDS.URGENT)   return URGENCY_MULTIPLIERS.URGENT;
  if (daysUntilDeadline <= URGENCY_THRESHOLDS.APPROACHING) return URGENCY_MULTIPLIERS.APPROACHING;
  if (daysUntilDeadline <= URGENCY_THRESHOLDS.NORMAL)   return URGENCY_MULTIPLIERS.NORMAL;
  return URGENCY_MULTIPLIERS.DISTANT;
}

export function computeBaseValue(scores: BaseScores): number {
  return (
    scores.resumeValue    * SCORING_WEIGHTS.resumeValue +
    scores.learningValue  * SCORING_WEIGHTS.learningValue +
    scores.placementValue * SCORING_WEIGHTS.placementValue +
    scores.reachValue     * SCORING_WEIGHTS.reachValue
  );
}

export function computeEffortFactor(timeRequired: number): number {
  // timeRequired 1–10: 10 = very time-consuming
  // Factor: 1.0 (low effort) down to (1 - TIME_PENALTY_FACTOR) (high effort)
  const normalized = (timeRequired - 1) / 9; // 0–1
  return 1 - normalized * TIME_PENALTY_FACTOR;
}

// ─── Main scoring function ────────────────────────────────────────────────────

export function computeROI(input: ScoringInput): ScoringResult {
  const now = input.now ?? new Date();
  const daysUntilDeadline = getDaysUntilDeadline(input.dates, now);
  const isExpired = daysUntilDeadline !== null && daysUntilDeadline <= 0;

  const baseValue         = computeBaseValue(input.baseScores);
  const urgencyMultiplier = computeUrgencyMultiplier(daysUntilDeadline);
  const effortFactor      = computeEffortFactor(input.baseScores.timeRequired);
  const categoryMultiplier = CATEGORY_MULTIPLIERS[input.category] ?? 1.0;

  // roi = baseValue (0–10) × urgencyMultiplier × effortFactor × categoryMultiplier
  // Normalized to 0–100
  const rawScore = baseValue * urgencyMultiplier * effortFactor * categoryMultiplier;
  const roi = isExpired ? 0 : Math.min(100, Math.round(rawScore * 10));

  return {
    roi,
    baseValue,
    urgencyMultiplier,
    effortFactor,
    categoryMultiplier,
    daysUntilDeadline,
    isExpired,
  };
}

// ─── Batch ranking ────────────────────────────────────────────────────────────

export function rankOpportunities(
  opportunities: Array<{ id: string; scores: BaseScores; dates: OpportunityDates; category: Opportunity['category'] }>,
  now?: Date
): Array<{ id: string; roi: number; result: ScoringResult }> {
  return opportunities
    .map(op => ({
      id: op.id,
      ...computeROI({ baseScores: op.scores, dates: op.dates, category: op.category, now }),
      result: computeROI({ baseScores: op.scores, dates: op.dates, category: op.category, now }),
    }))
    .sort((a, b) => b.roi - a.roi);
}

// ─── Expiry check ─────────────────────────────────────────────────────────────

export function isOpportunityExpired(dates: OpportunityDates, now?: Date): boolean {
  const effectiveNow = now ?? new Date();
  const days = getDaysUntilDeadline(dates, effectiveNow);
  return days !== null && days <= 0;
}
