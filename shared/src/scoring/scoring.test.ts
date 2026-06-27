import {
  computeROI,
  computeUrgencyMultiplier,
  computeBaseValue,
  computeEffortFactor,
  getDaysUntilDeadline,
  isOpportunityExpired,
} from '../src/scoring';
import type { BaseScores, OpportunityDates } from '../src/types';

const mockScores: BaseScores = {
  resumeValue: 8,
  learningValue: 9,
  placementValue: 8,
  timeRequired: 5,
  reachValue: 7,
};

const daysFromNow = (days: number, now = new Date()) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

describe('getDaysUntilDeadline', () => {
  const now = new Date('2025-01-15T10:00:00Z');

  it('returns null when no deadline exists', () => {
    expect(getDaysUntilDeadline({}, now)).toBeNull();
  });

  it('prioritizes submissionDeadline over registrationDeadline', () => {
    const dates: OpportunityDates = {
      registrationDeadline: daysFromNow(10, now),
      submissionDeadline:   daysFromNow(5, now),
    };
    const days = getDaysUntilDeadline(dates, now);
    expect(days).toBeCloseTo(5, 0);
  });

  it('returns negative days for past deadlines', () => {
    const dates: OpportunityDates = { registrationDeadline: daysFromNow(-2, now) };
    expect(getDaysUntilDeadline(dates, now)).toBeLessThan(0);
  });

  it('returns fractional days correctly', () => {
    const halfDay = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const dates: OpportunityDates = { eventDate: halfDay };
    const result = getDaysUntilDeadline(dates, now);
    expect(result).toBeCloseTo(0.5, 1);
  });
});

describe('computeUrgencyMultiplier', () => {
  it('returns 0 for expired (negative days)', () => {
    expect(computeUrgencyMultiplier(-1)).toBe(0);
    expect(computeUrgencyMultiplier(0)).toBe(0);
  });

  it('returns 1.4 for critical (< 1 day)', () => {
    expect(computeUrgencyMultiplier(0.5)).toBe(1.4);
  });

  it('returns 1.3 for hot (< 3 days)', () => {
    expect(computeUrgencyMultiplier(2)).toBe(1.3);
  });

  it('returns 1.2 for urgent (< 7 days)', () => {
    expect(computeUrgencyMultiplier(5)).toBe(1.2);
  });

  it('returns 1.1 for approaching (< 14 days)', () => {
    expect(computeUrgencyMultiplier(10)).toBe(1.1);
  });

  it('returns 1.0 for normal (< 30 days)', () => {
    expect(computeUrgencyMultiplier(20)).toBe(1.0);
  });

  it('returns 0.9 for distant (> 30 days)', () => {
    expect(computeUrgencyMultiplier(60)).toBe(0.9);
  });

  it('returns 0.9 when no deadline (null)', () => {
    expect(computeUrgencyMultiplier(null)).toBe(0.9);
  });
});

describe('computeBaseValue', () => {
  it('produces a weighted average in 1–10 range', () => {
    const result = computeBaseValue(mockScores);
    expect(result).toBeGreaterThan(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('produces max value when all scores are 10', () => {
    const max: BaseScores = { resumeValue: 10, learningValue: 10, placementValue: 10, timeRequired: 1, reachValue: 10 };
    expect(computeBaseValue(max)).toBeCloseTo(10, 1);
  });

  it('produces min value when all scores are 1', () => {
    const min: BaseScores = { resumeValue: 1, learningValue: 1, placementValue: 1, timeRequired: 10, reachValue: 1 };
    expect(computeBaseValue(min)).toBeCloseTo(1, 1);
  });
});

describe('computeEffortFactor', () => {
  it('returns ~1.0 for low effort (timeRequired=1)', () => {
    expect(computeEffortFactor(1)).toBeCloseTo(1.0, 2);
  });

  it('returns ~0.88 for high effort (timeRequired=10)', () => {
    const result = computeEffortFactor(10);
    expect(result).toBeLessThan(1.0);
    expect(result).toBeGreaterThan(0.8);
  });

  it('returns value between 0 and 1 for all inputs', () => {
    for (let i = 1; i <= 10; i++) {
      const r = computeEffortFactor(i);
      expect(r).toBeGreaterThan(0);
      expect(r).toBeLessThanOrEqual(1);
    }
  });
});

describe('computeROI', () => {
  const now = new Date('2025-06-01T10:00:00Z');

  it('returns 0 for expired opportunities', () => {
    const result = computeROI({
      baseScores: mockScores,
      dates: { registrationDeadline: daysFromNow(-1, now) },
      category: 'hackathon',
      now,
    });
    expect(result.roi).toBe(0);
    expect(result.isExpired).toBe(true);
  });

  it('returns high score for urgent high-value opportunity', () => {
    const result = computeROI({
      baseScores: { resumeValue: 9, learningValue: 10, placementValue: 9, timeRequired: 3, reachValue: 9 },
      dates: { registrationDeadline: daysFromNow(2, now) }, // HOT
      category: 'hackathon',
      now,
    });
    expect(result.roi).toBeGreaterThan(70);
    expect(result.urgencyMultiplier).toBe(1.3);
  });

  it('deprioritizes distant opportunities', () => {
    const urgent = computeROI({ baseScores: mockScores, dates: { registrationDeadline: daysFromNow(2, now) }, category: 'hackathon', now });
    const distant = computeROI({ baseScores: mockScores, dates: { registrationDeadline: daysFromNow(60, now) }, category: 'hackathon', now });
    expect(urgent.roi).toBeGreaterThan(distant.roi);
  });

  it('caps score at 100', () => {
    const result = computeROI({
      baseScores: { resumeValue: 10, learningValue: 10, placementValue: 10, timeRequired: 1, reachValue: 10 },
      dates: { registrationDeadline: daysFromNow(0.5, now) }, // CRITICAL
      category: 'internship',
      now,
    });
    expect(result.roi).toBeLessThanOrEqual(100);
  });

  it('handles no deadline gracefully', () => {
    const result = computeROI({ baseScores: mockScores, dates: {}, category: 'certification', now });
    expect(result.roi).toBeGreaterThan(0);
    expect(result.daysUntilDeadline).toBeNull();
    expect(result.isExpired).toBe(false);
  });

  it('applies category multiplier correctly', () => {
    const hackathon = computeROI({ baseScores: mockScores, dates: { registrationDeadline: daysFromNow(10, now) }, category: 'hackathon', now });
    const event     = computeROI({ baseScores: mockScores, dates: { registrationDeadline: daysFromNow(10, now) }, category: 'event', now });
    expect(hackathon.roi).toBeGreaterThan(event.roi);
  });
});

describe('isOpportunityExpired', () => {
  const now = new Date('2025-06-01T10:00:00Z');

  it('returns true for past deadline', () => {
    expect(isOpportunityExpired({ registrationDeadline: daysFromNow(-1, now) }, now)).toBe(true);
  });

  it('returns false for future deadline', () => {
    expect(isOpportunityExpired({ registrationDeadline: daysFromNow(1, now) }, now)).toBe(false);
  });

  it('returns false for no deadline', () => {
    expect(isOpportunityExpired({}, now)).toBe(false);
  });
});
