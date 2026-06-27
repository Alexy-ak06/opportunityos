# ⚡ OpportunityOS

> **Your personal career Jarvis.** An AI-powered Career Operating System that continuously discovers, ranks, tracks, and recommends the highest-value opportunities for your growth.

[![CI](https://github.com/YOUR_USERNAME/opportunityos/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/opportunityos/actions)

---

## What it does

Every morning OpportunityOS answers one question: **"What should I do today?"**

- 🔍 Scans Devpost, Unstop, MLH, HackerEarth for new hackathons and opportunities
- ⚡ Scores every opportunity with a live ROI formula (Resume × Learning × Placement × Urgency)
- 🔔 Fires deadline alerts at 7d / 5d / 3d / 24h before every tracked deadline
- 📊 Shows a real-time ranked dashboard — what matters most, right now
- 🤖 Sends a Telegram morning briefing at 07:30 IST with today's mission
- 📈 Tracks your progress: certs, hackathons, open source, XP streak

---

## Architecture

```
opportunityos/
├── server/          Node.js + Express + Socket.IO API
├── client/          React + Vite dashboard
├── shared/          Shared types, scoring engine, constants
├── docker-compose.yml   MongoDB + Redis (local dev)
└── .github/workflows/   CI: lint → test → build
```

**Stack:** Node 20 · Express · MongoDB (Mongoose) · Redis (BullMQ) · Socket.IO · React 18 · Vite · Tailwind CSS · TypeScript throughout

---

## Local Development Setup

### Prerequisites

- Node.js ≥ 20
- Docker + Docker Compose (for MongoDB and Redis)
- npm ≥ 10

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/opportunityos.git
cd opportunityos
npm install
```

### 2. Start infrastructure (MongoDB + Redis)

```bash
docker compose up -d
```

Verify both services are healthy:
```bash
docker compose ps
```

### 3. Configure environment

```bash
cp .env.example .env
# .env is pre-configured for local docker — no changes needed to start
```

### 4. Seed the database

```bash
cd server
npx tsx src/services/seed.ts
```

This populates 6 realistic opportunities with computed ROI scores, a profile, and a goal.

### 5. Start development servers

From the project root:

```bash
npm run dev
```

This starts:
- **Server** on `http://localhost:4000`
- **Client** on `http://localhost:5173`

### 6. Verify everything is running

```bash
curl http://localhost:4000/health
# → { "status": "ok", "services": { "mongo": "connected" }, ... }
```

Open `http://localhost:5173` to see the Command Center dashboard.

---

## API Reference

### Health
```
GET /health
```

### Opportunities
```
POST   /api/opportunities              Create
GET    /api/opportunities              List (filters: status, category, sort=roi|deadline|created)
GET    /api/opportunities/:id          Get one
PATCH  /api/opportunities/:id          Update / status transition
DELETE /api/opportunities/:id          Delete
```

### Profile
```
GET    /api/profile
PATCH  /api/profile
```

### Goals
```
GET    /api/goals
POST   /api/goals
PATCH  /api/goals/:id
```

### Mission
```
GET    /api/mission/today
PATCH  /api/mission/today/complete/:itemIndex
```

---

## ROI Scoring Formula

```
roi = baseValue × urgencyMultiplier × effortFactor × categoryMultiplier
```

| Component | Description |
|---|---|
| `baseValue` | Weighted avg of resumeValue(30%) + learningValue(25%) + placementValue(30%) + reachValue(15%) |
| `urgencyMultiplier` | Rises as deadline approaches: 0.9 (distant) → 1.4 (< 24h) → 0 (expired) |
| `effortFactor` | Penalty for high timeRequired (max 12% reduction) |
| `categoryMultiplier` | Internships and hiring challenges weighted higher |

All weights are tunable in `shared/src/constants/scoring.ts` — no redeploy needed.

---

## Running Tests

```bash
# All packages
npm test

# Shared scoring engine only (pure unit tests)
npm test --workspace=shared

# Server only
npm test --workspace=server
```

---

## Telegram Setup (Phase 1.7)

1. Create a bot via [@BotFather](https://t.me/BotFather) → copy token
2. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
3. Add to `.env`:
   ```
   TELEGRAM_BOT_TOKEN=your_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
   BRIEFING_TIME=07:30
   ```

---

## Roadmap

| Phase | Status |
|---|---|
| 1.1 Monorepo scaffold + CI | ✅ Done |
| 1.2 Core data models | ✅ Done |
| 1.3 Opportunity CRUD API + manual entry UI | ✅ Done |
| 1.4 Intelligence Engine v1 (ROI scoring + decay) | ✅ Done |
| 1.5 Deadline Guardian | 🔜 Next |
| 1.6 Daily Command Center (real-time dashboard) | ✅ Done (v1) |
| 1.7 Telegram bot + morning briefing | 🔜 Next |
| 2.x Web scrapers (Devpost, Unstop, MLH) | 📅 Planned |
| 3.x Career GPS + AI roadmap | 📅 Planned |

---

*Built by Ayush — because opportunities shouldn't find themselves.*
