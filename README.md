# TalentOS Frontend

Modern workforce intelligence dashboard built with Next.js, featuring dual-role views, AI insights, and Web3 task verification.

**Production URL:** https://talentos.praneethd.xyz  
**API Docs:** [talentos-api.praneethd.xyz](https://talentos-api.praneethd.xyz/)  
**Backend API (production):** https://talentos-backend.onrender.com



## Tech Stack

- **Framework:** Next.js 16 (App Router)
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

## User Flow

How users move through TalentOS — **Admin** (organization) and **Employee** flows, with stages and what happens at each step.

### Admin flow (organization)

```
  Stage 1            Stage 2              Stage 3              Stage 4              Stage 5
  ─────────          ─────────            ─────────            ─────────            ─────────
  Register org   →   Create employees  →  (Optional)        →  Assign tasks     →   Dashboard &
  (/register)        (/employees)          Add resume           (/tasks)             AI insights
                         │                 (PDF upload)             │                 (/ai-insights)
                         │                       │                  │
                         ▼                       ▼                  ▼
                    System generates        AI extracts         Kanban board:
                    password & sends        skills, role,        drag status,
                    welcome email to       summary (Gemini)      deadlines,
                    employee’s inbox       → pre-fill form      Web3 verify
```

| Stage | What happens |
|-------|----------------|
| **1. Org creation** | Admin registers at `/register`. JWT issued; redirect to `/dashboard`. |
| **2. Create employee** | Admin adds name, email, role, department, skills. **On submit:** backend generates a temporary password, stores hashed password, and **sends a welcome email** (Resend) to the employee’s address (e.g. `praneethdevarasetty31@gmail.com`) with login link and credentials. Employee can log in via **Employee** tab on `/login`. |
| **2b. Add resume (optional)** | Admin uploads a PDF resume. **AI (Gemini)** extracts skills, name, role, summary and pre-fills the create-employee form — **recruiter-friendly**, less manual data entry. |
| **3. Assign tasks** | Admin creates tasks from `/tasks`, assigns to an employee, sets priority and deadline. **Smart Assign** (AI) can suggest the best employee for a task. |
| **4. Dashboard & AI** | Dashboard shows org stats, leaderboard, activity. **AI insights:** Copilot Q&A, org skill gap heatmap, daily insight, all with **24h server-side cache** to reduce cost and latency. |

### Employee flow

```
  Stage 1                Stage 2                Stage 3                Stage 4
  ─────────              ─────────               ─────────              ─────────
  Receive email      →   Login (Employee    →   My Tasks            →   My Profile &
  (credentials)          tab on /login)         (/my-tasks)              Skill Gap
                               │                     │                         │
                               ▼                     ▼                         ▼
                          JWT with             Kanban: move            Edit skills,
                          employeeId           status (drag),          wallet, change
                          → /employee-         Log to Chain            password, view
                          dashboard            (MetaMask)              AI learning plan
```

| Stage | What happens |
|-------|----------------|
| **1. Receive email** | Employee gets welcome email with login URL, email, and temporary password. |
| **2. Login** | Employee uses **Employee** tab on `/login`. JWT includes `employeeId`; redirect to `/employee-dashboard`. |
| **3. My tasks** | View and update task status (e.g. Todo → In progress → Completed). For completed tasks, **Log to Chain** signs via MetaMask and stores proof on profile. |
| **4. Profile & skill gap** | Edit own skills, connect wallet, change password. **Skill gap** page shows AI-generated missing skills and a 30-day learning plan (cached 24h). |

### Best practices we use

- **AI caching:** Skill gap, daily insight, and org skill gap responses are cached for 24 hours to limit Gemini calls and keep the app fast and cost-effective.
- **Recruiter-friendly:** Resume upload + AI extraction reduces manual data entry; welcome email with credentials ensures new hires can log in immediately.
- **Dual-role auth:** Clear separation (admin vs employee) with role-specific routes and layouts; no cross-role access.
- **Web3 optional:** Task verification on-chain is optional; core HR flows work without MetaMask.

For **GTM plan** (target personas, 3-month roadmap, ₹5,000 marketing experiment, revenue streams), see **[GTM_PLAN.md](./GTM_PLAN.md)**.

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

## GTM & strategy

Go-to-market plan (target company size, HR personas, 3-month roadmap, ₹5,000 marketing experiment, revenue streams): **[GTM_PLAN.md](./GTM_PLAN.md)**.
