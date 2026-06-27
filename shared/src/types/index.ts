// ─── Opportunity ─────────────────────────────────────────────────────────────

export type OpportunitySource =
  | 'manual'
  | 'devpost'
  | 'unstop'
  | 'mlh'
  | 'hackerearth'
  | 'devfolio'
  | 'gssoc'
  | 'internshala'
  | 'linkedin';

export type OpportunityCategory =
  | 'hackathon'
  | 'certification'
  | 'internship'
  | 'open-source'
  | 'event'
  | 'conference'
  | 'hiring-challenge'
  | 'fellowship'
  | 'scholarship';

export type OpportunityStatus =
  | 'new'
  | 'shortlisted'
  | 'registered'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'expired';

export type DecisionAction =
  | 'shortlisted'
  | 'registered'
  | 'started'
  | 'completed'
  | 'skipped'
  | 'expired';

export interface DecisionLogEntry {
  action: DecisionAction;
  timestamp: Date;
  reason?: string;
}

export interface BaseScores {
  resumeValue: number;      // 1–10: how much this boosts your resume
  learningValue: number;    // 1–10: how much you will learn
  placementValue: number;   // 1–10: how much this helps placement
  timeRequired: number;     // 1–10: effort cost (higher = more time)
  reachValue: number;       // 1–10: networking / visibility potential
}

export interface OpportunityDates {
  registrationDeadline?: Date;
  submissionDeadline?: Date;
  eventDate?: Date;
  announcedAt?: Date;
}

export interface Opportunity {
  _id?: string;
  title: string;
  description: string;
  source: OpportunitySource;
  category: OpportunityCategory;
  url: string;
  imageUrl?: string;
  organizer?: string;
  location?: string;
  isOnline: boolean;
  prizePool?: string;
  teamSize?: string;
  dates: OpportunityDates;
  baseScores: BaseScores;
  currentScore: number;       // computed ROI score 0–100, updated hourly
  scoreUpdatedAt?: Date;
  status: OpportunityStatus;
  decisionLog: DecisionLogEntry[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface Profile {
  _id?: string;
  name: string;
  email?: string;
  bio?: string;
  skills: Skill[];
  currentLevel: 'year1' | 'year2' | 'year3' | 'year4' | 'fresher' | 'experienced';
  interests: OpportunityCategory[];
  timezone: string;
  telegramChatId?: string;
  briefingTime: string; // "07:30" HH:MM format
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Goal ────────────────────────────────────────────────────────────────────

export interface Goal {
  _id?: string;
  title: string;
  description?: string;
  targetRole?: string;
  targetCompany?: string;
  targetDate: Date;
  version: number;
  isActive: boolean;
  milestones: GoalMilestone[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GoalMilestone {
  title: string;
  targetDate: Date;
  completed: boolean;
  completedAt?: Date;
}

// ─── Activity / Mission ───────────────────────────────────────────────────────

export type MissionItemType = 'register' | 'submit' | 'complete_module' | 'push_commit' | 'attend' | 'publish_post' | 'custom';

export interface MissionItem {
  type: MissionItemType;
  title: string;
  opportunityId?: string;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
}

export interface DailyMission {
  _id?: string;
  date: string; // "YYYY-MM-DD"
  items: MissionItem[];
  totalXp: number;
  earnedXp: number;
  createdAt?: Date;
}

export interface XpEvent {
  _id?: string;
  type: MissionItemType | 'bonus' | 'streak';
  title: string;
  xp: number;
  opportunityId?: string;
  timestamp: Date;
}

export interface ActivityLog {
  _id?: string;
  date: string; // "YYYY-MM-DD"
  mission?: DailyMission;
  xpEvents: XpEvent[];
  currentStreak: number;
  totalXp: number;
  createdAt?: Date;
}

// ─── API response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Socket events ────────────────────────────────────────────────────────────

export interface SocketEvents {
  // server → client
  'opportunity:new': Opportunity;
  'opportunity:updated': Opportunity;
  'opportunity:scores_refreshed': { id: string; currentScore: number };
  'deadline:alert': DeadlineAlert;
  'mission:updated': DailyMission;
  'xp:earned': XpEvent;
}

export interface DeadlineAlert {
  opportunityId: string;
  opportunityTitle: string;
  deadlineType: 'registration' | 'submission' | 'event';
  deadlineDate: Date;
  hoursRemaining: number;
  threshold: 7 | 5 | 3 | 1; // days
}
