import mongoose from 'mongoose';
import { config } from '../config';
import { connectMongo } from '../config/mongo';
import { OpportunityModel } from '../models/Opportunity';
import { ProfileModel, GoalModel } from '../models';
import { computeROI } from '@opportunityos/shared';

const seedOpportunities = [
  {
    title: 'Google Cloud Agent Hackathon 2026',
    description: 'Build AI agents using Google Cloud, Vertex AI, and ADK. Open to students worldwide. Top submissions get cloud credits and swag.',
    source: 'devpost',
    category: 'hackathon',
    url: 'https://devpost.com/google-cloud-agent-hackathon',
    organizer: 'Google Cloud',
    isOnline: true,
    prizePool: '$10,000 + Cloud Credits',
    teamSize: '1-4',
    dates: {
      registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),  // 5 days
      submissionDeadline:   new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
      eventDate:            new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    baseScores: { resumeValue: 9, learningValue: 10, placementValue: 9, timeRequired: 6, reachValue: 9 },
    tags: ['AI', 'Google', 'Cloud', 'Agents'],
  },
  {
    title: 'IBM Full Stack Cloud Developer Certificate',
    description: 'Professional certificate covering microservices, Docker, Kubernetes, and CI/CD. Highly recognized by Indian recruiters.',
    source: 'manual',
    category: 'certification',
    url: 'https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer',
    organizer: 'IBM / Coursera',
    isOnline: true,
    dates: {},
    baseScores: { resumeValue: 8, learningValue: 9, placementValue: 8, timeRequired: 8, reachValue: 6 },
    tags: ['IBM', 'Cloud', 'Full Stack', 'Coursera'],
  },
  {
    title: 'Smart India Hackathon 2026',
    description: 'India\'s biggest hackathon by AICTE. Build solutions for real government problem statements. Massive recognition for placement.',
    source: 'unstop',
    category: 'hackathon',
    url: 'https://www.sih.gov.in',
    organizer: 'AICTE / Govt of India',
    isOnline: false,
    location: 'Various NIT/IIT campuses',
    prizePool: '₹1,00,000',
    teamSize: '6',
    dates: {
      registrationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      eventDate:            new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    },
    baseScores: { resumeValue: 10, learningValue: 8, placementValue: 10, timeRequired: 9, reachValue: 10 },
    tags: ['SIH', 'Government', 'Flagship'],
  },
  {
    title: 'GSSoC Extended 2026',
    description: 'GirlScript Summer of Code — contribute to open source projects, build a public GitHub portfolio, and get certificates.',
    source: 'gssoc',
    category: 'open-source',
    url: 'https://gssoc.girlscript.tech',
    organizer: 'GirlScript Foundation',
    isOnline: true,
    dates: {
      registrationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      eventDate:            new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    baseScores: { resumeValue: 7, learningValue: 8, placementValue: 7, timeRequired: 7, reachValue: 8 },
    tags: ['Open Source', 'GitHub', 'Community'],
  },
  {
    title: 'Microsoft Azure AI Engineer Associate (AI-102)',
    description: 'Azure certification for AI solutions using Azure Cognitive Services, Azure Bot Service, and Azure OpenAI. Highly valued.',
    source: 'manual',
    category: 'certification',
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/',
    organizer: 'Microsoft',
    isOnline: true,
    dates: {},
    baseScores: { resumeValue: 9, learningValue: 9, placementValue: 9, timeRequired: 7, reachValue: 7 },
    tags: ['Microsoft', 'Azure', 'AI', 'Cloud'],
  },
  {
    title: 'Flipkart Grid 6.0',
    description: 'Flipkart\'s engineering challenge — solve real e-commerce problems. Winners get PPIs (pre-placement interviews).',
    source: 'unstop',
    category: 'hiring-challenge',
    url: 'https://unstop.com/hackathons/flipkart-grid',
    organizer: 'Flipkart',
    isOnline: true,
    prizePool: 'Pre-Placement Interview',
    dates: {
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // urgent!
      submissionDeadline:   new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    baseScores: { resumeValue: 10, learningValue: 7, placementValue: 10, timeRequired: 8, reachValue: 9 },
    tags: ['Flipkart', 'Hiring', 'PPI', 'E-commerce'],
  },
];

async function seed() {
  await connectMongo();

  console.log('🌱 Seeding database...');

  // Clear existing
  await OpportunityModel.deleteMany({});
  await ProfileModel.deleteMany({});
  await GoalModel.deleteMany({});

  // Seed opportunities with computed scores
  for (const op of seedOpportunities) {
    const { roi } = computeROI({
      baseScores: op.baseScores,
      dates: op.dates,
      category: op.category as any,
    });

    await OpportunityModel.create({
      ...op,
      status: 'new',
      currentScore: roi,
      scoreUpdatedAt: new Date(),
      decisionLog: [],
      tags: op.tags ?? [],
    });

    console.log(`  ✅ ${op.title} → ROI: ${roi}`);
  }

  // Seed profile
  await ProfileModel.create({
    name: 'Ayush',
    currentLevel: 'year1',
    interests: ['hackathon', 'certification', 'open-source', 'internship'],
    skills: [
      { name: 'Python', level: 'intermediate' },
      { name: 'JavaScript', level: 'intermediate' },
      { name: 'React', level: 'beginner' },
      { name: 'FastAPI', level: 'intermediate' },
    ],
    timezone: 'Asia/Kolkata',
    briefingTime: '07:30',
  });

  // Seed goal
  await GoalModel.create({
    title: 'Software Engineer at a top tech company',
    targetRole: 'Software Engineer',
    targetDate: new Date('2029-06-01'),
    version: 1,
    isActive: true,
    milestones: [
      { title: 'Complete 5 hackathons', targetDate: new Date('2025-12-31'), completed: false },
      { title: 'Earn 3 cloud certifications', targetDate: new Date('2026-03-31'), completed: false },
      { title: 'Land first internship', targetDate: new Date('2026-06-01'), completed: false },
    ],
  });

  console.log('  ✅ Profile and goal seeded');
  console.log('\n🎉 Seed complete!');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
