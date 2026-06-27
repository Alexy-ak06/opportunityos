import mongoose, { Schema, Document } from 'mongoose';
import type { Profile, Goal, GoalMilestone, ActivityLog, DailyMission, MissionItem, XpEvent } from '@opportunityos/shared';

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface ProfileDoc extends Omit<Profile, '_id'>, Document {}

const ProfileSchema = new Schema<ProfileDoc>(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, trim: true, lowercase: true },
    bio:           { type: String, trim: true, maxlength: 500 },
    skills: [{
      name:  { type: String, required: true },
      level: { type: String, enum: ['beginner','intermediate','advanced'], required: true },
    }],
    currentLevel: {
      type: String,
      enum: ['year1','year2','year3','year4','fresher','experienced'],
      required: true,
      default: 'year1',
    },
    interests:       { type: [String], default: [] },
    timezone:        { type: String, default: 'Asia/Kolkata' },
    telegramChatId:  { type: String },
    briefingTime:    { type: String, default: '07:30' },
  },
  { timestamps: true }
);

export const ProfileModel = mongoose.model<ProfileDoc>('Profile', ProfileSchema);

// ─── Goal ─────────────────────────────────────────────────────────────────────

export interface GoalDoc extends Omit<Goal, '_id'>, Document {}

const MilestoneSchema = new Schema<GoalMilestone>({
  title:       { type: String, required: true },
  targetDate:  { type: Date, required: true },
  completed:   { type: Boolean, default: false },
  completedAt: { type: Date },
}, { _id: false });

const GoalSchema = new Schema<GoalDoc>(
  {
    title:         { type: String, required: true, trim: true },
    description:   { type: String, trim: true },
    targetRole:    { type: String, trim: true },
    targetCompany: { type: String, trim: true },
    targetDate:    { type: Date, required: true },
    version:       { type: Number, required: true, default: 1 },
    isActive:      { type: Boolean, required: true, default: true },
    milestones:    { type: [MilestoneSchema], default: [] },
  },
  { timestamps: true }
);

GoalSchema.index({ isActive: 1 });
GoalSchema.index({ targetDate: 1 });

export const GoalModel = mongoose.model<GoalDoc>('Goal', GoalSchema);

// ─── ActivityLog ──────────────────────────────────────────────────────────────

export interface ActivityLogDoc extends Omit<ActivityLog, '_id'>, Document {}

const MissionItemSchema = new Schema<MissionItem>({
  type:          { type: String, required: true },
  title:         { type: String, required: true },
  opportunityId: { type: String },
  xpReward:      { type: Number, required: true, default: 0 },
  completed:     { type: Boolean, default: false },
  completedAt:   { type: Date },
}, { _id: false });

const DailyMissionSchema = new Schema<DailyMission>({
  date:     { type: String, required: true },
  items:    { type: [MissionItemSchema], default: [] },
  totalXp:  { type: Number, default: 0 },
  earnedXp: { type: Number, default: 0 },
}, { _id: false });

const XpEventSchema = new Schema<XpEvent>({
  type:          { type: String, required: true },
  title:         { type: String, required: true },
  xp:            { type: Number, required: true },
  opportunityId: { type: String },
  timestamp:     { type: Date, default: Date.now },
}, { _id: false });

const ActivityLogSchema = new Schema<ActivityLogDoc>(
  {
    date:          { type: String, required: true, unique: true }, // YYYY-MM-DD
    mission:       { type: DailyMissionSchema },
    xpEvents:      { type: [XpEventSchema], default: [] },
    currentStreak: { type: Number, default: 0 },
    totalXp:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

ActivityLogSchema.index({ date: -1 });

export const ActivityLogModel = mongoose.model<ActivityLogDoc>('ActivityLog', ActivityLogSchema);
