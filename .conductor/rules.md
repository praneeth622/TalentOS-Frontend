---
description: TalentOS Backend Rules
globs: ["backend/**/*"]
alwaysApply: true
---

# TalentOS Backend Rules

## Architecture Pattern — Strict 3 Layer
1. Route → just defines the path and calls controller
2. Controller → validates input, calls service, sends response
3. Service → all business logic and DB queries

## Route Files
- One route file per resource (auth, employee, task, ai, dashboard)
- Routes only do: router.get('/path', authMiddleware, validate(schema), controller)
- Nothing else in route files

## Controller Rules
- Controllers are thin wrappers only
- Pattern always:
  1. Extract validated data from req.body / req.params
  2. Call service function
  3. Return res.json({ success: true, data: result })
- Wrap every controller in try/catch and pass error to next()
- Never write Prisma queries in controllers

## Service Rules
- All Prisma queries go here
- All Gemini API calls go here
- All scoring calculations go here
- Services must be pure functions where possible
- Always return typed data — never return raw Prisma objects without typing

## Prisma Rules
- Import prisma client only from lib/prisma.ts singleton
- Always scope queries by orgId — never fetch data without org filter
- Use select to return only needed fields — never return passwords
- Use transactions for operations that touch multiple tables

## Auth Rules
- JWT secret from process.env.JWT_SECRET only
- Token payload: { orgId, email, iat, exp }
- Token expiry: 7 days
- auth.middleware always attaches decoded token to req.org
- Never trust orgId from request body — always use req.org.orgId

## Validation
- Every route that accepts body must have a Zod schema
- Schemas live in the same file as the route or in a schemas/ folder
- validate middleware runs Zod parse and returns 400 on failure

## Error Pattern
- Create AppError class: new AppError('message', statusCode)
- Throw AppError in services
- Global error middleware in middleware/error.middleware.ts catches all
- Returns: { success: false, error: message, statusCode }
- Never expose stack traces in production

## Response Format (Always Consistent)
Success: { success: true, data: any, message?: string }
Error: { success: false, error: string, statusCode: number }
List: { success: true, data: [], total: number, page: number }

## Environment
- Never hardcode any values — everything from process.env
- Validate all env vars on startup using zod
- App crashes on startup if required env vars missing — better than runtime failure

## Key Dependencies
- express: server
- prisma + @prisma/client: ORM
- bcryptjs: password hashing
- jsonwebtoken: auth tokens
- zod: validation
- @google/generative-ai: Gemini SDK
- cors, helmet, express-rate-limit: security
- morgan: request logging