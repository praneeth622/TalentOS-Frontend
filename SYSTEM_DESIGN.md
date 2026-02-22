# TalentOS — System Design & Architecture

> **AI-Native Workforce Intelligence Platform**
> Full-stack monorepo · Next.js 16 + Node.js/Express + PostgreSQL + Prisma + Gemini AI + MetaMask/Polygon

---

## Live Links

| Resource | URL |
|----------|-----|
| Frontend App | [talentos.praneethd.xyz](https://talentos.praneethd.xyz) |
| Backend API | [talentos-backend.onrender.com](https://talentos-backend.onrender.com) |
| Interactive API Docs (Apidog) | [talentos-api.praneethd.xyz](https://talentos-api.praneethd.xyz/) |
| OpenAPI Spec (raw YAML) | [`backend/openapi.yaml`](backend/openapi.yaml) |
| API Reference (Markdown) | [`backend/docs/API_REFERENCE.md`](backend/docs/API_REFERENCE.md) |

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Monorepo Structure](#3-monorepo-structure)
4. [Database Schema](#4-database-schema)
5. [Backend Architecture](#5-backend-architecture)
6. [API Reference](#6-api-reference)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [AI Integration](#8-ai-integration)
9. [Web3 Integration](#9-web3-integration)
10. [Frontend Architecture](#10-frontend-architecture)
11. [Employee Portal (Dual-Role UI)](#11-employee-portal-dual-role-ui)
12. [Email Service](#12-email-service)
13. [Environment Variables](#13-environment-variables)
14. [Security Model](#14-security-model)
15. [Deployment](#15-deployment)
16. [Scalability Considerations](#16-scalability-considerations)

---

## 1. Project Overview

TalentOS is a Mini AI-HRMS (Human Resource Management System) built for the RizeOS Core Team Internship assessment. It is a full-stack, production-ready workforce intelligence platform with:

| Module | Capability |
|---|---|
| Org & Employee Management | Registration, JWT auth, dual-role login, employee CRUD |
| Task Management | Admin assigns tasks; employees update status via Kanban board |
| Dashboard | Real-time stats, leaderboard, activity feed |
| AI Intelligence | Productivity scoring, skill gap detection, smart assignment, daily insights |
| Web3 | MetaMask wallet connect, task verification via `personal_sign` on Polygon Amoy |
| Email | Resend-powered branded welcome emails with auto-generated credentials |

**User Roles**

| Role | Auth | Access |
|---|---|---|
| **Admin (Organization)** | JWT via `/api/auth/login` | Full CRUD on employees, tasks, all dashboards, AI features |
| **Employee** | JWT via `/api/auth/employee-login` | Own tasks (Kanban), own profile, own score, skill gap |

---

## 2. Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 24 (LTS) |
| Framework | Express.js |
| Language | TypeScript (strict) |
| ORM | Prisma 7.x |
| Database | PostgreSQL (Neon serverless) |
| Auth | JWT (HS256, 7-day expiry) via `jsonwebtoken` |
| Password Hashing | `bcryptjs` (10 rounds) |
| Validation | Zod |
| AI | Google Gemini 2.5 Flash Lite via `@google/generative-ai` |
| Email | Resend SDK |
| File Upload | `multer` (memory storage, PDF only) |
| Security | `helmet`, `cors`, `express-rate-limit` |
| Logging | `morgan` |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion, GSAP, Lenis (smooth scroll) |
| State | Zustand (web3 store), local `useState` |
| Forms | React Hook Form + Zod resolver |
| API Client | Axios (with JWT interceptor) |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Numbers | `react-countup` |
| Toasts | Sonner |
| Web3 | `window.ethereum` (MetaMask) — no ethers.js, raw RPC |

---

## 3. Monorepo Structure

```
TalentOS/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # DB models
│   │   └── migrations/            # Prisma migration history
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts             # Zod env validation (crashes on startup if missing)
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── employee.controller.ts
│   │   │   ├── task.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── ai.controller.ts
│   │   ├── lib/
│   │   │   ├── prisma.ts          # Singleton Prisma client
│   │   │   └── gemini.ts          # Singleton Gemini model factory
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts        # JWT decode → req.org
│   │   │   ├── requireAdmin.middleware.ts
│   │   │   ├── requireEmployee.middleware.ts
│   │   │   ├── validate.middleware.ts    # Zod body validation
│   │   │   ├── upload.middleware.ts      # Multer PDF upload
│   │   │   └── error.middleware.ts       # Global error handler
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── employee.routes.ts
│   │   │   ├── task.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   └── ai.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── employee.service.ts
│   │   │   ├── task.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── ai.service.ts
│   │   │   └── email.service.ts
│   │   ├── types/
│   │   │   └── index.ts           # All TypeScript interfaces
│   │   └── utils/
│   │       └── AppError.ts        # Custom error class
│   ├── docs/
│   │   └── API_REFERENCE.md       # Detailed API docs with curl examples
│   ├── openapi.yaml               # OpenAPI 3.0 spec (26 endpoints)
│   ├── .env                       # Local secrets (not committed)
│   ├── .env.docker                # Docker/production overrides
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── (dashboard)/           # Admin route group
    │   │   ├── layout.tsx         # Auth guard + admin sidebar
    │   │   ├── dashboard/page.tsx
    │   │   ├── employees/page.tsx
    │   │   ├── employees/[id]/page.tsx
    │   │   ├── tasks/page.tsx
    │   │   └── ai-insights/page.tsx
    │   ├── (employee)/            # Employee route group
    │   │   ├── layout.tsx         # Auth guard + employee sidebar
    │   │   ├── employee-dashboard/page.tsx
    │   │   ├── my-tasks/page.tsx
    │   │   ├── my-profile/page.tsx
    │   │   └── skill-gap/page.tsx
    │   ├── components/
    │   │   ├── landing/           # Navbar, Hero, Features, etc.
    │   │   ├── tasks/             # KanbanBoard, KanbanColumn, KanbanCard, TaskDrawer, TaskDetailModal
    │   │   ├── web3/              # LogToChainButton, WalletButton
    │   │   └── ui/                # PageTransition, ScrollProgress
    │   ├── login/page.tsx
    │   ├── register/page.tsx
    │   ├── pricing/page.tsx
    │   ├── about/page.tsx
    │   └── page.tsx               # Landing page
    ├── lib/
    │   ├── api.ts                 # Axios instance + localStorage helpers
    │   ├── web3.ts                # MetaMask helpers
    │   └── export.ts              # CSV export
    ├── store/
    │   └── web3Store.ts           # Zustand web3 state
    ├── types/
    │   ├── dashboard.ts           # DashboardStats, MyTask, MyProfile, MyScore, etc.
    │   └── tasks.ts               # Task, Employee, ColumnMap
    └── .env                       # NEXT_PUBLIC_API_URL
```

---

## 4. Database Schema

**Prisma schema** (`backend/prisma/schema.prisma`):

```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  employees Employee[]
  tasks     Task[]
  aiCaches  AiCache[]
}

model Employee {
  id            String   @id @default(cuid())
  orgId         String
  name          String
  email         String
  role          String
  department    String
  skills        String[]
  walletAddress String?
  password      String?          // bcrypt hash; null until set
  roleType      String   @default("EMPLOYEE")
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  organization  Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  tasks         Task[]
  @@unique([orgId, email])
}

model Task {
  id            String    @id @default(cuid())
  orgId         String
  employeeId    String
  title         String
  description   String?
  status        String    @default("TODO")    // TODO | IN_PROGRESS | COMPLETED
  priority      String    @default("MEDIUM")  // LOW | MEDIUM | HIGH
  deadline      DateTime?
  completedAt   DateTime?
  txHash        String?                        // MetaMask signature for on-chain proof
  skillRequired String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  organization  Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  employee      Employee     @relation(fields: [employeeId], references: [id], onDelete: Cascade)
}

model AiCache {
  id        String    @id @default(cuid())
  orgId     String
  cacheKey  String
  content   String
  expiresAt DateTime?
  createdAt DateTime  @default(now())
  organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  @@unique([orgId, cacheKey])
}
```

**Key design decisions:**
- `orgId` scopes every query — no cross-org data leakage possible
- `AiCache` stores Gemini responses with TTL to avoid redundant API calls (24h)
- `txHash` stores the MetaMask `personal_sign` signature as on-chain proof
- Employee passwords are nullable — set on creation, always bcrypt-hashed

---

## 5. Backend Architecture

### Strict 3-Layer Pattern

```
Request → Route → Controller → Service → DB
```

| Layer | Responsibility |
|---|---|
| **Route** | Define path, apply middleware, call controller |
| **Controller** | Extract validated data, call ONE service, return `res.json` |
| **Service** | All business logic, all Prisma queries, all Gemini calls |

### Middleware Stack (request order)

```
helmet()              → security headers
cors()                → ALLOWED_ORIGINS from FRONTEND_URL env
morgan('dev')         → request logging
express.json()        → body parsing
express-rate-limit    → 500 req/15min per IP (30/15min for AI)
authMiddleware        → JWT decode → req.org
requireAdmin?         → blocks employees
requireEmployee?      → blocks admins
validate(schema)?     → Zod body validation → 400 on failure
controller            → business logic
errorMiddleware       → global catch-all → { success: false, error, statusCode }
```

### Error Pattern

```typescript
// In services:
throw new AppError('Employee not found', 404);

// Global handler in error.middleware.ts:
res.status(err.statusCode).json({
  success: false,
  error: err.message,
  statusCode: err.statusCode,
});
```

### Response Format

```typescript
// Success
{ success: true, data: any, message?: string }

// Error
{ success: false, error: string, statusCode: number }
```

---

## 6. API Reference

> **Full interactive docs:** [talentos-api.praneethd.xyz](https://talentos-api.praneethd.xyz/)
>
> **Detailed markdown docs with curl examples:** [`backend/docs/API_REFERENCE.md`](backend/docs/API_REFERENCE.md)
>
> **OpenAPI 3.0 spec (import into Postman/Swagger):** [`backend/openapi.yaml`](backend/openapi.yaml)

### Auth (`/api/auth`)

| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/register` | — | Org registration + JWT |
| POST | `/login` | — | Org login + JWT |
| POST | `/employee-login` | — | Employee login + JWT |
| POST | `/change-password` | `authMiddleware + requireEmployee` | Change own password |

### Employees (`/api/employees`)

| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/` | `requireAdmin` | List all org employees |
| POST | `/` | `requireAdmin` | Create employee (auto-generates password, sends email) |
| GET | `/:id` | `requireAdmin` | Get employee by ID |
| PUT | `/:id` | `requireAdmin` | Update employee |
| DELETE | `/:id` | `requireAdmin` | Delete employee |
| GET | `/:id/score` | `requireAdmin` | Productivity score for specific employee |
| GET | `/me` | `requireEmployee` | Own profile |
| GET | `/me/score` | `requireEmployee` | Own productivity score |

### Tasks (`/api/tasks`)

| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/` | `requireAdmin` | All org tasks (filter by `employeeId`, `status`) |
| POST | `/` | `requireAdmin` | Create task |
| PUT | `/:id` | `requireAdmin` | Update task details |
| DELETE | `/:id` | `requireAdmin` | Delete task |
| PATCH | `/:id/status` | `authMiddleware` | Update status (employee can only update own) |
| PATCH | `/:id/txhash` | `authMiddleware` | Save MetaMask signature |
| GET | `/my-tasks` | `requireEmployee` | Own tasks only |

### Dashboard (`/api/dashboard`)

| Method | Path | Guard | Description |
|---|---|---|---|
| GET | `/stats` | `authMiddleware` | Org stats (admin) or personal stats (employee) |
| GET | `/leaderboard` | `requireAdmin` | Employee productivity leaderboard |
| GET | `/activity` | `authMiddleware` | Recent task activity feed (scoped by role) |

### AI (`/api/ai`)

| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/chat` | `requireAdmin` | HR intelligence Q&A (Gemini) |
| GET | `/skill-gap` | `requireAdmin` | Org-wide skill gap analysis (cached 24h) |
| GET | `/skill-gap/me` | `requireEmployee` | Personal skill gap + 30-day learning plan (cached 24h) |
| GET | `/daily-insight` | `requireAdmin` | Daily HR insight (cached 24h) |
| POST | `/smart-assign` | `requireAdmin` | Best employee for a task |
| POST | `/extract-skills` | `authMiddleware` | Parse PDF resume → skills (Gemini) |

---

## 7. Authentication & Authorization

### JWT Payload

```typescript
// Admin token
{ orgId: string, email: string, iat: number, exp: number }

// Employee token
{ orgId: string, email: string, employeeId: string, roleType: 'EMPLOYEE', iat: number, exp: number }
```

- Token expiry: **7 days**
- Algorithm: **HS256**
- Secret: `process.env.JWT_SECRET`

### Auth Middleware (`auth.middleware.ts`)

```typescript
const token = req.headers.authorization?.split(' ')[1];
const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
req.org = payload;  // always available downstream
```

### Role Guards

```typescript
// requireAdmin — blocks employee tokens
if (req.org.employeeId) throw new AppError('Admin access required', 403);

// requireEmployee — blocks admin tokens
if (!req.org.employeeId) throw new AppError('Employee access required', 403);
```

### Frontend Auth Guards

- **Admin layout** (`app/(dashboard)/layout.tsx`): decodes JWT on mount, redirects to `/employee-dashboard` if `payload.employeeId` exists
- **Employee layout** (`app/(employee)/layout.tsx`): decodes JWT on mount, redirects to `/dashboard` if `payload.employeeId` is missing

### localStorage Keys

| Key | Value |
|---|---|
| `talentos_token` | Raw JWT string |
| `talentos_role` | `'admin'` or `'employee'` |
| `talentos_org` | `{ id, name, email }` |
| `talentos_employee` | `{ id, name, email, role, department }` |

---

## 8. AI Integration

All AI features use **Google Gemini 2.5 Flash Lite** via `@google/generative-ai`.

### Productivity Scoring (`employee.service.ts`)

Computed entirely server-side — no Gemini call needed:

```
completionRate  = (completedTasks / totalTasks) * 100
deadlineScore   = (onTimeTasks / completedTasks) * 100
priorityScore   = (highPriorityCompleted / highPriorityTotal) * 100
finalScore      = completionRate*0.4 + deadlineScore*0.35 + priorityScore*0.25
```

Returned as: `{ finalScore, completionRate, deadlineScore, priorityScore, breakdown }`

### AI Chat (`/api/ai/chat`)

- Admin asks any HR question
- Backend fetches team data, serialises to JSON (truncated at 1500 chars)
- Gemini prompt: `"Answer in 3-5 sentences: {question}"` with team context
- No caching — each question is unique

### Skill Gap Analysis — Org-wide (`/api/ai/skill-gap`)

- Fetches all employees with role + skills
- Computes `missingSkills = requiredSkills - currentSkills` per employee using `ROLE_REQUIREMENTS` map
- Sends employee data to Gemini → returns `{ gaps: [{ employeeName, role, missingSkills }], orgRecommendation }`
- **Cached 24h** per orgId in `AiCache` table

### Skill Gap Analysis — Personal (`/api/ai/skill-gap/me`)

- Employee-scoped: only fetches the calling employee's data
- Computes `coveragePercent` + `missingSkills` locally
- Calls Gemini for a personalised 30-day learning plan
- Returns `{ missingSkills, coveragePercent, learningPlan }`
- **Cached 24h** per employeeId (`cacheKey: 'skill-gap-employee-{id}'`)

### Smart Task Assignment (`/api/ai/smart-assign`)

- Admin provides `taskTitle` + `skillRequired`
- Backend fetches all employees with skills + task counts
- Gemini recommends the best employee + reason
- No caching

### Daily Insight (`/api/ai/daily-insight`)

- Fetches org stats (employees, tasks, completion rates)
- Gemini generates one actionable HR insight paragraph
- **Cached 24h** per orgId

### Resume Skill Extraction (`/api/ai/extract-skills`)

- Admin uploads a PDF (`multipart/form-data`, field: `resume`, max 5MB)
- `multer` stores in memory as `Buffer`
- `pdf-parse` extracts raw text
- Gemini extracts: `{ skills[], name, role, summary }`
- No caching

### Caching Strategy

```typescript
// Check cache first
const cached = await prisma.aiCache.findUnique({ where: { orgId_cacheKey: { orgId, cacheKey } } });
if (cached && cached.expiresAt > new Date()) return JSON.parse(cached.content);

// Call Gemini
const result = await model.generateContent(prompt);

// Store with 24h TTL
await prisma.aiCache.upsert({ ... });
```

---

## 9. Web3 Integration

### Wallet Connection (`lib/web3.ts`)

```typescript
connectWallet()          → eth_requestAccounts → returns address
getCurrentAccount()      → eth_accounts → returns current address or null
addPolygonAmoyNetwork()  → wallet_addEthereumChain (chainId: 0x13882)
signTaskCompletion()     → personal_sign with structured message
getShortAddress()        → "0x1234...5678"
```

### Task Verification Flow

1. Employee opens a `COMPLETED` task
2. Clicks **"Log to Chain"** button
3. Frontend calls `addPolygonAmoyNetwork()` silently
4. Calls `connectWallet()` to get MetaMask address
5. Constructs message: `TalentOS Task Verification\nTask: {title}\nID: {id}\nVerified by: {address}\nTime: {ISO}`
6. Calls `personal_sign` → MetaMask shows modal → user signs
7. Signature saved to DB via `PATCH /api/tasks/:id/txhash`
8. Card shows **"Verified on-chain"** green badge

**Note:** This uses wallet signatures (not smart contract transactions) as lightweight on-chain proof. The signature hash is stored as `txHash` in PostgreSQL.

### Network

- **Polygon Amoy Testnet** (chainId: `0x13882`)
- Explorer: `https://amoy.polygonscan.com`

---

## 10. Frontend Architecture

### Axios Client (`lib/api.ts`)

```typescript
const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('talentos_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Route Groups

| Group | Layout | Color | Auth Guard |
|---|---|---|---|
| `(dashboard)` | Admin sidebar + TopBar | Blue | Redirect employees to `/employee-dashboard` |
| `(employee)` | Employee sidebar | Teal | Redirect admins to `/dashboard` |
| Root | Landing Navbar | — | — |

### Kanban Board (`app/components/tasks/`)

- `KanbanBoard` — wraps `@dnd-kit/core` DnD context, handles drag-start/over/end
- `KanbanColumn` — droppable zone per status column
- `KanbanCard` — sortable card; optimistic moves during drag; API call on drop
- `TaskDrawer` — slide-in panel for creating new tasks
- `TaskDetailModal` — Jira-style full modal for editing existing tasks

**Drag and drop status mapping:**
- Column `ASSIGNED` → API status `TODO`
- Column `IN_PROGRESS` → API status `IN_PROGRESS`
- Column `COMPLETED` → API status `COMPLETED`

### Data Fetching Pattern

All pages use `useCallback + useEffect` with explicit loading/error state:

```typescript
const fetchData = useCallback(() => {
  setLoading(true);
  api.get('/api/...')
    .then(r => setState(r.data.data))
    .catch(() => toast.error('...'))
    .finally(() => setLoading(false));
}, []);

useEffect(() => { fetchData(); }, [fetchData]);
```

### Form Handling

React Hook Form + Zod resolver throughout. Pattern:

```typescript
const schema = z.object({ email: z.string().email(), ... });
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

### Animation Libraries

| Library | Used For |
|---|---|
| Framer Motion | Page transitions, card animations, progress bars, tab switches, DragOverlay |
| GSAP | Landing page complex animations |
| Lenis | Smooth scroll on landing page |
| react-countup | Animated stat numbers on dashboard |

---

## 11. Employee Portal (Dual-Role UI)

### Pages

| Route | Component | Description |
|---|---|---|
| `/employee-dashboard` | `employee-dashboard/page.tsx` | Stats, score breakdown, recent tasks |
| `/my-tasks` | `my-tasks/page.tsx` | Full Kanban board (reuses admin components) |
| `/my-profile` | `my-profile/page.tsx` | Profile, skills edit, wallet, score, change password, skill gap card |
| `/skill-gap` | `skill-gap/page.tsx` | Dedicated AI skill gap + 30-day learning plan |

### Key Components

**EmployeeSidebar** (`app/(employee)/components/EmployeeSidebar.tsx`)
- Teal colour scheme (vs admin's blue)
- 4 nav links: Dashboard, My Tasks, My Profile, Skill Gap
- Employee identity card at bottom (name + role from localStorage)
- Logout: `clearAuth() → router.replace('/login')`

**My Tasks — Kanban Board**
- Reuses `KanbanBoard`, `KanbanColumn`, `KanbanCard`, `TaskDetailModal` directly
- Fetches from `GET /api/tasks/my-tasks` (employee-scoped)
- Maps `MyTask[]` → `Task[]` for component compatibility
- Delete action shows toast: "Only admins can delete tasks"
- No "Add Task" button

**Skill Edit in My Profile**
- Local `localSkills` state copy of `profile.skills`
- Add skill: text input + Enter or button, deduplication enforced
- Remove skill: × button on each chip
- Save: `PUT /api/employees/:id { skills }` → invalidates skill gap cache

**LogToChainButton** (`app/(employee)/components/LogToChainButton.tsx`)
- Only renders for `COMPLETED` tasks with no `txHash`
- Full MetaMask flow: install check → connect → sign → PATCH → toast

---

## 12. Email Service

**Provider:** Resend (`resend` npm package)

**From address:** `TalentOS <noreply@talentos.praneethd.xyz>` (verified domain required by Resend)

**Trigger:** When admin creates an employee (`POST /api/employees`)

**Flow:**
```
createEmployee() service
  → generatePassword()          # crypto.randomBytes(9).toString('base64url')
  → bcrypt.hash(plain, 10)      # hash stored in DB
  → sendWelcomeEmail(email, name, password, orgName)
    → Resend API POST /emails
      from: TalentOS <noreply@talentos.praneethd.xyz>
      subject: Welcome to {orgName} — Your TalentOS Account
      html: branded HTML email with credentials + login CTA
```

**Why not Gmail?** Resend requires you to send from a verified domain. Using a Gmail address causes `Domain not verified` error. The domain `talentos.praneethd.xyz` is verified in the Resend dashboard.

**Graceful skip:** If `RESEND_API_KEY` is not set, the service logs and skips silently (dev-friendly).

---

## 13. Environment Variables

### Backend (`.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon) |
| `JWT_SECRET` | Yes | HMAC secret for JWT signing |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `PORT` | — | HTTP port (default: 5001) |
| `FRONTEND_URL` | — | Comma-separated allowed CORS origins |
| `NODE_ENV` | — | `development` / `production` |
| `RESEND_API_KEY` | — | Resend API key (email skipped if missing) |
| `RESEND_FROM_EMAIL` | — | `TalentOS <noreply@talentos.praneethd.xyz>` |

Validated on startup via Zod in `src/config/env.ts` — **app crashes if required vars missing**.

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (`https://talentos-backend.onrender.com`) |

For local dev, create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 14. Security Model

| Concern | Approach |
|---|---|
| Password storage | `bcryptjs` 10 rounds — never stored plain |
| JWT secrets | From `process.env.JWT_SECRET` only, never hardcoded |
| OrgId trust | Always from `req.org.orgId` (JWT), never from request body |
| Cross-org access | Every Prisma query scoped by `orgId` |
| Employee access | `requireEmployee` middleware on all employee-only routes |
| Admin access | `requireAdmin` middleware blocks employees from admin routes |
| Ownership checks | Employees can only update status/txHash on their own tasks |
| Request validation | Zod schema on every route with a body — 400 on failure |
| HTTP headers | `helmet()` sets `X-Content-Type-Options`, `X-Frame-Options`, HSTS etc. |
| Rate limiting | `express-rate-limit`: 500 req/15min general, 30 req/15min AI |
| CORS | Whitelist of specific origins only (no wildcard `*`) |
| Passwords in responses | Never — Prisma `select` explicitly excludes `password` field |
| Stack traces | Never exposed in production — only in `development` NODE_ENV |

---

## 15. Deployment

| Component | Platform | URL |
|---|---|---|
| Frontend | Vercel (Next.js) | [talentos.praneethd.xyz](https://talentos.praneethd.xyz) |
| Backend | Render (Node.js) | [talentos-backend.onrender.com](https://talentos-backend.onrender.com) |
| Database | Neon (serverless PostgreSQL) | Connection pooler endpoint |
| Email | Resend | Domain: `talentos.praneethd.xyz` |
| API Docs | Apidog | [talentos-api.praneethd.xyz](https://talentos-api.praneethd.xyz/) |
| Docker Hub (backend) | Docker | [praneeth0331](https://app.docker.com/accounts/praneeth0331) — `praneeth0331/talentos-backend:latest` |

### Backend via Docker

For self-hosting the API, use the published image:

```bash
docker pull praneeth0331/talentos-backend:latest
```

Then run with Docker Compose (see `backend/docker-compose.yml`): backend + optional local Postgres. Set `JWT_SECRET`, `GEMINI_API_KEY`, `FRONTEND_URL` in `.env`. The image runs `prisma migrate deploy` on startup then starts the server.

### CORS Configuration

Backend `FRONTEND_URL` env var:
```
FRONTEND_URL="https://talentos.praneethd.xyz,http://localhost:3000"
```

Parsed at startup:
```typescript
const ALLOWED_ORIGINS = process.env.FRONTEND_URL
  .split(',')
  .map(o => o.trim().replace(/\/$/, ''));

cors({ origin: (origin, cb) => {
  if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
  cb(new Error(`CORS blocked: ${origin}`));
}})
```

---

## 16. Scalability Considerations

### Database
- **Connection pooling**: Neon serverless handles this automatically; for self-hosted Postgres, use PgBouncer
- **Indexes**: Add `orgId` composite indexes for high-traffic tables (`employees`, `tasks`)
- **Read replicas**: Route dashboard/leaderboard queries to replicas

### AI Caching
- AI responses are cached in `AiCache` table for 24 hours
- At 100K employees: per-employee skill gap cache prevents N×Gemini API calls on every page load
- For org-wide analysis, batch employees into chunks and cache aggregate results

### Task Scale (1M task logs)
- Add `status` + `orgId` composite indexes: `@@index([orgId, status])`
- Archive completed tasks older than 90 days to a separate `task_archive` table
- Paginate all task list queries (currently uses `OFFSET`, migrate to cursor-based pagination)

### Auth
- JWT is stateless — horizontal scaling works out of the box
- Token revocation: implement a Redis-based token blacklist if needed

### Email
- Resend handles delivery, bounces, and retries
- For high volume, queue email sends via a background job worker (BullMQ + Redis)

### Frontend
- Next.js static generation for all public pages
- `use client` only where needed (interactive pages)
- Kanban board uses optimistic updates to avoid full refetches on every drag

---

*Built for the RizeOS Core Team Internship assessment — demonstrating clean architecture, AI integration, Web3 readiness, and product-level scalability awareness.*
