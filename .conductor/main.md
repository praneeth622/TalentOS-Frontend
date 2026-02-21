---
description: TalentOS — Global Rules for all files
globs: ["**/*"]
alwaysApply: true
---

# TalentOS Project — Global Rules

## Project Identity
- Project name: TalentOS
- Tagline: AI-native workforce intelligence platform
- Stack: Next.js 16 + Node.js/Express + PostgreSQL + Prisma + Gemini AI + Ethers.js
- Monorepo: /frontend and /backend are separate apps in one workspace

## Code Style (Always)
- Use TypeScript everywhere — no plain .js files ever
- Use named exports, not default exports (except Next.js pages)
- Use async/await — never .then() chains
- No any type — always define proper interfaces
- Use early returns to avoid nested if blocks
- Keep functions small — one function does one thing
- Always handle errors — never silent catch blocks
- Use descriptive variable names — no x, y, temp, data

## Naming Conventions
- Components: PascalCase (EmployeeCard.tsx)
- Hooks: camelCase with use prefix (useEmployees.ts)
- Services: camelCase with Service suffix (ai.service.ts)
- Routes: kebab-case URLs (/api/ai-insights)
- DB fields: camelCase in Prisma schema
- Env vars: SCREAMING_SNAKE_CASE

## File Organization
- Never put business logic in controllers — that belongs in services
- Never put DB queries outside of services
- Never put API calls directly in React components — use hooks
- All types go in frontend/types/index.ts or backend/src/types/index.ts

## Comments
- Only comment WHY, never WHAT
- Add JSDoc to all service functions
- Every AI-related function must have a comment explaining the prompt strategy

## Error Handling
- Backend: always use the global error middleware, throw errors with status codes
- Frontend: all React Query errors must show a Sonner toast
- Never expose raw DB or Prisma errors to the client

## Security
- Never log JWT tokens or passwords
- Always validate request body with Zod before touching the DB
- All protected routes must go through auth.middleware
- Never trust client-sent orgId — always extract from JWT