# TalentOS Frontend

Modern workforce intelligence dashboard built with Next.js, featuring dual-role views, AI insights, and Web3 task verification.

**Production URL:** https://talentos.praneethd.xyz  
**API Docs:** [talentos-api.praneethd.xyz](https://talentos-api.praneethd.xyz/)  
**Backend API (production):** https://talentos-backend.onrender.com



## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui, Aceternity UI, Framer Motion
- **Web3:** Ethers.js + MetaMask
- **Charts:** Recharts
- **State:** React Context

## Setup

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start development server
npm run dev
```

Open http://localhost:3000

## Environment Variables

Create a `.env.local` file (base URL only — no `/api` suffix):

```env
# Production
NEXT_PUBLIC_API_URL=https://talentos-backend.onrender.com

# Local development
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Docker is used for the **backend** only; see [backend README](../backend/README.md) for `docker pull praneeth0331/talentos-backend:latest` and `docker compose up -d`.


## Pages

### Public Pages
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, and CTA |
| `/features` | Feature showcase with animations |
| `/pricing` | Pricing tiers |
| `/about` | About TalentOS |
| `/login` | Organization admin login |
| `/register` | Organization registration |

### Admin Dashboard (requires admin login)
| Route | Description |
|-------|-------------|
| `/dashboard` | Analytics overview — employees, tasks, completion rates |
| `/employees` | Employee list with search, create, and bulk actions |
| `/employees/[id]` | Employee profile with AI productivity score |
| `/tasks` | Kanban task board with drag-and-drop |
| `/ai-insights` | AI Copilot chat, skill gap heatmap, daily insight |

### Employee Dashboard (requires employee login)
| Route | Description |
|-------|-------------|
| `/dashboard` | Personal stats — my tasks, score, recent activity |
| `/employees/me` | Own profile with assigned tasks |
| `/tasks` | Personal task list with status updates |
| `/ai-insights` | Personal skill gap analysis + 30-day learning plan |

## Features

### Dual-Role Authentication
- **Admin (Organization)** — full access to employee management, task assignment, and org-wide analytics
- **Employee** — self-service access to own profile, tasks, and personal AI insights
- Automatic role detection on login, dashboard adapts accordingly

### AI Intelligence
- **Workforce Copilot** — natural language Q&A about your team (admin)
- **Skill Gap Heatmap** — visual org-wide skill coverage analysis (admin)
- **Personal Skill Gap** — individual analysis with 30-day learning plan (employee)
- **Daily Insight** — AI-generated recommendation based on team performance (admin)
- **Smart Assign** — AI suggests best employee for a task (admin)
- **Resume Parser** — upload PDF to extract skills automatically

### Productivity Scoring
Weighted formula: Completion (40%) + Deadline Adherence (35%) + Priority (25%)

### Web3 Verification
- MetaMask wallet connect
- Task completion signed on Polygon Amoy testnet
- On-chain proof of work with transaction hash storage

## Backend API

The frontend uses `NEXT_PUBLIC_API_URL` as the API base (e.g. `https://talentos-backend.onrender.com`).
- **Interactive API docs:** [talentos-api.praneethd.xyz](https://talentos-api.praneethd.xyz/)
- **Production backend:** https://talentos-backend.onrender.com

## Scripts

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Deployment

Deployed on **Vercel** (or any static host) at https://talentos.praneethd.xyz.

Set `NEXT_PUBLIC_API_URL` to the production backend URL in your deployment environment.
