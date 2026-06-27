import mongoose, { Schema, Document } from 'mongoose';
import type { Opportunity, BaseScores, OpportunityDates, DecisionLogEntry } from '@opportunityos/shared';

export interface OpportunityDoc extends Omit<Opportunity, '_id'>, Document {}

const BaseScoresSchema = new Schema<BaseScores>({
  resumeValue:    { type: Number, required: true, min: 1, max: 10 },
  learningValue:  { type: Number, required: true, min: 1, max: 10 },
  placementValue: { type: Number, required: true, min: 1, max: 10 },
  timeRequired:   { type: Number, required: true, min: 1, max: 10 },
  reachValue:     { type: Number, required: true, min: 1, max: 10 },
}, { _id: false });

const DatesSchema = new Schema<OpportunityDates>({
  registrationDeadline: { type: Date },
  submissionDeadline:   { type: Date },
  eventDate:            { type: Date },
  announcedAt:          { type: Date },
}, { _id: false });

const DecisionLogSchema = new Schema<DecisionLogEntry>({
  action:    { type: String, required: true },
  timestamp: { type: Date,   required: true, default: Date.now },
  reason:    { type: String },
}, { _id: false });

const OpportunitySchema = new Schema<OpportunityDoc>(
  {
    title:       { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, required: true, trim: true },
    source:      { type: String, required: true, enum: ['manual','devpost','unstop','mlh','hackerearth','devfolio','gssoc','internshala','linkedin'] },
    category:    { type: String, required: true, enum: ['hackathon','certification','internship','open-source','event','conference','hiring-challenge','fellowship','scholarship'] },
    url:         { type: String, required: true, trim: true },
    imageUrl:    { type: String, trim: true },
    organizer:   { type: String, trim: true },
    location:    { type: String, trim: true },
    isOnline:    { type: Boolean, required: true, default: true },
    prizePool:   { type: String, trim: true },
    teamSize:    { type: String, trim: true },
    dates:       { type: DatesSchema, required: true, default: {} },
    baseScores:  { type: BaseScoresSchema, required: true },
    currentScore:    { type: Number, default: 0, min: 0, max: 100 },
    scoreUpdatedAt:  { type: Date },
    status:      { type: String, required: true, default: 'new', enum: ['new','shortlisted','registered','in_progress','completed','skipped','expired'] },
    decisionLog: { type: [DecisionLogSchema], default: [] },
    tags:        { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes (Phase 1.2 requirement) ─────────────────────────────────────────
OpportunitySchema.index({ 'dates.registrationDeadline': 1 });
OpportunitySchema.index({ 'dates.submissionDeadline': 1 });
OpportunitySchema.index({ status: 1 });
OpportunitySchema.index({ currentScore: -1 });
OpportunitySchema.index({ category: 1, status: 1 });
OpportunitySchema.index({ source: 1 });
// Compound for Deadline Guardian queries
OpportunitySchema.index({ status: 1, 'dates.registrationDeadline': 1 });
OpportunitySchema.index({ status: 1, 'dates.submissionDeadline': 1 });

export const OpportunityModel = mongoose.model<OpportunityDoc>('Opportunity', OpportunitySchema);
